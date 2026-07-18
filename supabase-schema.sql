-- BreakFree AI — Run this entire file in Supabase SQL Editor
-- supabase.com → your project → SQL Editor → New query → paste → Run

-- HABITS
CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  motivation text NOT NULL,
  replacement_habit text,
  target_type text NOT NULL DEFAULT 'eliminate',
  target_value integer,
  unit text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  archived_at timestamptz
);
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "habits_user_policy" ON habits FOR ALL USING (auth.uid() = user_id);

-- HABIT LOGS
CREATE TABLE IF NOT EXISTS habit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  did_succeed boolean NOT NULL DEFAULT false,
  triggers text[] DEFAULT '{}',
  urge_level integer CHECK (urge_level BETWEEN 1 AND 5),
  mood integer CHECK (mood BETWEEN 1 AND 5),
  note text,
  logged_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(habit_id, date)
);
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "logs_user_policy" ON habit_logs FOR ALL USING (auth.uid() = user_id);

-- NUDGES
CREATE TABLE IF NOT EXISTS nudges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  type text NOT NULL,
  date date NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(habit_id, date)
);
ALTER TABLE nudges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "nudges_user_policy" ON nudges FOR ALL USING (auth.uid() = user_id);

-- MILESTONES
CREATE TABLE IF NOT EXISTS milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  days integer NOT NULL,
  message text NOT NULL,
  achieved_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(habit_id, days)
);
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "milestones_user_policy" ON milestones FOR ALL USING (auth.uid() = user_id);

-- COACH MESSAGES
CREATE TABLE IF NOT EXISTS coach_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'model')),
  content text NOT NULL,
  habit_id uuid REFERENCES habits(id) ON DELETE SET NULL,
  type text NOT NULL DEFAULT 'chat',
  created_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE coach_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_user_policy" ON coach_messages FOR ALL USING (auth.uid() = user_id);

-- AUTO-UPDATE updated_at on habits
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER habits_updated_at BEFORE UPDATE ON habits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
