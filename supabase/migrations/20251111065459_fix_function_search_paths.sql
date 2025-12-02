/*
  # Fix Function Search Paths

  ## Changes
  Updates all trigger functions to use secure search paths to prevent security vulnerabilities.
  Sets search_path to 'public, pg_temp' for all functions.
*/

-- Fix add_team_owner_as_member function
CREATE OR REPLACE FUNCTION public.add_team_owner_as_member()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.team_members (team_id, user_id, role, status, invited_by_user_id)
  VALUES (NEW.id, NEW.owner_id, 'owner', 'accepted', NEW.owner_id);
  RETURN NEW;
END;
$$;

-- Fix handle_accepted_team_invite function
CREATE OR REPLACE FUNCTION public.handle_accepted_team_invite()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    INSERT INTO public.notifications (user_id, type, content, related_user_id)
    VALUES (
      NEW.invited_by_user_id,
      'team_invite_accepted',
      (SELECT username FROM public.profiles WHERE id = NEW.user_id) || ' accepted your team invitation',
      NEW.user_id
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Fix update_teams_updated_at function
CREATE OR REPLACE FUNCTION public.update_teams_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix handle_accepted_friend_request function
CREATE OR REPLACE FUNCTION public.handle_accepted_friend_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    INSERT INTO public.friendships (user_id1, user_id2)
    VALUES (NEW.sender_id, NEW.receiver_id);
    
    INSERT INTO public.notifications (user_id, type, content, related_user_id)
    VALUES (
      NEW.sender_id,
      'friend_request_accepted',
      (SELECT username FROM public.profiles WHERE id = NEW.receiver_id) || ' accepted your friend request',
      NEW.receiver_id
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Fix update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;
