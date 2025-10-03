-- Add 'pending_cancellation' to the business status enum type

ALTER TYPE public.business_status ADD VALUE 'pending_cancellation';
