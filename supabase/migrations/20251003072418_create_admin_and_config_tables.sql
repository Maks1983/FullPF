/*
  # Admin and Configuration Tables

  1. New Tables
    - `feature_flags`
      - `key` (text, primary key) - Feature flag key
      - `description` (text) - Feature description
      - `value` (boolean) - Feature enabled/disabled
      - `overridable_by` (text[]) - Roles that can override this flag
      - `last_changed_at` (timestamptz) - Last change timestamp
      - `overridden_by_user_id` (uuid, nullable) - User who last overrode this
      - `notes` (text) - Override notes
    
    - `config_items`
      - `key` (text, primary key) - Configuration key
      - `value` (text) - Configuration value
      - `encrypted` (boolean) - Whether value is encrypted
      - `masked` (boolean) - Whether to mask value in UI
      - `description` (text) - Configuration description
      - `requires_step_up` (boolean) - Requires step-up authentication
      - `last_updated_at` (timestamptz) - Last update timestamp
      - `last_updated_by_user_id` (uuid, nullable) - User who last updated
    
    - `licenses`
      - `id` (uuid, primary key) - License unique identifier
      - `license_id` (text, unique) - External license identifier
      - `tier` (text) - License tier
      - `status` (text) - License status (valid, expiring, expired)
      - `expires_at` (timestamptz) - License expiration timestamp
      - `last_validated_at` (timestamptz) - Last validation timestamp
      - `override_active` (boolean) - Whether override is active
      - `override_tier` (text, nullable) - Override tier
      - `features` (jsonb) - Feature availability map
      - `created_at` (timestamptz) - License creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `bank_connections`
      - `id` (uuid, primary key) - Connection unique identifier
      - `user_id` (uuid, foreign key) - Reference to users table
      - `provider` (text) - Bank provider
      - `institution_id` (text) - Institution identifier
      - `institution_name` (text) - Institution name
      - `status` (text) - Connection status
      - `connection_label` (text) - User-defined label
      - `failure_reason` (text) - Failure reason if error
      - `last_synced_at` (timestamptz) - Last sync timestamp
      - `metadata` (jsonb) - Additional metadata
      - `created_at` (timestamptz) - Connection creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on all tables
    - Only owners can manage feature flags and config
    - License information readable by all authenticated users
    - Bank connections private to user
*/

-- Feature flags table
CREATE TABLE IF NOT EXISTS feature_flags (
  key text PRIMARY KEY,
  description text NOT NULL,
  value boolean DEFAULT false,
  overridable_by text[] DEFAULT ARRAY['owner']::text[],
  last_changed_at timestamptz DEFAULT now(),
  overridden_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  notes text DEFAULT ''
);

ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can read feature flags"
  ON feature_flags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only owners can update feature flags"
  ON feature_flags FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'owner'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'owner'
    )
  );

-- Config items table
CREATE TABLE IF NOT EXISTS config_items (
  key text PRIMARY KEY,
  value text NOT NULL,
  encrypted boolean DEFAULT false,
  masked boolean DEFAULT false,
  description text NOT NULL,
  requires_step_up boolean DEFAULT false,
  last_updated_at timestamptz DEFAULT now(),
  last_updated_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL
);

ALTER TABLE config_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only owners can read config items"
  ON config_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('owner', 'manager')
    )
  );

CREATE POLICY "Only owners can update config items"
  ON config_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'owner'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'owner'
    )
  );

-- Licenses table
CREATE TABLE IF NOT EXISTS licenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id text UNIQUE NOT NULL,
  tier text NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'advanced', 'premium', 'family')),
  status text NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'expiring', 'expired')),
  expires_at timestamptz NOT NULL,
  last_validated_at timestamptz DEFAULT now(),
  override_active boolean DEFAULT false,
  override_tier text CHECK (override_tier IN ('free', 'advanced', 'premium', 'family') OR override_tier IS NULL),
  features jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can read licenses"
  ON licenses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only owners can update licenses"
  ON licenses FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'owner'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'owner'
    )
  );

-- Bank connections table
CREATE TABLE IF NOT EXISTS bank_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'demo' CHECK (provider IN ('demo', 'teller', 'plaid', 'finicity', 'basiq', 'other')),
  institution_id text NOT NULL,
  institution_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'error', 'revoked')),
  connection_label text DEFAULT '',
  failure_reason text DEFAULT '',
  last_synced_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bank_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own bank connections"
  ON bank_connections FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own bank connections"
  ON bank_connections FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own bank connections"
  ON bank_connections FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own bank connections"
  ON bank_connections FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Insert default feature flags
INSERT INTO feature_flags (key, description, value, overridable_by) VALUES
  ('debt_optimizer_enabled', 'Enable the premium debt optimization module.', false, ARRAY['owner']::text[]),
  ('strategy_simulator_enabled', 'Enable what-if strategy simulator.', false, ARRAY['owner']::text[]),
  ('bank_api_enabled', 'Allow direct bank data aggregation.', false, ARRAY['owner']::text[]),
  ('family_features_enabled', 'Unlock multi-user household planning features.', false, ARRAY['owner']::text[]),
  ('reports_enabled', 'Enable premium reporting engine.', false, ARRAY['owner']::text[])
ON CONFLICT (key) DO NOTHING;

-- Insert default config items
INSERT INTO config_items (key, value, encrypted, masked, description, requires_step_up) VALUES
  ('smtp_host', '', false, false, 'SMTP server hostname', false),
  ('smtp_port', '587', false, false, 'SMTP server port', false),
  ('smtp_user', '', false, true, 'SMTP authentication username', true),
  ('smtp_password', '', true, true, 'SMTP authentication password', true),
  ('api_base_url', 'http://localhost:4000', false, false, 'API base URL', false)
ON CONFLICT (key) DO NOTHING;

-- Insert default license
INSERT INTO licenses (license_id, tier, status, expires_at, features) VALUES
  ('demo-license-001', 'free', 'valid', NOW() + INTERVAL '365 days', 
   '{"debt_optimizer": false, "strategy_simulator": false, "scenario_planning": false, "detailed_reports": false, "bank_api": false, "family_accounts": false}'::jsonb)
ON CONFLICT (license_id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bank_connections_user_id ON bank_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_connections_status ON bank_connections(status);
