/*
  # Add Subscription Tables

  1. New Tables
    - `user_subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `subscription_id` (text)
      - `status` (text)
      - `tier` (text)
      - `current_period_end` (timestamptz)
      - `cancel_at_period_end` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on user_subscriptions table
    - Add policies for authenticated users
*/

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subscription_id text NOT NULL,
  status text NOT NULL,
  tier text NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, subscription_id)
);

-- Enable Row Level Security
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own subscriptions"
  ON user_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();