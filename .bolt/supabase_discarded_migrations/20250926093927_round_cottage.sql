```sql
-- Create the 'teams' table
CREATE TABLE public.teams (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Add unique constraint for team name
CREATE UNIQUE INDEX teams_name_key ON public.teams USING btree (name);

-- Enable Row Level Security (RLS) for 'teams'
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- RLS Policies for 'teams'
CREATE POLICY "Owners can create teams" ON public.teams
FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their teams" ON public.teams
FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can update their teams" ON public.teams
FOR UPDATE USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Team members can read team info" ON public.teams
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.team_id = teams.id AND team_members.user_id = auth.uid() AND team_members.status = 'accepted'
  )
);

-- Create the 'team_members' table
CREATE TABLE public.team_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'member', -- 'owner', 'admin', 'member'
    status text NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'declined'
    invited_by_user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT team_members_role_check CHECK (role IN ('owner', 'admin', 'member')),
    CONSTRAINT team_members_status_check CHECK (status IN ('pending', 'accepted', 'declined')),
    CONSTRAINT team_members_team_id_user_id_key UNIQUE (team_id, user_id)
);

-- Enable Row Level Security (RLS) for 'team_members'
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for 'team_members'
CREATE POLICY "Team owners and admins can invite members" ON public.team_members
FOR INSERT WITH CHECK (
  (EXISTS ( SELECT 1 FROM public.teams WHERE teams.id = team_members.team_id AND teams.owner_id = auth.uid())) OR
  (EXISTS ( SELECT 1 FROM public.team_members tm WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid() AND tm.role = 'admin'))
);

CREATE POLICY "Team owners and admins can remove members" ON public.team_members
FOR DELETE USING (
  (EXISTS ( SELECT 1 FROM public.teams WHERE teams.id = team_members.team_id AND teams.owner_id = auth.uid())) OR
  (EXISTS ( SELECT 1 FROM public.team_members tm WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid() AND tm.role = 'admin'))
);

CREATE POLICY "Users can read team members for teams they belong to" ON public.team_members
FOR SELECT USING (
  team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid() AND status = 'accepted')
);

CREATE POLICY "Team owners and admins can update member roles" ON public.team_members
FOR UPDATE USING (
  (EXISTS ( SELECT 1 FROM public.teams WHERE teams.id = team_members.team_id AND teams.owner_id = auth.uid())) OR
  (EXISTS ( SELECT 1 FROM public.team_members tm WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid() AND tm.role = 'admin'))
) WITH CHECK (
  (EXISTS ( SELECT 1 FROM public.teams WHERE teams.id = team_members.team_id AND teams.owner_id = auth.uid())) OR
  (EXISTS ( SELECT 1 FROM public.team_members tm WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid() AND tm.role = 'admin'))
);


-- Create the 'team_invites' table
CREATE TABLE public.team_invites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    inviter_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    invitee_email text NOT NULL,
    role text NOT NULL DEFAULT 'member', -- 'admin', 'member'
    status text NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'declined'
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT team_invites_role_check CHECK (role IN ('admin', 'member')),
    CONSTRAINT team_invites_status_check CHECK (status IN ('pending', 'accepted', 'declined')),
    CONSTRAINT team_invites_team_id_invitee_email_key UNIQUE (team_id, invitee_email)
);

-- Enable Row Level Security (RLS) for 'team_invites'
ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for 'team_invites'
CREATE POLICY "Team owners and admins can create invites" ON public.team_invites
FOR INSERT WITH CHECK (
  (EXISTS ( SELECT 1 FROM public.teams WHERE teams.id = team_invites.team_id AND teams.owner_id = auth.uid())) OR
  (EXISTS ( SELECT 1 FROM public.team_members tm WHERE tm.team_id = team_invites.team_id AND tm.user_id = auth.uid() AND tm.role = 'admin'))
);

CREATE POLICY "Users can read invites sent to them" ON public.team_invites
FOR SELECT USING (
  invitee_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text OR
  inviter_id = auth.uid() OR
  team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update invites sent to them" ON public.team_invites
FOR UPDATE USING (invitee_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text)
WITH CHECK (status IN ('accepted', 'declined'));

-- Function to add team owner as a member automatically
CREATE OR REPLACE FUNCTION public.add_team_owner_as_member()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.team_members (team_id, user_id, role, status)
  VALUES (NEW.id, NEW.owner_id, 'owner', 'accepted');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call add_team_owner_as_member after a new team is created
CREATE TRIGGER add_team_owner_trigger
AFTER INSERT ON public.teams
FOR EACH ROW EXECUTE FUNCTION public.add_team_owner_as_member();

-- Function to handle accepted team invites
CREATE OR REPLACE FUNCTION public.handle_accepted_team_invite()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    INSERT INTO public.team_members (team_id, user_id, role, status)
    VALUES (NEW.team_id, (SELECT id FROM auth.users WHERE email = NEW.invitee_email), NEW.role, 'accepted');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_accepted_team_invite after a team invite is accepted
CREATE TRIGGER handle_accepted_team_invite_trigger
AFTER UPDATE ON public.team_invites
FOR EACH ROW EXECUTE FUNCTION public.handle_accepted_team_invite();

-- Function to update 'updated_at' columns automatically
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for 'updated_at' on teams and team_members
CREATE TRIGGER update_teams_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_team_invites_updated_at
BEFORE UPDATE ON public.team_invites
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
```