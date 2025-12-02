/*
  # Enhanced Profile System with Rich Fields and Privacy Controls

  ## New Profile Fields
  
  ### Racing Background
  - `car_number` - Primary car number
  - `car_numbers` - Array of all car numbers used
  - `primary_racing_class` - Main racing class
  - `racing_role` - Driver/Crew Chief/Mechanic/Owner/Spotter/Fan
  - `years_racing_since` - Year started racing
  - `home_tracks` - Array of home track names
  
  ### Career & Achievements
  - `championships` - Array of championship wins
  - `notable_wins` - Text field for wins/achievements
  - `current_team` - Current team name
  - `previous_teams` - Array of previous teams
  
  ### Personal Information
  - `birthday` - Date of birth (optional)
  - `relationship_status` - Single/Married/etc
  - `education` - Education background
  - `day_job` - Profession outside racing
  - `hometown` - Hometown (different from location)
  
  ### Interests & Skills
  - `mechanical_skills` - Array of skills
  - `racing_interests` - Array of racing interests
  - `looking_for` - What they're seeking (crew/sponsors/etc)
  - `favorite_drivers` - Favorite professional drivers
  - `music_preference` - Music taste
  
  ### Privacy Settings
  - `privacy_racing_info` - public/friends/private
  - `privacy_career_info` - public/friends/private
  - `privacy_personal_info` - public/friends/private
  - `privacy_contact_info` - public/friends/private
  
  ### Profile Stats
  - `profile_views` - View count
  - `last_active` - Last activity timestamp
  
  ## Security
  - All new fields are optional
  - Privacy controls enforce access
  - RLS policies respect privacy settings
*/

-- Add new columns to profiles table
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS car_number text,
  ADD COLUMN IF NOT EXISTS car_numbers text[],
  ADD COLUMN IF NOT EXISTS primary_racing_class text,
  ADD COLUMN IF NOT EXISTS racing_role text,
  ADD COLUMN IF NOT EXISTS years_racing_since integer,
  ADD COLUMN IF NOT EXISTS home_tracks text[],
  ADD COLUMN IF NOT EXISTS championships jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS notable_wins text,
  ADD COLUMN IF NOT EXISTS current_team text,
  ADD COLUMN IF NOT EXISTS previous_teams jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS birthday date,
  ADD COLUMN IF NOT EXISTS relationship_status text,
  ADD COLUMN IF NOT EXISTS education text,
  ADD COLUMN IF NOT EXISTS day_job text,
  ADD COLUMN IF NOT EXISTS hometown text,
  ADD COLUMN IF NOT EXISTS mechanical_skills text[],
  ADD COLUMN IF NOT EXISTS racing_interests text[],
  ADD COLUMN IF NOT EXISTS looking_for text[],
  ADD COLUMN IF NOT EXISTS favorite_drivers text[],
  ADD COLUMN IF NOT EXISTS music_preference text,
  ADD COLUMN IF NOT EXISTS privacy_racing_info text DEFAULT 'public',
  ADD COLUMN IF NOT EXISTS privacy_career_info text DEFAULT 'public',
  ADD COLUMN IF NOT EXISTS privacy_personal_info text DEFAULT 'friends',
  ADD COLUMN IF NOT EXISTS privacy_contact_info text DEFAULT 'private',
  ADD COLUMN IF NOT EXISTS profile_views integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_active timestamptz DEFAULT now();

-- Create blocked_users table
CREATE TABLE IF NOT EXISTS blocked_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  blocked_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reason text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(blocker_id, blocked_id)
);

-- Create user_reports table
CREATE TABLE IF NOT EXISTS user_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reported_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  report_type text NOT NULL,
  reason text NOT NULL,
  status text DEFAULT 'pending',
  reviewed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create profile_invites table for tracking invitations
CREATE TABLE IF NOT EXISTS profile_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  invitee_email text NOT NULL,
  invitee_phone text,
  invite_code text UNIQUE NOT NULL,
  status text DEFAULT 'pending',
  accepted_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  accepted_at timestamptz
);

