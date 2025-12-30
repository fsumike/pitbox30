-- Run this SQL in your Supabase SQL Editor to create the location-based advertising system

CREATE TABLE IF NOT EXISTS advertisements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  business_name text NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  website_url text,
  phone text,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  reach_type text NOT NULL DEFAULT 'local' CHECK (reach_type IN ('local', 'regional', 'national')),
  radius_miles integer NOT NULL DEFAULT 50,
  category text DEFAULT 'other' CHECK (category IN ('parts', 'services', 'tracks', 'equipment', 'other')),
  is_active boolean DEFAULT true,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active advertisements"
  ON advertisements FOR SELECT
  USING (is_active = true AND start_date <= now() AND (end_date IS NULL OR end_date >= now()));

CREATE POLICY "Advertisers can view own advertisements"
  ON advertisements FOR SELECT TO authenticated
  USING (auth.uid() = advertiser_id);

CREATE POLICY "Advertisers can create advertisements"
  ON advertisements FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = advertiser_id);

CREATE POLICY "Advertisers can update own advertisements"
  ON advertisements FOR UPDATE TO authenticated
  USING (auth.uid() = advertiser_id) WITH CHECK (auth.uid() = advertiser_id);

CREATE POLICY "Advertisers can delete own advertisements"
  ON advertisements FOR DELETE TO authenticated
  USING (auth.uid() = advertiser_id);

CREATE INDEX IF NOT EXISTS idx_advertisements_location ON advertisements(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_advertisements_advertiser ON advertisements(advertiser_id);
CREATE INDEX IF NOT EXISTS idx_advertisements_active ON advertisements(is_active, start_date, end_date) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_advertisements_reach_type ON advertisements(reach_type);
CREATE INDEX IF NOT EXISTS idx_advertisements_category ON advertisements(category);

CREATE OR REPLACE FUNCTION calculate_distance(lat1 numeric, lon1 numeric, lat2 numeric, lon2 numeric)
RETURNS numeric AS $$
DECLARE
  r numeric := 3959;
  dlat numeric; dlon numeric; a numeric; c numeric;
BEGIN
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  a := sin(dlat/2) * sin(dlat/2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2) * sin(dlon/2);
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  RETURN r * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION get_nearby_advertisements(user_lat numeric, user_lon numeric, max_results integer DEFAULT 10)
RETURNS TABLE (id uuid, advertiser_id uuid, business_name text, title text, description text, image_url text, website_url text, phone text, latitude numeric, longitude numeric, reach_type text, radius_miles integer, category text, distance_miles numeric) AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.advertiser_id, a.business_name, a.title, a.description, a.image_url, a.website_url, a.phone, a.latitude, a.longitude, a.reach_type, a.radius_miles, a.category,
    calculate_distance(user_lat, user_lon, a.latitude, a.longitude) as distance_miles
  FROM advertisements a
  WHERE a.is_active = true AND a.start_date <= now() AND (a.end_date IS NULL OR a.end_date >= now())
    AND (a.reach_type = 'national' OR calculate_distance(user_lat, user_lon, a.latitude, a.longitude) <= a.radius_miles)
  ORDER BY CASE WHEN a.reach_type = 'national' THEN 999999 ELSE calculate_distance(user_lat, user_lon, a.latitude, a.longitude) END, random()
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION increment_ad_impressions(ad_id uuid) RETURNS void AS $$
BEGIN UPDATE advertisements SET impressions = impressions + 1 WHERE id = ad_id; END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_ad_clicks(ad_id uuid) RETURNS void AS $$
BEGIN UPDATE advertisements SET clicks = clicks + 1 WHERE id = ad_id; END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION calculate_distance(numeric, numeric, numeric, numeric) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_nearby_advertisements(numeric, numeric, integer) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION increment_ad_impressions(uuid) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION increment_ad_clicks(uuid) TO authenticated, anon;
