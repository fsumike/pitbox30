```sql
-- Create the 'teams' table
CREATE TABLE public.teams (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    description text,
    owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security for 'teams'
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Policy: Owners can create teams
CREATE POLICY "Owners can create teams" ON public.teams
FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Policy: Owners can delete their teams
CREATE POLICY "Owners can delete their teams" ON public.teams
FOR DELETE USING (auth.uid() = owner_id);

-- Policy: Owners can update their teams
CREATE POLICY "Owners can update their teams" ON public.teams
FOR UPDATE USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- Policy: Team members can read team info
CREATE POLICY "Team members can read team info" ON public.teams
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.team_id = teams.id AND team_members.user_id = auth.uid()
  )
);

-- Trigger to update 'updated_at' timestamp for 'teams' table
CREATE TRIGGER update_teams_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create the 'team_members' table
CREATE TABLE public.team_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role text DEFAULT 'member' NOT NULL,
    status text DEFAULT 'pending' NOT NULL, -- pending, accepted, declined
    invited_by_user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT unique_team_member UNIQUE (team_id, user_id),
    CONSTRAINT valid_role CHECK (role IN ('owner', 'admin', 'member')),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'accepted', 'declined'))
);

-- Enable Row Level Security for 'team_members'
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Policy: Team owners/admins can invite members
CREATE POLICY "Team owners/admins can invite members" ON public.team_members
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.teams
    WHERE teams.id = team_members.team_id AND teams.owner_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.team_members tm
    WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid() AND tm.role = 'admin'
  )
);

-- Policy: Team owners and admins can remove members
CREATE POLICY "Team owners and admins can remove members" ON public.team_members
FOR DELETE USING (
  (team_id IN (
    SELECT tm.team_id FROM public.team_members tm JOIN public.teams t ON t.id = tm.team_id
    WHERE tm.user_id = auth.uid() AND (t.owner_id = auth.uid() OR tm.role IN ('owner', 'admin'))
  )) OR (user_id = auth.uid()) -- Allow users to remove themselves
);

-- Policy: Team members can read their own team memberships and other members in their team
CREATE POLICY "Team members can read their own team memberships and other members" ON public.team_members
FOR SELECT USING (
  (user_id = auth.uid()) OR (EXISTS (
    SELECT 1 FROM public.team_members tm
    WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid() AND tm.status = 'accepted'
  ))
);

-- Policy: Users can accept/decline their own invitations
CREATE POLICY "Users can accept/decline their own invitations" ON public.team_members
FOR UPDATE USING (user_id = auth.uid() AND status = 'pending')
WITH CHECK (user_id = auth.uid());

-- Create the 'team_invites' table
CREATE TABLE public.team_invites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    inviter_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    invitee_email text NOT NULL,
    role text DEFAULT 'member' NOT NULL,
    status text DEFAULT 'pending' NOT NULL, -- pending, accepted, declined
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT unique_team_invite UNIQUE (team_id, invitee_email),
    CONSTRAINT valid_role CHECK (role IN ('admin', 'member')),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'accepted', 'declined'))
);

-- Enable Row Level Security for 'team_invites'
ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;

-- Policy: Team owners and admins can create invites
CREATE POLICY "Team owners and admins can create invites" ON public.team_invites
FOR INSERT WITH CHECK (
  (team_id IN (
    SELECT teams.id FROM public.teams WHERE teams.owner_id = auth.uid()
  )) OR (EXISTS (
    SELECT 1 FROM public.team_members tm
    WHERE tm.team_id = team_invites.team_id AND tm.user_id = auth.uid() AND tm.role = 'admin'
  ))
);

-- Policy: Users can read invites sent to them or invites they sent
CREATE POLICY "Users can read invites sent to them" ON public.team_invites
FOR SELECT USING (
  (invitee_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text) OR (inviter_id = auth.uid()) OR (team_id IN (
    SELECT team_members.team_id FROM public.team_members WHERE team_members.user_id = auth.uid()
  ))
);

-- Policy: Users can update invites sent to them (accept/decline)
CREATE POLICY "Users can update invites sent to them" ON public.team_invites
FOR UPDATE USING (invitee_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text)
WITH CHECK (status IN ('accepted', 'declined'));

-- Function to handle accepted team invites
CREATE OR REPLACE FUNCTION public.handle_accepted_team_invite()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    INSERT INTO public.team_members (team_id, user_id, role, status, invited_by_user_id)
    VALUES (NEW.team_id, (SELECT id FROM auth.users WHERE email = NEW.invitee_email), NEW.role, 'accepted', NEW.inviter_id)
    ON CONFLICT (team_id, user_id) DO UPDATE SET role = NEW.role, status = 'accepted';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for accepted team invites
CREATE TRIGGER handle_accepted_team_invite_trigger
AFTER UPDATE ON public.team_invites
FOR EACH ROW EXECUTE FUNCTION public.handle_accepted_team_invite();

-- Function to add team owner as a member automatically
CREATE OR REPLACE FUNCTION public.add_team_owner_as_member()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.team_members (team_id, user_id, role, status)
  VALUES (NEW.id, NEW.owner_id, 'owner', 'accepted');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to add team owner as a member
CREATE TRIGGER add_team_owner_trigger
AFTER INSERT ON public.teams
FOR EACH ROW EXECUTE FUNCTION public.add_team_owner_as_member();

-- Function to update the 'updated_at' column
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```