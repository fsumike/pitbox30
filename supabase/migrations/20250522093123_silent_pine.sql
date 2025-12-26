/*
  # Add Terms of Use Acceptance Table

  1. New Tables
    - `terms_acceptance`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `accepted_at` (timestamptz)
      - `signature` (text)
      - `ip_address` (text)
      - `terms_version` (text)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on terms_acceptance table
    - Add policies for authenticated users
*/

-- Create terms_acceptance table
CREATE TABLE IF NOT EXISTS terms_acceptance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  accepted_at timestamptz NOT NULL,
  signature text NOT NULL,
  ip_address text,
  terms_version text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, terms_version)
);

-- Enable Row Level Security
ALTER TABLE terms_acceptance ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own terms acceptance"
  ON terms_acceptance
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own terms acceptance"
  ON terms_acceptance
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);