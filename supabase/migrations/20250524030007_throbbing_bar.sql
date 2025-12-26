/*
  # Add Motor Tech Tables

  1. New Tables
    - `motors`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `description` (text)
      - `motor_type` (text)
      - `engine_class` (text)
      - `expected_life_laps` (integer)
      - `refresh_threshold` (integer)
      - `total_laps` (integer)
      - `effective_laps` (integer)
      - `notes` (text)
      - `last_serviced` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `motor_events`
      - `id` (uuid, primary key)
      - `motor_id` (uuid, references motors)
      - `date` (date)
      - `event_type` (text) - 'race', 'practice', 'maintenance'
      - `laps` (integer)
      - `average_rpm` (integer)
      - `max_rpm` (integer)
      - `notes` (text)
      - `track_name` (text)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create motors table
CREATE TABLE IF NOT EXISTS motors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  motor_type text,
  engine_class text,
  expected_life_laps integer DEFAULT 750,
  refresh_threshold integer DEFAULT 80,
  total_laps integer DEFAULT 0,
  effective_laps integer DEFAULT 0,
  notes text,
  last_serviced timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create motor_events table
CREATE TABLE IF NOT EXISTS motor_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  motor_id uuid REFERENCES motors(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('race', 'practice', 'maintenance')),
  laps integer DEFAULT 0,
  average_rpm integer,
  max_rpm integer,
  notes text,
  track_name text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE motors ENABLE ROW LEVEL SECURITY;
ALTER TABLE motor_events ENABLE ROW LEVEL SECURITY;

-- Create policies for motors
CREATE POLICY "Users can read own motors"
  ON motors
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own motors"
  ON motors
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own motors"
  ON motors
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own motors"
  ON motors
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for motor_events
CREATE POLICY "Users can read own motor events"
  ON motor_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM motors
      WHERE motors.id = motor_events.motor_id
      AND motors.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own motor events"
  ON motor_events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM motors
      WHERE motors.id = motor_events.motor_id
      AND motors.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own motor events"
  ON motor_events
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM motors
      WHERE motors.id = motor_events.motor_id
      AND motors.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own motor events"
  ON motor_events
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM motors
      WHERE motors.id = motor_events.motor_id
      AND motors.user_id = auth.uid()
    )
  );

-- Add updated_at trigger to motors
CREATE TRIGGER update_motors_updated_at
  BEFORE UPDATE ON motors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS motors_user_id_idx ON motors(user_id);
CREATE INDEX IF NOT EXISTS motor_events_motor_id_idx ON motor_events(motor_id);
CREATE INDEX IF NOT EXISTS motor_events_date_idx ON motor_events(date);