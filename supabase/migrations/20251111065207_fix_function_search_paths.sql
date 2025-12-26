/*
  # Fix Function Search Paths for Security

  1. Security Improvements
    - Set explicit search_path to prevent search path manipulation attacks
    - Ensures functions only access intended schemas
    
  2. Functions Updated
    - add_team_owner_as_member
    - handle_accepted_team_invite
    - update_teams_updated_at
    - handle_accepted_friend_request
    - update_updated_at
    - handle_new_user
    
  3. Changes
    - All functions now have SET search_path = public
    - Prevents role mutable search_path security issues
*/

-- Function: add_team_owner_as_member
CREATE OR REPLACE FUNCTION public.add_team_owner_as_member()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.team_members (team_id, user_id, role, status)
  VALUES (NEW.id, NEW.owner_id, 'owner', 'accepted');
  RETURN NEW;
END;
$$;

-- Function: handle_accepted_team_invite
CREATE OR REPLACE FUNCTION public.handle_accepted_team_invite()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    UPDATE public.teams
    SET updated_at = now()
    WHERE id = NEW.team_id;
  END IF;
  RETURN NEW;
END;
$$;

-- Function: update_teams_updated_at
CREATE OR REPLACE FUNCTION public.update_teams_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Function: handle_accepted_friend_request
CREATE OR REPLACE FUNCTION public.handle_accepted_friend_request()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'accepted' AND (OLD.status IS NULL OR OLD.status != 'accepted') THEN
    INSERT INTO public.friendships (user_id1, user_id2)
    VALUES (NEW.sender_id, NEW.receiver_id);
  END IF;
  RETURN NEW;
END;
$$;

-- Function: update_updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Function: handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$;