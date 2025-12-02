/*
  # Create partnership inquiries table

  1. New Tables
    - `partnership_inquiries`
      - `id` (uuid, primary key)
      - `company_name` (text) - Name of the company
      - `contact_name` (text) - Name of the contact person
      - `email` (text) - Contact email address
      - `phone` (text, optional) - Contact phone number
      - `website` (text, optional) - Company website
      - `interest_level` (text) - Level of interest in partnership
      - `message` (text) - Partnership inquiry message
      - `status` (text) - Inquiry status (pending, contacted, accepted, declined)
      - `created_at` (timestamptz) - Timestamp of submission
      - `updated_at` (timestamptz) - Last update timestamp
      - `notes` (text, optional) - Internal notes about the inquiry
  
  2. Security
    - Enable RLS on `partnership_inquiries` table
    - Add policy for anyone to submit an inquiry (insert)
    - Add policy for authenticated users to view their own inquiries (select)
  
  3. Indexes
    - Index on email for quick lookups
    - Index on status for filtering
    - Index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS partnership_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  website text,
  interest_level text NOT NULL DEFAULT 'Interested',
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  notes text
);

ALTER TABLE partnership_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit partnership inquiry"
  ON partnership_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own inquiries"
  ON partnership_inquiries
  FOR SELECT
  TO authenticated
  USING (
    email IN (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_partnership_inquiries_email ON partnership_inquiries(email);
CREATE INDEX IF NOT EXISTS idx_partnership_inquiries_status ON partnership_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_partnership_inquiries_created_at ON partnership_inquiries(created_at DESC);

CREATE OR REPLACE FUNCTION update_partnership_inquiry_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER partnership_inquiries_updated_at
  BEFORE UPDATE ON partnership_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_partnership_inquiry_updated_at();