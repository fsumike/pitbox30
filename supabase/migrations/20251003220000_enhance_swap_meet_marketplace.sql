/*
  # Enhance Swap Meet Marketplace with Modern Features

  1. Schema Enhancements
    - Add contact information to listings table
    - Add vehicle_type for better categorization
    - Add view counts and featured status
    - Create reviews and ratings system
    - Create offers and negotiations system
    - Add listing reports for moderation
    - Add saved searches functionality

  2. New Tables
    - `listing_reviews` - User reviews and ratings for sellers
    - `listing_offers` - Offer and negotiation system
    - `listing_views` - Track listing views for analytics
    - `saved_searches` - Save search criteria
    - `listing_reports` - Report inappropriate listings

  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies for each table
*/

-- Add new columns to listings table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'contact_phone') THEN
    ALTER TABLE listings ADD COLUMN contact_phone text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'contact_email') THEN
    ALTER TABLE listings ADD COLUMN contact_email text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'preferred_contact') THEN
    ALTER TABLE listings ADD COLUMN preferred_contact text CHECK (preferred_contact IN ('phone', 'email', 'message'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'vehicle_type') THEN
    ALTER TABLE listings ADD COLUMN vehicle_type text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'view_count') THEN
    ALTER TABLE listings ADD COLUMN view_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'is_featured') THEN
    ALTER TABLE listings ADD COLUMN is_featured boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'condition') THEN
    ALTER TABLE listings ADD COLUMN condition text CHECK (condition IN ('new', 'like-new', 'good', 'fair', 'parts'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'is_negotiable') THEN
    ALTER TABLE listings ADD COLUMN is_negotiable boolean DEFAULT true;
  END IF;
END $$;

-- Create listing_reviews table for seller ratings
CREATE TABLE IF NOT EXISTS listing_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  reviewer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text text,
  transaction_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(listing_id, reviewer_id)
);

-- Create listing_offers table for negotiations
CREATE TABLE IF NOT EXISTS listing_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  buyer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  offer_amount numeric NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'countered', 'withdrawn')),
  counter_amount numeric,
  counter_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create listing_views table for analytics
CREATE TABLE IF NOT EXISTS listing_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  viewer_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  viewed_at timestamptz DEFAULT now(),
  ip_address text,
  user_agent text
);

-- Create saved_searches table
CREATE TABLE IF NOT EXISTS saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  search_name text NOT NULL,
  search_params jsonb NOT NULL,
  notify_new_listings boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, search_name)
);

-- Create listing_reports table for moderation
CREATE TABLE IF NOT EXISTS listing_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  reporter_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reason text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  UNIQUE(listing_id, reporter_id)
);

-- Enable RLS on new tables
ALTER TABLE listing_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_reports ENABLE ROW LEVEL SECURITY;

-- Listing Reviews Policies
CREATE POLICY "Anyone can read reviews"
  ON listing_reviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Buyers can create reviews"
  ON listing_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own reviews"
  ON listing_reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete their own reviews"
  ON listing_reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = reviewer_id);

-- Listing Offers Policies
CREATE POLICY "Buyers and sellers can view their offers"
  ON listing_offers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Buyers can create offers"
  ON listing_offers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers and sellers can update offers"
  ON listing_offers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Buyers can delete their offers"
  ON listing_offers
  FOR DELETE
  TO authenticated
  USING (auth.uid() = buyer_id AND status = 'pending');

-- Listing Views Policies
CREATE POLICY "Users can view their own view history"
  ON listing_views
  FOR SELECT
  TO authenticated
  USING (auth.uid() = viewer_id);

CREATE POLICY "Anyone can record views"
  ON listing_views
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Saved Searches Policies
CREATE POLICY "Users can manage their saved searches"
  ON saved_searches
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Listing Reports Policies
CREATE POLICY "Users can view their own reports"
  ON listing_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id);

CREATE POLICY "Users can create reports"
  ON listing_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_vehicle_type ON listings(vehicle_type);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings(location);
CREATE INDEX IF NOT EXISTS idx_listings_featured ON listings(is_featured) WHERE is_featured = true;

CREATE INDEX IF NOT EXISTS idx_listing_reviews_listing_id ON listing_reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_reviews_seller_id ON listing_reviews(seller_id);
CREATE INDEX IF NOT EXISTS idx_listing_reviews_rating ON listing_reviews(rating);

CREATE INDEX IF NOT EXISTS idx_listing_offers_listing_id ON listing_offers(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_offers_buyer_id ON listing_offers(buyer_id);
CREATE INDEX IF NOT EXISTS idx_listing_offers_seller_id ON listing_offers(seller_id);
CREATE INDEX IF NOT EXISTS idx_listing_offers_status ON listing_offers(status);

CREATE INDEX IF NOT EXISTS idx_listing_views_listing_id ON listing_views(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_views_viewer_id ON listing_views(viewer_id);
CREATE INDEX IF NOT EXISTS idx_listing_views_viewed_at ON listing_views(viewed_at DESC);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);

CREATE INDEX IF NOT EXISTS idx_listing_reports_listing_id ON listing_reports(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_reports_status ON listing_reports(status);

-- Create function to update view count
CREATE OR REPLACE FUNCTION increment_listing_views(listing_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE listings
  SET view_count = view_count + 1
  WHERE id = listing_uuid;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate seller rating
CREATE OR REPLACE FUNCTION get_seller_rating(seller_uuid uuid)
RETURNS TABLE(avg_rating numeric, total_reviews bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ROUND(AVG(rating)::numeric, 2) as avg_rating,
    COUNT(*) as total_reviews
  FROM listing_reviews
  WHERE seller_id = seller_uuid;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_listing_reviews_updated_at
  BEFORE UPDATE ON listing_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_listing_offers_updated_at
  BEFORE UPDATE ON listing_offers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
