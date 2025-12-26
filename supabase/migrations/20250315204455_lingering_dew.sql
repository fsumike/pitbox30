/*
  # Add Messages Table for Chat Feature

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `sender_id` (uuid, references profiles)
      - `receiver_id` (uuid, references profiles)
      - `content` (text)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on messages table
    - Add policies for authenticated users to:
      - Read their own messages
      - Send messages
*/

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = sender_id OR
    auth.uid() = receiver_id
  );

CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Create index for better query performance
CREATE INDEX messages_sender_receiver_idx ON messages(sender_id, receiver_id);
CREATE INDEX messages_created_at_idx ON messages(created_at DESC);