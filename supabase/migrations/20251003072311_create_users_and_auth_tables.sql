/*
  # Initial Database Schema - Users and Authentication

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - User unique identifier
      - `email` (text, unique) - User email address
      - `username` (text, unique) - User login username
      - `display_name` (text) - User display name
      - `phone` (text) - User phone number
      - `role` (text) - User role (owner, manager, user, family, readonly)
      - `tier` (text) - License tier (free, advanced, premium, family)
      - `is_premium` (boolean) - Premium access flag
      - `created_at` (timestamptz) - Account creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `sessions`
      - `id` (uuid, primary key) - Session identifier
      - `user_id` (uuid, foreign key) - Reference to users table
      - `refresh_token` (text) - Refresh token for session renewal
      - `expires_at` (timestamptz) - Session expiration timestamp
      - `created_at` (timestamptz) - Session creation timestamp
      - `last_active_at` (timestamptz) - Last activity timestamp
    
    - `audit_logs`
      - `id` (bigserial, primary key) - Auto-incrementing log ID
      - `actor_user_id` (uuid) - User who performed the action
      - `impersonated_user_id` (uuid, nullable) - User being impersonated
      - `action` (text) - Action performed
      - `target_entity` (text) - Target entity of the action
      - `metadata` (jsonb) - Additional action metadata
      - `severity` (text) - Log severity (info, warning, critical)
      - `immutable` (boolean) - Whether the log can be modified
      - `timestamp` (timestamptz) - When the action occurred

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Users can read their own data
    - Only owners can read audit logs
    - Sessions are private to the user
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  display_name text NOT NULL,
  phone text DEFAULT '',
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('owner', 'manager', 'user', 'family', 'readonly')),
  tier text NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'advanced', 'premium', 'family')),
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_active_at timestamptz DEFAULT now()
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own sessions"
  ON sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own sessions"
  ON sessions FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id bigserial PRIMARY KEY,
  actor_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  impersonated_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_entity text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  severity text NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  immutable boolean DEFAULT false,
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only owners can read audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'owner'
    )
  );

CREATE POLICY "Authenticated users can create audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (actor_user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_user_id ON audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
