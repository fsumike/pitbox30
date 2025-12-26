/*
  # Create teams collaboration tables

  1. New Tables
    - `teams`
      - `id` (uuid, primary key)
      - `name` (text, team name)
      - `description` (text, optional description)
      - `owner_id` (uuid, references profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `team_members`
      - `id` (uuid, primary key)
      - `team_id` (uuid, references teams)
      - `user_id` (uuid, references profiles)
      - `role` (text, owner/admin/member)
      - `joined_at` (timestamp)
    - `team_invites`
      - `id` (uuid, primary key)
      - `team_id` (uuid, references teams)
      - `inviter_id` (uuid, references profiles)
      - `invitee_email` (text, email address)
      - `role` (text, admin/member)
      - `status` (text, pending/accepted/declined)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for team owners and members
    - Ensure users can only access teams they belong to
*/

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Create team_invites table
CREATE TABLE IF NOT EXISTS team_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  inviter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  invitee_email text NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(team_id, invitee_email)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS teams_owner_id_idx ON teams(owner_id);
CREATE INDEX IF NOT EXISTS team_members_team_id_idx ON team_members(team_id);
CREATE INDEX IF NOT EXISTS team_members_user_id_idx ON team_members(user_id);
CREATE INDEX IF NOT EXISTS team_invites_team_id_idx ON team_invites(team_id);
CREATE INDEX IF NOT EXISTS team_invites_invitee_email_idx ON team_invites(invitee_email);

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;

-- Teams policies
CREATE POLICY "Users can read teams they belong to"
  ON teams
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create teams"
  ON teams
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Team owners can update their teams"
  ON teams
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Team owners can delete their teams"
  ON teams
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Team members policies
CREATE POLICY "Users can read team members for teams they belong to"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Team owners can add members"
  ON team_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    team_id IN (
      SELECT id FROM teams WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Team owners and admins can remove members"
  ON team_members
  FOR DELETE
  TO authenticated
  USING (
    team_id IN (
      SELECT tm.team_id FROM team_members tm
      JOIN teams t ON t.id = tm.team_id
      WHERE tm.user_id = auth.uid() 
      AND (t.owner_id = auth.uid() OR tm.role IN ('owner', 'admin'))
    )
    OR user_id = auth.uid() -- Users can remove themselves
  );

-- Team invites policies
CREATE POLICY "Users can read invites sent to them"
  ON team_invites
  FOR SELECT
  TO authenticated
  USING (
    invitee_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
    OR inviter_id = auth.uid()
    OR team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Team owners and admins can create invites"
  ON team_invites
  FOR INSERT
  TO authenticated
  WITH CHECK (
    team_id IN (
      SELECT tm.team_id FROM team_members tm
      JOIN teams t ON t.id = tm.team_id
      WHERE tm.user_id = auth.uid() 
      AND (t.owner_id = auth.uid() OR tm.role IN ('owner', 'admin'))
    )
  );

CREATE POLICY "Users can update invites sent to them"
  ON team_invites
  FOR UPDATE
  TO authenticated
  USING (
    invitee_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    status IN ('accepted', 'declined')
  );

-- Create trigger to automatically add team owner as member
CREATE OR REPLACE FUNCTION add_team_owner_as_member()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO team_members (team_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_team_owner_trigger
  AFTER INSERT ON teams
  FOR EACH ROW
  EXECUTE FUNCTION add_team_owner_as_member();

-- Create trigger to handle accepted invites
CREATE OR REPLACE FUNCTION handle_accepted_team_invite()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process if status changed to accepted
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    -- Get the user ID from the email
    INSERT INTO team_members (team_id, user_id, role)
    SELECT NEW.team_id, auth.uid(), NEW.role
    WHERE auth.uid() IS NOT NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_accepted_team_invite_trigger
  AFTER UPDATE ON team_invites
  FOR EACH ROW
  EXECUTE FUNCTION handle_accepted_team_invite();

-- Create updated_at trigger for teams
CREATE OR REPLACE FUNCTION update_teams_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_teams_updated_at_trigger
  BEFORE UPDATE ON teams
  FOR EACH ROW
  EXECUTE FUNCTION update_teams_updated_at();