/*
  # Optimize RLS Policies - Auth Initialization

  1. Performance Improvements
    - Replace direct auth.uid() calls with (SELECT auth.uid())
    - Prevents re-evaluation of auth functions for each row
    - Significantly improves query performance at scale
  
  2. Tables Updated
    - track_check_ins (4 policies)
    - track_conditions (2 policies)
    - lap_times (4 policies)
    - voice_notes (3 policies)
    - push_notification_tokens (4 policies)
    - notifications (3 policies)
    - setup_comparisons (3 policies)
    - track_notes (3 policies)
    - maintenance_logs (4 policies)
    - photo_metadata (3 policies)
    - comment_reactions (2 policies)
    - post_views (1 policy)
    - fuel_logs (1 policy)
    - gear_ratios (1 policy)
    - lap_sessions (4 policies)
    - track_notebooks (4 policies)
    - saved_calculations (4 policies)
    - torsion_bars (4 policies)
  
  3. Security
    - No security changes - only performance optimization
    - All policies maintain the same access control logic
*/

-- track_check_ins policies
DROP POLICY IF EXISTS "Users view own check-ins" ON track_check_ins;
CREATE POLICY "Users view own check-ins" ON track_check_ins
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users create own check-ins" ON track_check_ins;
CREATE POLICY "Users create own check-ins" ON track_check_ins
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users update own check-ins" ON track_check_ins;
CREATE POLICY "Users update own check-ins" ON track_check_ins
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users delete own check-ins" ON track_check_ins;
CREATE POLICY "Users delete own check-ins" ON track_check_ins
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- track_conditions policies
DROP POLICY IF EXISTS "Users report conditions" ON track_conditions;
CREATE POLICY "Users report conditions" ON track_conditions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users update own reports" ON track_conditions;
CREATE POLICY "Users update own reports" ON track_conditions
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- lap_times policies
DROP POLICY IF EXISTS "Users view own lap times" ON lap_times;
CREATE POLICY "Users view own lap times" ON lap_times
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users create own lap times" ON lap_times;
CREATE POLICY "Users create own lap times" ON lap_times
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users update own lap times" ON lap_times;
CREATE POLICY "Users update own lap times" ON lap_times
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users delete own lap times" ON lap_times;
CREATE POLICY "Users delete own lap times" ON lap_times
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- voice_notes policies
DROP POLICY IF EXISTS "Users view own voice notes" ON voice_notes;
CREATE POLICY "Users view own voice notes" ON voice_notes
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users create own voice notes" ON voice_notes;
CREATE POLICY "Users create own voice notes" ON voice_notes
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users delete own voice notes" ON voice_notes;
CREATE POLICY "Users delete own voice notes" ON voice_notes
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- push_notification_tokens policies
DROP POLICY IF EXISTS "Users view own tokens" ON push_notification_tokens;
CREATE POLICY "Users view own tokens" ON push_notification_tokens
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users create own tokens" ON push_notification_tokens;
CREATE POLICY "Users create own tokens" ON push_notification_tokens
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users update own tokens" ON push_notification_tokens;
CREATE POLICY "Users update own tokens" ON push_notification_tokens
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users delete own tokens" ON push_notification_tokens;
CREATE POLICY "Users delete own tokens" ON push_notification_tokens
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- notifications policies
DROP POLICY IF EXISTS "Users view own notifications" ON notifications;
CREATE POLICY "Users view own notifications" ON notifications
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users update own notifications" ON notifications;
CREATE POLICY "Users update own notifications" ON notifications
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users delete own notifications" ON notifications;
CREATE POLICY "Users delete own notifications" ON notifications
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- setup_comparisons policies
DROP POLICY IF EXISTS "Users view own comparisons" ON setup_comparisons;
CREATE POLICY "Users view own comparisons" ON setup_comparisons
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users create own comparisons" ON setup_comparisons;
CREATE POLICY "Users create own comparisons" ON setup_comparisons
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users delete own comparisons" ON setup_comparisons;
CREATE POLICY "Users delete own comparisons" ON setup_comparisons
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- track_notes policies
DROP POLICY IF EXISTS "Users create track notes" ON track_notes;
CREATE POLICY "Users create track notes" ON track_notes
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users update own track notes" ON track_notes;
CREATE POLICY "Users update own track notes" ON track_notes
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users delete own track notes" ON track_notes;
CREATE POLICY "Users delete own track notes" ON track_notes
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- maintenance_logs policies
DROP POLICY IF EXISTS "Users view own maintenance" ON maintenance_logs;
CREATE POLICY "Users view own maintenance" ON maintenance_logs
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users create own maintenance" ON maintenance_logs;
CREATE POLICY "Users create own maintenance" ON maintenance_logs
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users update own maintenance" ON maintenance_logs;
CREATE POLICY "Users update own maintenance" ON maintenance_logs
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users delete own maintenance" ON maintenance_logs;
CREATE POLICY "Users delete own maintenance" ON maintenance_logs
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- photo_metadata policies
DROP POLICY IF EXISTS "Users view own photos" ON photo_metadata;
CREATE POLICY "Users view own photos" ON photo_metadata
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users create own photos" ON photo_metadata;
CREATE POLICY "Users create own photos" ON photo_metadata
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users delete own photos" ON photo_metadata;
CREATE POLICY "Users delete own photos" ON photo_metadata
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- comment_reactions policies
DROP POLICY IF EXISTS "Users can create their own comment reactions" ON comment_reactions;
CREATE POLICY "Users can create their own comment reactions" ON comment_reactions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own comment reactions" ON comment_reactions;
CREATE POLICY "Users can delete their own comment reactions" ON comment_reactions
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- post_views policy
DROP POLICY IF EXISTS "Users can create post views" ON post_views;
CREATE POLICY "Users can create post views" ON post_views
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

