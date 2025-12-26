/*
  # Native App Features - Core Tables

  ## New Tables
  1. track_locations - Racing track database with GPS
  2. track_check_ins - Auto-detected arrivals
  3. track_conditions - Community surface reports  
  4. lap_times - Performance tracking
  5. voice_notes - Audio notes for setups
  6. push_notification_tokens - Device tokens
  7. notifications - Notification history
  8. track_weather_history - Weather data
  9. setup_comparisons - Side-by-side analysis
  10. track_notes - Community tips
  11. maintenance_logs - Service tracking
  12. photo_metadata - Enhanced photo organization

  ## Security
  - RLS enabled on all tables
  - Comprehensive access policies
*/

-- 1. Track Locations
CREATE TABLE IF NOT EXISTS track_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  latitude numeric(10, 7) NOT NULL,
  longitude numeric(10, 7) NOT NULL,
  radius integer DEFAULT 500,
  track_type text,
  surface text,
  address text,
  city text,
  state text,
  country text DEFAULT 'USA',
  website text,
  phone text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE track_locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view tracks" ON track_locations;
CREATE POLICY "Anyone can view tracks" ON track_locations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create tracks" ON track_locations;
CREATE POLICY "Authenticated users can create tracks" ON track_locations FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update tracks" ON track_locations;
CREATE POLICY "Authenticated users can update tracks" ON track_locations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- 2. Track Check-ins
CREATE TABLE IF NOT EXISTS track_check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  track_id uuid NOT NULL,
  check_in_time timestamptz DEFAULT now(),
  check_out_time timestamptz,
  is_public boolean DEFAULT true,
  notes text,
  weather_conditions jsonb,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT track_check_ins_user_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT track_check_ins_track_fkey FOREIGN KEY (track_id) REFERENCES track_locations(id) ON DELETE CASCADE
);

ALTER TABLE track_check_ins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own check-ins" ON track_check_ins;
CREATE POLICY "Users view own check-ins" ON track_check_ins FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users view public check-ins" ON track_check_ins;
CREATE POLICY "Users view public check-ins" ON track_check_ins FOR SELECT TO authenticated USING (is_public = true);

DROP POLICY IF EXISTS "Users create own check-ins" ON track_check_ins;
CREATE POLICY "Users create own check-ins" ON track_check_ins FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own check-ins" ON track_check_ins;
CREATE POLICY "Users update own check-ins" ON track_check_ins FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own check-ins" ON track_check_ins;
CREATE POLICY "Users delete own check-ins" ON track_check_ins FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 3. Track Conditions
CREATE TABLE IF NOT EXISTS track_conditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid NOT NULL,
  user_id uuid NOT NULL,
  condition text NOT NULL,
  temperature numeric(5, 2),
  air_temperature numeric(5, 2),
  humidity numeric(5, 2),
  notes text,
  reported_at timestamptz DEFAULT now(),
  helpful_count integer DEFAULT 0,
  CONSTRAINT track_conditions_track_fkey FOREIGN KEY (track_id) REFERENCES track_locations(id) ON DELETE CASCADE,
  CONSTRAINT track_conditions_user_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE track_conditions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone views conditions" ON track_conditions;
CREATE POLICY "Anyone views conditions" ON track_conditions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users report conditions" ON track_conditions;
CREATE POLICY "Users report conditions" ON track_conditions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own reports" ON track_conditions;
CREATE POLICY "Users update own reports" ON track_conditions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. Lap Times
CREATE TABLE IF NOT EXISTS lap_times (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  track_id uuid,
  setup_id uuid,
  lap_time numeric(6, 3) NOT NULL,
  lap_number integer,
  session_type text,
  position integer,
  notes text,
  recorded_at timestamptz DEFAULT now(),
  CONSTRAINT lap_times_user_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT lap_times_track_fkey FOREIGN KEY (track_id) REFERENCES track_locations(id) ON DELETE CASCADE
);

ALTER TABLE lap_times ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own lap times" ON lap_times;
CREATE POLICY "Users view own lap times" ON lap_times FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users create own lap times" ON lap_times;
CREATE POLICY "Users create own lap times" ON lap_times FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own lap times" ON lap_times;
CREATE POLICY "Users update own lap times" ON lap_times FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own lap times" ON lap_times;
CREATE POLICY "Users delete own lap times" ON lap_times FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 5. Voice Notes
CREATE TABLE IF NOT EXISTS voice_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  setup_id uuid,
  audio_url text NOT NULL,
  duration integer,
  transcription text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT voice_notes_user_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE voice_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own voice notes" ON voice_notes;
CREATE POLICY "Users view own voice notes" ON voice_notes FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users create own voice notes" ON voice_notes;
CREATE POLICY "Users create own voice notes" ON voice_notes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own voice notes" ON voice_notes;
CREATE POLICY "Users delete own voice notes" ON voice_notes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 6. Push Notification Tokens
CREATE TABLE IF NOT EXISTS push_notification_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  token text NOT NULL UNIQUE,
  platform text NOT NULL,
  device_info jsonb,
  created_at timestamptz DEFAULT now(),
  last_used timestamptz DEFAULT now(),
  CONSTRAINT push_tokens_user_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE push_notification_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own tokens" ON push_notification_tokens;
