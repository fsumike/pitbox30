/*
  # Swap Meet Schema Implementation

  1. New Tables
    - `listings`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References profiles
      - `title` (text)
      - `description` (text)
      - `price` (numeric)
      - `category` (text)
      - `location` (text)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `status` (text) - 'active', 'sold', 'expired'
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `listing_images`
      - `id` (uuid, primary key)
      - `listing_id` (uuid) - References listings
      - `url` (text)
      - `order` (integer) - For image ordering
      - `created_at` (timestamp)
    
    - `listing_likes`
      - `id` (uuid, primary key)
      - `listing_id` (uuid) - References listings
      - `user_id` (uuid) - References profiles
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  category text NOT NULL,
  location text NOT NULL,
  latitude numeric,
  longitude numeric,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'expired')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create listing_images table
CREATE TABLE IF NOT EXISTS listing_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  "order" integer NOT NULL CHECK ("order" BETWEEN 1 AND 4),
  created_at timestamptz DEFAULT now(),
  UNIQUE(listing_id, "order")
);

-- Create listing_likes table
CREATE TABLE IF NOT EXISTS listing_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(listing_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_likes ENABLE ROW LEVEL SECURITY;

-- Listings Policies
CREATE POLICY "Anyone can read active listings"
  ON listings
  FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Users can create their own listings"
  ON listings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings"
  ON listings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings"
  ON listings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Listing Images Policies
CREATE POLICY "Anyone can view listing images"
  ON listing_images
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can add images to their listings"
  ON listing_images
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_id
      AND listings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete images from their listings"
  ON listing_images
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_id
      AND listings.user_id = auth.uid()
    )
  );

-- Listing Likes Policies
CREATE POLICY "Anyone can view listing likes"
  ON listing_likes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can like listings"
  ON listing_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike listings"
  ON listing_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add updated_at trigger to listings
CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();