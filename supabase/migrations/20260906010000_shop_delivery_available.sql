-- Add delivery availability flag for shops
ALTER TABLE public.shops
ADD COLUMN IF NOT EXISTS delivery_available boolean NOT NULL DEFAULT false;
