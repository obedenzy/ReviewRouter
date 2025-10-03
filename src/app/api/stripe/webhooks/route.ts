
// src/app/api/stripe/webhooks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createSupabaseAdminClient } from '@/lib/supabase';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const supabase = createSupabaseAdminClient();

// Get the webhook secret from environment variables
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    // Verify the event came from Stripe
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log(`✅ Received Stripe event: ${event.type}`);

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const businessId = session.client_reference_id;
      
      console.log(`[checkout.session.completed] Processing for client_reference_id (businessId): ${businessId}`);
      
      if (!businessId) {
        console.error('❌ [checkout.session.completed] Webhook Error: Missing businessId (client_reference_id) in checkout session.');
        break;
      }
      
      if (!session.subscription) {
          console.error(`❌ [checkout.session.completed] Webhook error for business ${businessId}: Checkout session is missing subscription ID.`);
          break;
      }
      
      console.log(`[checkout.session.completed] Session completed for business ID: ${businessId}`);
      
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      console.log(`[checkout.session.completed] Retrieved subscription ${subscription.id} for business ${businessId}.`);

      const { error } = await supabase
        .from('businesses')
        .update({
          status: 'active',
          stripe_customer_id: subscription.customer as string,
          stripe_subscription_id: subscription.id,
          renews_at: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq('id', businessId);
      
      if (error) {
        console.error(`❌ [checkout.session.completed] Supabase error updating business ${businessId}:`, error.message);
      } else {
        console.log(`✅ [checkout.session.completed] Business ${businessId} status updated to 'active' and subscription ID stored.`);
      }
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = invoice.subscription as string;
      const customerId = invoice.customer as string;

      if (subscriptionId) {
        console.log(`[invoice.payment_succeeded] Processing for subscription: ${subscriptionId}, Customer: ${customerId}`);
        
        const { data: business, error: findError } = await supabase
            .from('businesses')
            .select('id')
            .eq('stripe_subscription_id', subscriptionId)
            .single();

        if (findError || !business) {
            console.error('❌ [invoice.payment_succeeded] Supabase error finding business for subscription', subscriptionId, findError?.message);
            break;
        }

        console.log(`[invoice.payment_succeeded] Found business ${business.id} for subscription ${subscriptionId}.`);
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const { error: updateError } = await supabase
            .from('businesses')
            .update({
                status: 'active',
                renews_at: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('id', business.id);
        
        if (updateError) {
             console.error(`❌ [invoice.payment_succeeded] Supabase error updating business ${business.id} renewal:`, updateError.message);
        } else {
            console.log(`✅ [invoice.payment_succeeded] Business ${business.id} renewal date updated.`);
        }
      } else {
          console.log('[invoice.payment_succeeded] Received for an invoice without a subscription ID. Skipping.');
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = invoice.subscription as string;

      if (!subscriptionId) {
        console.log('[invoice.payment_failed] Received for an invoice without a subscription ID. Skipping.');
        break;
      }

      console.log(`[invoice.payment_failed] Processing for subscription: ${subscriptionId}`);
      const { error } = await supabase
        .from('businesses')
        .update({ status: 'inactive' })
        .eq('stripe_subscription_id', subscriptionId);

      if (error) {
        console.error(`❌ [invoice.payment_failed] Supabase error updating business status to inactive for subscription ${subscriptionId}:`, error.message);
      } else {
        console.log(`✅ [invoice.payment_failed] Business with subscription ID ${subscriptionId} status updated to 'inactive' due to failed payment.`);
      }
      break;
    }

    case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        // Handle cancellation
        if (subscription.cancel_at_period_end) {
            console.log(`[customer.subscription.updated] Subscription ${subscription.id} is scheduled for cancellation.`);
            const { error } = await supabase
                .from('businesses')
                .update({ status: 'pending_cancellation' })
                .eq('stripe_subscription_id', subscription.id);

            if (error) {
                console.error(`❌ [customer.subscription.updated] Supabase error updating business status to pending_cancellation for subscription ${subscription.id}:`, error.message);
            } else {
                console.log(`✅ [customer.subscription.updated] Business status for subscription ${subscription.id} set to 'pending_cancellation'.`);
            }
        } else {
            // Handle reactivation
            console.log(`[customer.subscription.updated] Subscription ${subscription.id} is being reactivated or updated.`);
             const { error } = await supabase
                .from('businesses')
                .update({ status: 'active' })
                .eq('stripe_subscription_id', subscription.id);
            if (error) {
                console.error(`❌ [customer.subscription.updated] Supabase error updating business status to active for subscription ${subscription.id}:`, error.message);
            } else {
                console.log(`✅ [customer.subscription.updated] Business status for subscription ${subscription.id} set to 'active'.`);
            }
        }
        break;
    }

    case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`[customer.subscription.deleted] Processing for subscription ${subscription.id}.`);

        const { error } = await supabase
            .from('businesses')
            .update({ status: 'inactive' })
            .eq('stripe_subscription_id', subscription.id);

        if (error) {
            console.error(`❌ [customer.subscription.deleted] Supabase error updating business status to inactive for subscription ${subscription.id}:`, error.message);
        } else {
            console.log(`✅ [customer.subscription.deleted] Business with subscription ID ${subscription.id} status updated to 'inactive' due to subscription cancellation.`);
        }
        break;
    }

    default:
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
  }

  // Acknowledge receipt of the event
  return NextResponse.json({ received: true });
}
