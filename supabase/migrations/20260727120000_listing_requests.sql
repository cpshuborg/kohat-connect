-- Business listing requests submitted from the public "List your business" form
CREATE TABLE public.listing_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_name text NOT NULL,
  whatsapp text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT listing_requests_status_check
    CHECK (status IN ('pending', 'reviewed', 'rejected'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.listing_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listing_requests TO authenticated;
GRANT ALL ON public.listing_requests TO service_role;

ALTER TABLE public.listing_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert listing requests"
  ON public.listing_requests FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read listing requests (no admin auth yet)"
  ON public.listing_requests FOR SELECT USING (true);

CREATE POLICY "Anyone can update listing requests (no admin auth yet)"
  ON public.listing_requests FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete listing requests (no admin auth yet)"
  ON public.listing_requests FOR DELETE USING (true);

CREATE TRIGGER listing_requests_set_updated_at
BEFORE UPDATE ON public.listing_requests
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX listing_requests_created_at_idx
  ON public.listing_requests (created_at DESC);

CREATE INDEX listing_requests_status_idx
  ON public.listing_requests (status);

-- Storage policies for the existing request-images bucket
CREATE POLICY "Public can read request-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'request-images');

CREATE POLICY "Anyone can upload request-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'request-images');

CREATE POLICY "Anyone can update request-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'request-images')
  WITH CHECK (bucket_id = 'request-images');

CREATE POLICY "Anyone can delete request-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'request-images');
