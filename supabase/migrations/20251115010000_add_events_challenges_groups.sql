/*
  # Add Events, Challenges, Groups, and Verified Badges

  ## Overview
  Completes the social media platform with essential features for App Store launch:
  - Events calendar with RSVP system
  - Challenges with leaderboards
  - Group chats for teams
  - Verified badge system

  ## New Tables

  1. `events`
    - Race events, track days, meetups
    - RSVP tracking
    - Location and date info

  2. `event_rsvps`
    - Who's attending which events
    - RSVP status tracking

  3. `challenges`
    - Hashtag challenges
    - Time-limited competitions
    - Leaderboards

  4. `challenge_entries`
    - User submissions to challenges
    - Vote/like tracking

  5. `groups`
    - Team chats, car class groups
    - Private or public groups

  6. `group_members`
    - Group membership tracking
    - Admin/member roles

  7. `group_messages`
    - Chat messages in groups
    - Real-time messaging

  ## Security
  - RLS enabled on all tables
  - Users control their own content
  - Group admins can moderate
*/

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  event_type text NOT NULL CHECK (event_type IN ('race', 'track_day', 'meetup', 'other')),
  location text NOT NULL,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  track_id uuid,
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  image_url text,
  max_attendees integer,
  rsvp_count integer DEFAULT 0,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_creator_id ON events(creator_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_location ON events(location);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public events"
  ON events FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Event creators can update their events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Event creators can delete their events"
  ON events FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Event RSVPs Table
CREATE TABLE IF NOT EXISTS event_rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'going' CHECK (status IN ('going', 'interested', 'not_going')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_event_rsvps_event_id ON event_rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_user_id ON event_rsvps(user_id);

ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view RSVPs for public events"
  ON event_rsvps FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_rsvps.event_id
      AND events.is_public = true
    )
  );

CREATE POLICY "Users can RSVP to events"
  ON event_rsvps FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own RSVPs"
  ON event_rsvps FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own RSVPs"
  ON event_rsvps FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Challenges Table
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  hashtag text NOT NULL,
  challenge_type text NOT NULL CHECK (challenge_type IN ('video', 'photo', 'lap_time', 'other')),
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  prize_description text,
  rules text,
  entry_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_challenges_creator_id ON challenges(creator_id);
CREATE INDEX IF NOT EXISTS idx_challenges_hashtag ON challenges(hashtag);
CREATE INDEX IF NOT EXISTS idx_challenges_is_active ON challenges(is_active) WHERE is_active = true;

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view challenges"
  ON challenges FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create challenges"
  ON challenges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Challenge creators can update their challenges"
  ON challenges FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Challenge Entries Table