CREATE POLICY "Users view own tokens" ON push_notification_tokens FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users create own tokens" ON push_notification_tokens;
CREATE POLICY "Users create own tokens" ON push_notification_tokens FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own tokens" ON push_notification_tokens;
CREATE POLICY "Users update own tokens" ON push_notification_tokens FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own tokens" ON push_notification_tokens;
CREATE POLICY "Users delete own tokens" ON push_notification_tokens FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 7. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  data jsonb,
  read boolean DEFAULT false,
  sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  read_at timestamptz,
  CONSTRAINT notifications_user_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own notifications" ON notifications;
CREATE POLICY "Users view own notifications" ON notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own notifications" ON notifications;
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own notifications" ON notifications;
CREATE POLICY "Users delete own notifications" ON notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 8. Track Weather History
CREATE TABLE IF NOT EXISTS track_weather_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid NOT NULL,
  temperature numeric(5, 2),
  humidity numeric(5, 2),
  wind_speed numeric(5, 2),
  wind_direction text,
  conditions text,
  recorded_at timestamptz DEFAULT now(),
  CONSTRAINT weather_track_fkey FOREIGN KEY (track_id) REFERENCES track_locations(id) ON DELETE CASCADE
);

ALTER TABLE track_weather_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone views weather" ON track_weather_history;
CREATE POLICY "Anyone views weather" ON track_weather_history FOR SELECT USING (true);

-- 9. Setup Comparisons
CREATE TABLE IF NOT EXISTS setup_comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  setup_a_id uuid NOT NULL,
  setup_b_id uuid NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT comparisons_user_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE setup_comparisons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own comparisons" ON setup_comparisons;
CREATE POLICY "Users view own comparisons" ON setup_comparisons FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users create own comparisons" ON setup_comparisons;
CREATE POLICY "Users create own comparisons" ON setup_comparisons FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own comparisons" ON setup_comparisons;
CREATE POLICY "Users delete own comparisons" ON setup_comparisons FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 10. Track Notes
CREATE TABLE IF NOT EXISTS track_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid NOT NULL,
  user_id uuid NOT NULL,
  note text NOT NULL,
  category text,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT track_notes_track_fkey FOREIGN KEY (track_id) REFERENCES track_locations(id) ON DELETE CASCADE,
  CONSTRAINT track_notes_user_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE track_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone views track notes" ON track_notes;
CREATE POLICY "Anyone views track notes" ON track_notes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users create track notes" ON track_notes;
CREATE POLICY "Users create track notes" ON track_notes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own track notes" ON track_notes;
CREATE POLICY "Users update own track notes" ON track_notes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own track notes" ON track_notes;
CREATE POLICY "Users delete own track notes" ON track_notes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 11. Maintenance Logs
CREATE TABLE IF NOT EXISTS maintenance_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  motor_id uuid,
  maintenance_type text NOT NULL,
  races_since_last integer DEFAULT 0,
  track_id uuid,
  notes text,
  next_due_races integer,
  performed_at timestamptz DEFAULT now(),
  CONSTRAINT maintenance_user_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT maintenance_track_fkey FOREIGN KEY (track_id) REFERENCES track_locations(id)
);

ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own maintenance" ON maintenance_logs;
CREATE POLICY "Users view own maintenance" ON maintenance_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users create own maintenance" ON maintenance_logs;
CREATE POLICY "Users create own maintenance" ON maintenance_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own maintenance" ON maintenance_logs;
CREATE POLICY "Users update own maintenance" ON maintenance_logs FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own maintenance" ON maintenance_logs;
CREATE POLICY "Users delete own maintenance" ON maintenance_logs FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 12. Photo Metadata
CREATE TABLE IF NOT EXISTS photo_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  photo_url text NOT NULL,
  track_id uuid,
  setup_id uuid,
  category text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  taken_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT photo_user_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT photo_track_fkey FOREIGN KEY (track_id) REFERENCES track_locations(id)
);

ALTER TABLE photo_metadata ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own photos" ON photo_metadata;
CREATE POLICY "Users view own photos" ON photo_metadata FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users create own photos" ON photo_metadata;
CREATE POLICY "Users create own photos" ON photo_metadata FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own photos" ON photo_metadata;
CREATE POLICY "Users delete own photos" ON photo_metadata FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_track_locations_coords ON track_locations(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_track_check_ins_user ON track_check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_track_check_ins_track ON track_check_ins(track_id);
CREATE INDEX IF NOT EXISTS idx_track_check_ins_time ON track_check_ins(check_in_time);
CREATE INDEX IF NOT EXISTS idx_track_conditions_track ON track_conditions(track_id);
CREATE INDEX IF NOT EXISTS idx_track_conditions_reported ON track_conditions(reported_at);
CREATE INDEX IF NOT EXISTS idx_lap_times_user ON lap_times(user_id);
CREATE INDEX IF NOT EXISTS idx_lap_times_track ON lap_times(track_id);
CREATE INDEX IF NOT EXISTS idx_lap_times_setup ON lap_times(setup_id);
CREATE INDEX IF NOT EXISTS idx_voice_notes_user ON voice_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_notes_setup ON voice_notes(setup_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_track_weather_track ON track_weather_history(track_id);
CREATE INDEX IF NOT EXISTS idx_track_notes_track ON track_notes(track_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_user ON maintenance_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_photo_metadata_user ON photo_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_photo_metadata_track ON photo_metadata(track_id);