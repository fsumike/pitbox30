/*
  # Fix Function Search Paths

  1. Security Improvements
    - Set immutable search_path for all functions
    - Prevents search_path injection attacks
    - Ensures functions always reference correct schemas
  
  2. Functions Updated
    - update_comment_reaction_count
    - update_reply_count
    - update_post_view_count
    - calculate_fuel_per_lap
  
  3. Security Impact
    - Functions now explicitly reference public schema
    - Eliminates role mutable search_path vulnerability
*/

-- Fix update_comment_reaction_count function
CREATE OR REPLACE FUNCTION public.update_comment_reaction_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.post_comments
    SET reaction_count = reaction_count + 1
    WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.post_comments
    SET reaction_count = GREATEST(0, reaction_count - 1)
    WHERE id = OLD.comment_id;
  END IF;
  RETURN NULL;
END;
$$;

-- Fix update_reply_count function
CREATE OR REPLACE FUNCTION public.update_reply_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.parent_id IS NOT NULL THEN
    UPDATE public.post_comments
    SET reply_count = reply_count + 1
    WHERE id = NEW.parent_id;
  ELSIF TG_OP = 'DELETE' AND OLD.parent_id IS NOT NULL THEN
    UPDATE public.post_comments
    SET reply_count = GREATEST(0, reply_count - 1)
    WHERE id = OLD.parent_id;
  END IF;
  RETURN NULL;
END;
$$;

-- Fix update_post_view_count function
CREATE OR REPLACE FUNCTION public.update_post_view_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.posts
  SET view_count = view_count + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$;

-- Fix calculate_fuel_per_lap function
CREATE OR REPLACE FUNCTION public.calculate_fuel_per_lap(
  total_fuel numeric,
  laps_completed integer
)
RETURNS numeric
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public, pg_temp
AS $$
BEGIN
  IF laps_completed = 0 THEN
    RETURN 0;
  END IF;
  RETURN ROUND(total_fuel / laps_completed, 2);
END;
$$;