CREATE TABLE IF NOT EXISTS challenge_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  reel_id uuid REFERENCES video_reels(id) ON DELETE CASCADE,
  lap_time decimal(10, 3),
  vote_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CHECK (post_id IS NOT NULL OR reel_id IS NOT NULL OR lap_time IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_challenge_entries_challenge_id ON challenge_entries(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_entries_user_id ON challenge_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_entries_vote_count ON challenge_entries(vote_count DESC);

ALTER TABLE challenge_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view challenge entries"
  ON challenge_entries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can submit challenge entries"
  ON challenge_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries"
  ON challenge_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Challenge Votes Table
CREATE TABLE IF NOT EXISTS challenge_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid REFERENCES challenge_entries(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(entry_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_challenge_votes_entry_id ON challenge_votes(entry_id);
CREATE INDEX IF NOT EXISTS idx_challenge_votes_user_id ON challenge_votes(user_id);

ALTER TABLE challenge_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view votes"
  ON challenge_votes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can vote on entries"
  ON challenge_votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their votes"
  ON challenge_votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Groups Table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  group_type text NOT NULL CHECK (group_type IN ('team', 'car_class', 'track', 'general')),
  avatar_url text,
  is_private boolean DEFAULT false,
  member_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_groups_creator_id ON groups(creator_id);
CREATE INDEX IF NOT EXISTS idx_groups_group_type ON groups(group_type);

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public groups"
  ON groups FOR SELECT
  TO authenticated
  USING (
    is_private = false OR
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = groups.id
      AND group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create groups"
  ON groups FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Group creators and admins can update groups"
  ON groups FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = creator_id OR
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = groups.id
      AND group_members.user_id = auth.uid()
      AND group_members.role = 'admin'
    )
  );

-- Group Members Table
CREATE TABLE IF NOT EXISTS group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(group_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);

ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members can view members"
  ON group_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_members.group_id
      AND (
        groups.is_private = false OR
        EXISTS (
          SELECT 1 FROM group_members gm
          WHERE gm.group_id = groups.id
          AND gm.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can join public groups"
  ON group_members FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_id
      AND groups.is_private = false
    )
  );

CREATE POLICY "Users can leave groups"
  ON group_members FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Group Messages Table
CREATE TABLE IF NOT EXISTS group_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_group_messages_group_id ON group_messages(group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_group_messages_user_id ON group_messages(user_id);

ALTER TABLE group_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members can view messages"
  ON group_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_messages.group_id
      AND group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Group members can send messages"
  ON group_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_messages.group_id
      AND group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own messages"
  ON group_messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages"
  ON group_messages FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add verified badge to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_verified'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_verified boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'verification_type'
  ) THEN
    ALTER TABLE profiles ADD COLUMN verification_type text CHECK (verification_type IN ('pro_racer', 'track', 'sponsor', 'team'));
  END IF;
END $$;

-- Triggers to update counts
CREATE OR REPLACE FUNCTION update_event_rsvp_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'going' THEN
    UPDATE events SET rsvp_count = rsvp_count + 1 WHERE id = NEW.event_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'going' AND NEW.status != 'going' THEN
      UPDATE events SET rsvp_count = GREATEST(rsvp_count - 1, 0) WHERE id = NEW.event_id;
    ELSIF OLD.status != 'going' AND NEW.status = 'going' THEN
      UPDATE events SET rsvp_count = rsvp_count + 1 WHERE id = NEW.event_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'going' THEN
    UPDATE events SET rsvp_count = GREATEST(rsvp_count - 1, 0) WHERE id = OLD.event_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_event_rsvp_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON event_rsvps
  FOR EACH ROW
  EXECUTE FUNCTION update_event_rsvp_count();

-- Update group member count
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE groups SET member_count = GREATEST(member_count - 1, 0) WHERE id = OLD.group_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_group_member_count_trigger
  AFTER INSERT OR DELETE ON group_members
  FOR EACH ROW
  EXECUTE FUNCTION update_group_member_count();

-- Update challenge entry count
CREATE OR REPLACE FUNCTION update_challenge_entry_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE challenges SET entry_count = entry_count + 1 WHERE id = NEW.challenge_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE challenges SET entry_count = GREATEST(entry_count - 1, 0) WHERE id = OLD.challenge_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_challenge_entry_count_trigger
  AFTER INSERT OR DELETE ON challenge_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_challenge_entry_count();

-- Update challenge vote count
CREATE OR REPLACE FUNCTION update_challenge_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE challenge_entries SET vote_count = vote_count + 1 WHERE id = NEW.entry_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE challenge_entries SET vote_count = GREATEST(vote_count - 1, 0) WHERE id = OLD.entry_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_challenge_vote_count_trigger
  AFTER INSERT OR DELETE ON challenge_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_challenge_vote_count();

-- Automatically add creator as admin member when creating a group
CREATE OR REPLACE FUNCTION add_creator_to_group()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO group_members (group_id, user_id, role)
  VALUES (NEW.id, NEW.creator_id, 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_creator_to_group_trigger
  AFTER INSERT ON groups
  FOR EACH ROW
  EXECUTE FUNCTION add_creator_to_group();
