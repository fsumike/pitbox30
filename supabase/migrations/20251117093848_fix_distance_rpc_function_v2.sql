/*
  # Fix Distance RPC Function

  1. Changes
    - Drop and recreate get_listings_within_distance function
    - Update to match actual table schema
    - Remove non-existent columns (images, seller_location)
    - Return only columns that exist in listings table
    
  2. Notes
    - Images are in separate listing_images table
    - Location is stored in 'location' column (text)
    - Frontend will enrich data with images and profiles separately
*/

-- Drop the existing function
DROP FUNCTION IF EXISTS get_listings_within_distance(numeric, numeric, numeric);

-- Recreate with correct columns
CREATE OR REPLACE FUNCTION get_listings_within_distance(
  user_lat numeric,
  user_lng numeric,
  radius_miles numeric DEFAULT 100
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  title text,
  description text,
  price numeric,
  category text,
  location text,
  latitude numeric,
  longitude numeric,
  status text,
  created_at timestamptz,
  updated_at timestamptz,
  contact_phone text,
  contact_email text,
  preferred_contact text,
  vehicle_type text,
  condition text,
  is_negotiable boolean,
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
    l.user_id,
    l.title,
    l.description,
    l.price,
    l.category,
    l.location,
    l.latitude,
    l.longitude,
    l.status,
    l.created_at,
    l.updated_at,
    l.contact_phone,
    l.contact_email,
    l.preferred_contact,
    l.vehicle_type,
    l.condition,
    l.is_negotiable,
    ROUND((ST_Distance(l.location_point, user_point) / 1609.34)::numeric, 1) as distance_miles
  FROM listings l
  WHERE l.location_point IS NOT NULL
    AND ST_DWithin(l.location_point, user_point, radius_meters)
    AND l.status = 'active'
  ORDER BY ST_Distance(l.location_point, user_point);
END;
$$;