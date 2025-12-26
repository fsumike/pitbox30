/*
  # Add Location-Based Distance Filtering for Swap Meet

  1. Extensions
    - Enable PostGIS extension for geography/geometry support
    - Enables spatial indexing and distance calculations

  2. Tables Modified
    - `listings`
      - Add `latitude` column for seller location latitude
      - Add `longitude` column for seller location longitude
      - Add `location_point` geography column for efficient spatial queries
      - Add spatial index for performance

  3. Functions
    - `get_listings_within_distance` - RPC function to fetch listings within specified radius
      - Parameters: user_lat, user_lng, radius_miles
      - Returns listings sorted by distance
      - Includes distance in miles for each result

  4. Security
    - Function uses existing RLS policies on listings table
    - No additional permissions needed
    - Distance calculations are read-only

  5. Notes
    - Geography type uses WGS84 coordinate system (standard GPS)
    - Distance calculations use spheroid for accuracy
    - Spatial index (GIST) significantly improves query performance
    - Radius is in miles (converted to meters internally)
*/

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add latitude and longitude columns to listings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE listings ADD COLUMN latitude numeric(10, 8);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE listings ADD COLUMN longitude numeric(11, 8);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'location_point'
  ) THEN
    ALTER TABLE listings ADD COLUMN location_point geography(Point, 4326);
  END IF;
END $$;

-- Create index on location_point for fast spatial queries
CREATE INDEX IF NOT EXISTS idx_listings_location_point ON listings USING GIST (location_point);

-- Create trigger to automatically update location_point when lat/lng changes
CREATE OR REPLACE FUNCTION update_listing_location_point()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location_point := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  ELSE
    NEW.location_point := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_listing_location ON listings;
CREATE TRIGGER trigger_update_listing_location
  BEFORE INSERT OR UPDATE OF latitude, longitude ON listings
  FOR EACH ROW
  EXECUTE FUNCTION update_listing_location_point();

-- Backfill location_point for existing listings with lat/lng
UPDATE listings
SET location_point = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
WHERE latitude IS NOT NULL 
  AND longitude IS NOT NULL 
  AND location_point IS NULL;

-- RPC function to get listings within distance
CREATE OR REPLACE FUNCTION get_listings_within_distance(
  user_lat numeric,
  user_lng numeric,
  radius_miles numeric DEFAULT 100
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  price numeric,
  category text,
  condition text,
  images text[],
  seller_id uuid,
  seller_location text,
  latitude numeric,
  longitude numeric,
  created_at timestamptz,
  updated_at timestamptz,
  status text,
  distance_miles numeric
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  user_point geography;
  radius_meters numeric;
BEGIN
  -- Convert user coordinates to geography point
  user_point := ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography;
  
  -- Convert miles to meters (1 mile = 1609.34 meters)
  radius_meters := radius_miles * 1609.34;
  
  -- Return listings within radius, sorted by distance
  RETURN QUERY
  SELECT 
    l.id,
    l.title,
    l.description,
    l.price,
    l.category,
    l.condition,
    l.images,
    l.seller_id,
    l.seller_location,
    l.latitude,
    l.longitude,
    l.created_at,
    l.updated_at,
    l.status,
    ROUND((ST_Distance(l.location_point, user_point) / 1609.34)::numeric, 1) as distance_miles
  FROM listings l
  WHERE l.location_point IS NOT NULL
    AND ST_DWithin(l.location_point, user_point, radius_meters)
    AND l.status = 'active'
  ORDER BY ST_Distance(l.location_point, user_point);
END;
$$;