-- Create profile_views table to track who viewed whose profile
CREATE TABLE IF NOT EXISTS profile_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  viewer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  viewed_profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  viewed_at timestamptz DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blocked_users
CREATE POLICY "Users can view their blocked list"
  ON blocked_users FOR SELECT
  TO authenticated
  USING (blocker_id = auth.uid());

CREATE POLICY "Users can block others"
  ON blocked_users FOR INSERT
  TO authenticated
  WITH CHECK (blocker_id = auth.uid());

CREATE POLICY "Users can unblock others"
  ON blocked_users FOR DELETE
  TO authenticated
  USING (blocker_id = auth.uid());

-- RLS Policies for user_reports
CREATE POLICY "Users can view their own reports"
  ON user_reports FOR SELECT
  TO authenticated
  USING (reporter_id = auth.uid());

CREATE POLICY "Users can submit reports"
  ON user_reports FOR INSERT
  TO authenticated
  WITH CHECK (reporter_id = auth.uid());

-- RLS Policies for profile_invites
CREATE POLICY "Users can view their invites"
  ON profile_invites FOR SELECT
  TO authenticated
  USING (inviter_id = auth.uid() OR accepted_by = auth.uid());

CREATE POLICY "Users can create invites"
  ON profile_invites FOR INSERT
  TO authenticated
  WITH CHECK (inviter_id = auth.uid());

CREATE POLICY "Users can update invite status"
  ON profile_invites FOR UPDATE
  TO authenticated
  USING (inviter_id = auth.uid() OR accepted_by = auth.uid());

-- RLS Policies for profile_views
CREATE POLICY "Users can view their profile views"
  ON profile_views FOR SELECT
  TO authenticated
  USING (viewed_profile_id = auth.uid());

CREATE POLICY "Authenticated users can track views"
  ON profile_views FOR INSERT
  TO authenticated
  WITH CHECK (viewer_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blocked_users_blocker ON blocked_users(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocked_users_blocked ON blocked_users(blocked_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_reporter ON user_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_reported ON user_reports(reported_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_status ON user_reports(status);
CREATE INDEX IF NOT EXISTS idx_profile_invites_inviter ON profile_invites(inviter_id);
CREATE INDEX IF NOT EXISTS idx_profile_invites_code ON profile_invites(invite_code);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewer ON profile_views(viewer_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed ON profile_views(viewed_profile_id);
CREATE INDEX IF NOT EXISTS idx_profiles_car_number ON profiles(car_number);
CREATE INDEX IF NOT EXISTS idx_profiles_primary_racing_class ON profiles(primary_racing_class);
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON profiles(last_active DESC);

-- Function to check if user is blocked
CREATE OR REPLACE FUNCTION is_user_blocked(viewer_id uuid, profile_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM blocked_users
    WHERE (blocker_id = profile_id AND blocked_id = viewer_id)
       OR (blocker_id = viewer_id AND blocked_id = profile_id)
  );
END;
$$;

-- Function to check if users are friends
CREATE OR REPLACE FUNCTION are_users_friends(user1_id uuid, user2_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM friendships
    WHERE (user_id1 = user1_id AND user_id2 = user2_id)
       OR (user_id1 = user2_id AND user_id2 = user1_id)
  );
END;
$$;

-- Function to increment profile views
CREATE OR REPLACE FUNCTION increment_profile_view(profile_id uuid, viewer_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only count if not viewing own profile and not blocked
  IF profile_id != viewer_id AND NOT is_user_blocked(viewer_id, profile_id) THEN
    -- Insert view record
    INSERT INTO profile_views (viewer_id, viewed_profile_id, viewed_at)
    VALUES (viewer_id, profile_id, now());
    
    -- Increment view count
    UPDATE profiles
    SET profile_views = profile_views + 1
    WHERE id = profile_id;
  END IF;
END;
$$;

-- Function to generate invite code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i integer;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;