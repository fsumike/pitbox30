/*
  # Fix Function Search Paths

  1. Security Improvements
    - Set immutable search_path for all functions
    - Prevents search_path injection attacks
    - Ensures functions always use correct schema

  2. Functions Fixed (20 functions)
    All functions are dropped with CASCADE and recreated with proper triggers
*/

-- Drop all functions with CASCADE (will drop dependent triggers)
DROP FUNCTION IF EXISTS public.update_shocks_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.update_seller_rating() CASCADE;
DROP FUNCTION IF EXISTS public.is_user_blocked(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.calculate_fuel_per_lap(numeric, integer) CASCADE;
DROP FUNCTION IF EXISTS public.are_users_friends(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.increment_profile_view() CASCADE;
DROP FUNCTION IF EXISTS public.generate_invite_code() CASCADE;
DROP FUNCTION IF EXISTS public.update_follower_counts() CASCADE;
DROP FUNCTION IF EXISTS public.increment_reel_likes() CASCADE;
DROP FUNCTION IF EXISTS public.decrement_reel_likes() CASCADE;
DROP FUNCTION IF EXISTS public.increment_reel_shares() CASCADE;
DROP FUNCTION IF EXISTS public.increment_reel_views() CASCADE;
DROP FUNCTION IF EXISTS public.increment_story_views() CASCADE;
DROP FUNCTION IF EXISTS public.delete_expired_stories() CASCADE;
DROP FUNCTION IF EXISTS public.update_event_rsvp_count() CASCADE;
DROP FUNCTION IF EXISTS public.update_group_member_count() CASCADE;
DROP FUNCTION IF EXISTS public.update_challenge_entry_count() CASCADE;
DROP FUNCTION IF EXISTS public.update_challenge_vote_count() CASCADE;
DROP FUNCTION IF EXISTS public.add_creator_to_group() CASCADE;
DROP FUNCTION IF EXISTS public.cleanup_expired_stories() CASCADE;

-- Recreate functions with proper search_path

CREATE FUNCTION public.update_shocks_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.update_seller_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles
  SET seller_rating = (
    SELECT AVG(rating)::numeric(3,2)
    FROM listing_reviews
    WHERE seller_id = NEW.seller_id
  )
  WHERE id = NEW.seller_id;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.is_user_blocked(user1_id uuid, user2_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM blocked_users
    WHERE (blocker_id = user1_id AND blocked_id = user2_id)
       OR (blocker_id = user2_id AND blocked_id = user1_id)
  );
END;
$$;

CREATE FUNCTION public.calculate_fuel_per_lap(fuel_used numeric, laps_run integer)
RETURNS numeric
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  IF laps_run > 0 THEN
    RETURN fuel_used / laps_run;
  ELSE
    RETURN 0;
  END IF;
END;
$$;

CREATE FUNCTION public.are_users_friends(user1_id uuid, user2_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM friends
    WHERE (user_id = user1_id AND friend_id = user2_id AND status = 'accepted')
       OR (user_id = user2_id AND friend_id = user1_id AND status = 'accepted')
  );
END;
$$;

CREATE FUNCTION public.increment_profile_view()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles
  SET profile_views = profile_views + 1
  WHERE id = NEW.viewed_profile_id;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.generate_invite_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code text;
BEGIN
  code := upper(substring(md5(random()::text) from 1 for 8));
  WHILE EXISTS (SELECT 1 FROM profile_invites WHERE invite_code = code) LOOP
    code := upper(substring(md5(random()::text) from 1 for 8));
  END LOOP;
  RETURN code;
END;
$$;

CREATE FUNCTION public.update_follower_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
    UPDATE profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET followers_count = followers_count - 1 WHERE id = OLD.following_id;
    UPDATE profiles SET following_count = following_count - 1 WHERE id = OLD.follower_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE FUNCTION public.increment_reel_likes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE video_reels
  SET likes_count = likes_count + 1
  WHERE id = NEW.reel_id;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.decrement_reel_likes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE video_reels
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = OLD.reel_id;
  RETURN OLD;
END;
$$;

CREATE FUNCTION public.increment_reel_shares()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.shares_count = COALESCE(NEW.shares_count, 0) + 1;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.increment_reel_views()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.views_count = COALESCE(NEW.views_count, 0) + 1;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.increment_story_views()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE stories
  SET views_count = views_count + 1
  WHERE id = NEW.story_id;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.delete_expired_stories()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM stories
  WHERE expires_at < now();
END;
$$;

CREATE FUNCTION public.update_event_rsvp_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE events SET rsvp_count = rsvp_count + 1 WHERE id = NEW.event_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE events SET rsvp_count = GREATEST(rsvp_count - 1, 0) WHERE id = OLD.event_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE FUNCTION public.update_group_member_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE groups SET member_count = GREATEST(member_count - 1, 0) WHERE id = OLD.group_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE FUNCTION public.update_challenge_entry_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE challenges SET entry_count = entry_count + 1 WHERE id = NEW.challenge_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE challenges SET entry_count = GREATEST(entry_count - 1, 0) WHERE id = OLD.challenge_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE FUNCTION public.update_challenge_vote_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE challenge_entries SET vote_count = vote_count + 1 WHERE id = NEW.entry_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE challenge_entries SET vote_count = GREATEST(vote_count - 1, 0) WHERE id = OLD.entry_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE FUNCTION public.add_creator_to_group()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO group_members (group_id, user_id, role)
  VALUES (NEW.id, NEW.creator_id, 'admin');
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.cleanup_expired_stories()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM stories WHERE expires_at < now();
END;
$$;

-- Recreate triggers

CREATE TRIGGER update_shocks_updated_at
  BEFORE UPDATE ON shocks
  FOR EACH ROW
  EXECUTE FUNCTION update_shocks_updated_at();

CREATE TRIGGER update_seller_rating_trigger
  AFTER INSERT OR UPDATE ON listing_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_seller_rating();

CREATE TRIGGER increment_profile_view_trigger
  AFTER INSERT ON profile_views
  FOR EACH ROW
  EXECUTE FUNCTION increment_profile_view();

CREATE TRIGGER update_follower_counts_trigger
  AFTER INSERT OR DELETE ON user_follows
  FOR EACH ROW
  EXECUTE FUNCTION update_follower_counts();

CREATE TRIGGER increment_reel_likes_trigger
  AFTER INSERT ON video_reel_likes
  FOR EACH ROW
  EXECUTE FUNCTION increment_reel_likes();

CREATE TRIGGER decrement_reel_likes_trigger
  AFTER DELETE ON video_reel_likes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_reel_likes();

CREATE TRIGGER increment_story_views_trigger
  AFTER INSERT ON story_views
  FOR EACH ROW
  EXECUTE FUNCTION increment_story_views();

CREATE TRIGGER update_event_rsvp_count_trigger
  AFTER INSERT OR DELETE ON event_rsvps
  FOR EACH ROW
  EXECUTE FUNCTION update_event_rsvp_count();

CREATE TRIGGER update_group_member_count_trigger
  AFTER INSERT OR DELETE ON group_members
  FOR EACH ROW
  EXECUTE FUNCTION update_group_member_count();

CREATE TRIGGER update_challenge_entry_count_trigger
  AFTER INSERT OR DELETE ON challenge_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_challenge_entry_count();

CREATE TRIGGER update_challenge_vote_count_trigger
  AFTER INSERT OR DELETE ON challenge_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_challenge_vote_count();

CREATE TRIGGER add_creator_to_group_trigger
  AFTER INSERT ON groups
  FOR EACH ROW
  EXECUTE FUNCTION add_creator_to_group();