-- fuel_logs policy
DROP POLICY IF EXISTS "Users can manage their own fuel logs" ON fuel_logs;
CREATE POLICY "Users can manage their own fuel logs" ON fuel_logs
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- gear_ratios policy
DROP POLICY IF EXISTS "Users can manage their own gear ratios" ON gear_ratios;
CREATE POLICY "Users can manage their own gear ratios" ON gear_ratios
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- lap_sessions policies
DROP POLICY IF EXISTS "Users can view own lap sessions" ON lap_sessions;
CREATE POLICY "Users can view own lap sessions" ON lap_sessions
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create own lap sessions" ON lap_sessions;
CREATE POLICY "Users can create own lap sessions" ON lap_sessions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own lap sessions" ON lap_sessions;
CREATE POLICY "Users can update own lap sessions" ON lap_sessions
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own lap sessions" ON lap_sessions;
CREATE POLICY "Users can delete own lap sessions" ON lap_sessions
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- track_notebooks policies
DROP POLICY IF EXISTS "Users can view own track notebooks" ON track_notebooks;
CREATE POLICY "Users can view own track notebooks" ON track_notebooks
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create own track notebooks" ON track_notebooks;
CREATE POLICY "Users can create own track notebooks" ON track_notebooks
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own track notebooks" ON track_notebooks;
CREATE POLICY "Users can update own track notebooks" ON track_notebooks
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own track notebooks" ON track_notebooks;
CREATE POLICY "Users can delete own track notebooks" ON track_notebooks
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- saved_calculations policies
DROP POLICY IF EXISTS "Users can view own calculations" ON saved_calculations;
CREATE POLICY "Users can view own calculations" ON saved_calculations
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create own calculations" ON saved_calculations;
CREATE POLICY "Users can create own calculations" ON saved_calculations
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own calculations" ON saved_calculations;
CREATE POLICY "Users can update own calculations" ON saved_calculations
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own calculations" ON saved_calculations;
CREATE POLICY "Users can delete own calculations" ON saved_calculations
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- torsion_bars policies
DROP POLICY IF EXISTS "Users can view own torsion bars" ON torsion_bars;
CREATE POLICY "Users can view own torsion bars" ON torsion_bars
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own torsion bars" ON torsion_bars;
CREATE POLICY "Users can insert own torsion bars" ON torsion_bars
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own torsion bars" ON torsion_bars;
CREATE POLICY "Users can update own torsion bars" ON torsion_bars
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own torsion bars" ON torsion_bars;
CREATE POLICY "Users can delete own torsion bars" ON torsion_bars
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));
