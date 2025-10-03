
import { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getSubscriptionStatus, getPaymentHistory, getBusiness, getCurrentUser } from '@/lib/actions';
import { BillingContent } from '@/components/dashboard/billing-content';
import { format } from 'date-fns';
import type { FormattedInvoice, SubscriptionStatus } from '@/lib/actions';

export default async function BillingPage() {
  const user = await getCurrentUser();

  if (!user || !user.businessId) {
    return (
      <Card>
        <CardHeader><CardTitle>Error</CardTitle></CardHeader>
        <CardContent><p>Could not load billing information. User or business not found.</p></CardContent>
      </Card>
    );
  }

  const [bizData, subData, payHistoryData] = await Promise.all([
    getBusiness(user.businessId),
    getSubscriptionStatus(user.businessId),
    getPaymentHistory(user.businessId),
  ]);
    
  if (!bizData) {
      return (
        <Card>
          <CardHeader><CardTitle>Error</CardTitle></CardHeader>
          <CardContent><p>Could not load business information.</p></CardContent>
        </Card>
      );
  }

  const formattedSubData = {
    ...subData,
    formattedRenewsAt: subData.renewsAt ? format(subData.renewsAt, 'PPP') : null,
    rawRenewsAt: subData.renewsAt ? subData.renewsAt.toISOString() : null
  }

  const formattedPaymentHistory: FormattedInvoice[] = (payHistoryData.invoices || []).map(invoice => ({
      ...invoice,
      date: format(invoice.date, 'PPP'),
  }));
    
  return (
      <Suspense fallback={<div>Loading subscription details...</div>}>
          <BillingContent 
              subscriptionData={formattedSubData}
              paymentHistory={formattedPaymentHistory}
              businessId={bizData.id}
              email={user.email}
          />
      </Suspense>
  )
}
