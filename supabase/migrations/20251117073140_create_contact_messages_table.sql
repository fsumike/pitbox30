/*
  # Create Contact Messages Table

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `subject` (text, required)
      - `message` (text, required)
      - `status` (text, default: 'new') - 'new', 'read', 'replied', 'resolved'
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on contact_messages table
    - Only admins can read messages (public can insert via Edge Function)
  
  3. Indexes
    - Add index on created_at for sorting
    - Add index on status for filtering
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'resolved')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- No public access policies - messages are stored but only admins can view
-- This prevents spam and keeps contact info secure

-- Create indexes for admin panel
CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS contact_messages_status_idx ON contact_messages(status);
CREATE INDEX IF NOT EXISTS contact_messages_email_idx ON contact_messages(email);

-- Add updated_at trigger
CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();