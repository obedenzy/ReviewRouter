

export type Review = {
  id: string;
  customerName: string;
  email: string | null;
  rating: number;
  comment: string;
  createdAt: Date; 
  createdAtFormatted?: string; 
};

export type User = {
    name: string;
    email: string;
    avatarUrl?: string;
    businessId: string;
}

export type TeamUser = {
  id: string;
  businessId: string;
  name: string;
  email: string;
  role: 'Admin' | 'Standard';
  status: 'active' | 'invited';
  lastLogin: Date | null; 
  createdAt: Date; 
  email_verified: boolean;
  verification_code?: string | null;
  verification_expires_at?: Date | null;
}

export type FormattedTeamUser = Omit<TeamUser, 'createdAt' | 'lastLogin' | 'verification_expires_at'> & {
    createdAt: string; // ISO string
    lastLogin: string | null; // ISO string
    verification_expires_at: string | null;
    createdAtFormatted: string;
    lastLoginFormatted: string;
}

export type SuperAdminUser = {
    name: string;
    email: string;
}

export type Business = {
    id: string;
    name: string;
    ownerName: string;
    ownerEmail: string;
    status: 'active' | 'inactive' | 'pending_cancellation';
    subscriptionAmount: number;
    createdAt: string;
    renewsAt: string | null;
    userCount: number;
    stripe_customer_id?: string;
    stripe_subscription_id?: string;
    stripeProductId?: string;
    stripePriceId?: string;
    logoUrl?: string;
    redirect_threshold: number;
    google_review_url: string | null;
}

export type Payment = {
    id: string;
    businessId: string;
    businessName: string;
    amount: number;
    date: Date;
    status: 'succeeded' | 'failed' | 'pending' | string;
}

export type Database = {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string
          created_at: string
          name: string
          owner_name: string
          owner_email: string
          status: "active" | "inactive" | "pending_cancellation"
          subscription_amount: number
          renews_at: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          stripe_product_id: string | null
          stripe_price_id: string | null
          logo_url: string | null
          redirect_threshold: number
          google_review_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          name: string
          owner_name: string
          owner_email: string
          status: "active" | "inactive" | "pending_cancellation"
          subscription_amount: number
          renews_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_product_id?: string | null
          stripe_price_id?: string | null
          logo_url?: string | null
          redirect_threshold?: number
          google_review_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          owner_name?: string
          owner_email?: string
          status?: "active" | "inactive" | "pending_cancellation"
          subscription_amount?: number
          renews_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_product_id?: string | null
          stripe_price_id?: string | null
          logo_url?: string | null
          redirect_threshold?: number
          google_review_url?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          created_at: string
          business_id: string
          rating: number
          comment: string
          customer_name: string | null
          email: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          business_id: string
          rating: number
          comment: string
          customer_name?: string | null
          email?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          business_id?: string
          rating?: number
          comment?: string
          customer_name?: string | null
          email?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          created_at: string
          business_id: string
          name: string
          email: string
          password: string
          role: "Admin" | "Standard"
          status: "active" | "invited"
          last_login: string | null
          email_verified: boolean
          verification_code: string | null
          verification_expires_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          business_id: string
          name: string
          email: string
          password: string
          role: "Admin" | "Standard"
          status: "active" | "invited"
          last_login?: string | null
          email_verified?: boolean
          verification_code?: string | null
          verification_expires_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          business_id?: string
          name?: string
          email?: string
          password?: string
          role?: "Admin" | "Standard"
          status?: "active" | "invited"
          last_login?: string | null
          email_verified?: boolean
          verification_code?: string | null
          verification_expires_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_business_id_fkey"
            columns: ["business_id"]
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]


    