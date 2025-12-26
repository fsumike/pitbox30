/*
  # Add Friends System

  1. New Tables
    - `friend_requests`
      - `id` (uuid, primary key)
      - `sender_id` (uuid, references profiles)
      - `receiver_id` (uuid, references profiles)
      - `status` (text) - 'pending', 'accepted', 'declined'
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `friendships`
      - `id` (uuid, primary key)
      - `user_id1` (uuid, references profiles)
      - `user_id2` (uuid, references profiles)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create friend_requests table
CREATE TABLE IF NOT EXISTS friend_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  -- Prevent duplicate requests
  UNIQUE(sender_id, receiver_id)
);

-- Create friendships table
CREATE TABLE IF NOT EXISTS friendships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id1 uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  user_id2 uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  -- Ensure unique friendships and consistent ordering (user_id1 < user_id2)
  CONSTRAINT user_id_order CHECK (user_id1 < user_id2),
  UNIQUE(user_id1, user_id2)
);

-- Enable Row Level Security
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

-- Policies for friend_requests
CREATE POLICY "Users can see requests they're involved in"
  ON friend_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (sender_id, receiver_id));

CREATE POLICY "Users can send friend requests"
  ON friend_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    sender_id != receiver_id AND
    NOT EXISTS (
      SELECT 1 FROM friendships
      WHERE (user_id1 = sender_id AND user_id2 = receiver_id)
      OR (user_id1 = receiver_id AND user_id2 = sender_id)
    )
  );

CREATE POLICY "Users can update their received requests"
  ON friend_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id)
  WITH CHECK (status IN ('accepted', 'declined'));

-- Policies for friendships
CREATE POLICY "Users can see their friendships"
  ON friendships
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (user_id1, user_id2));

CREATE POLICY "System can create friendships"
  ON friendships
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM friend_requests
      WHERE status = 'accepted'
      AND ((sender_id = user_id1 AND receiver_id = user_id2)
        OR (sender_id = user_id2 AND receiver_id = user_id1))
    )
  );

-- Add updated_at trigger to friend_requests
CREATE TRIGGER update_friend_requests_updated_at
  BEFORE UPDATE ON friend_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create function to handle accepted friend requests
CREATE OR REPLACE FUNCTION handle_accepted_friend_request()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    -- Insert friendship with ordered user IDs
    INSERT INTO friendships (user_id1, user_id2)
    SELECT
      LEAST(NEW.sender_id, NEW.receiver_id),
      GREATEST(NEW.sender_id, NEW.receiver_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for handling accepted friend requests
CREATE TRIGGER on_friend_request_accepted
  AFTER UPDATE ON friend_requests
  FOR EACH ROW
  EXECUTE FUNCTION handle_accepted_friend_request();