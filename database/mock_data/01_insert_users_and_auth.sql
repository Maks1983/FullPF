-- ================================================================
-- OwnCent Mock Data - Users and Authentication
-- Database: MariaDB 10.5+
-- ================================================================

-- Insert demo users
INSERT INTO users (id, email, password_hash, role, license_id, first_name, last_name, phone, timezone, locale, currency, email_verified, mfa_enabled, profile_picture_url, preferences, created_at, updated_at) VALUES
  -- Owner/Admin user
  ('550e8400-e29b-41d4-a716-446655440001', 'admin@owncent.com', '$2a$10$rR5K3YQHxPxQqP2P2P2P2uvGXdKGJKqP2P2P2P2P2P2P2P2P2P2P2', 'owner', 'demo-license-001', 'Admin', 'User', '+1234567890', 'America/New_York', 'en-US', 'USD', TRUE, FALSE, NULL,
   JSON_OBJECT(
     'theme', 'light',
     'notifications_enabled', true,
     'dashboard_layout', 'default',
     'show_tutorials', false
   ), NOW(), NOW()),

  -- Premium user
  ('550e8400-e29b-41d4-a716-446655440002', 'premium@example.com', '$2a$10$rR5K3YQHxPxQqP2P2P2P2uvGXdKGJKqP2P2P2P2P2P2P2P2P2P2P2', 'user', 'premium-license-001', 'Jane', 'Smith', '+1234567891', 'America/Los_Angeles', 'en-US', 'USD', TRUE, TRUE, NULL,
   JSON_OBJECT(
     'theme', 'dark',
     'notifications_enabled', true,
     'dashboard_layout', 'compact',
     'show_tutorials', false
   ), NOW(), NOW()),

  -- Free tier user
  ('550e8400-e29b-41d4-a716-446655440003', 'free@example.com', '$2a$10$rR5K3YQHxPxQqP2P2P2P2uvGXdKGJKqP2P2P2P2P2P2P2P2P2P2P2', 'user', 'demo-license-001', 'John', 'Doe', NULL, 'America/Chicago', 'en-US', 'USD', TRUE, FALSE, NULL,
   JSON_OBJECT(
     'theme', 'light',
     'notifications_enabled', true,
     'dashboard_layout', 'default',
     'show_tutorials', true
   ), NOW(), NOW()),

  -- Family account member
  ('550e8400-e29b-41d4-a716-446655440004', 'family@example.com', '$2a$10$rR5K3YQHxPxQqP2P2P2P2uvGXdKGJKqP2P2P2P2P2P2P2P2P2P2P2', 'family', 'family-license-001', 'Alice', 'Johnson', '+1234567892', 'America/New_York', 'en-US', 'USD', TRUE, FALSE, NULL,
   JSON_OBJECT(
     'theme', 'light',
     'notifications_enabled', true,
     'dashboard_layout', 'default',
     'show_tutorials', false
   ), NOW(), NOW());

-- Insert additional premium license
INSERT INTO licenses (id, license_id, tier, status, expires_at, features) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', 'premium-license-001', 'premium', 'valid', DATE_ADD(NOW(), INTERVAL 365 DAY),
   JSON_OBJECT(
     'debt_optimizer', true,
     'strategy_simulator', true,
     'scenario_planning', true,
     'detailed_reports', true,
     'bank_api', true,
     'family_accounts', false
   )),
  ('650e8400-e29b-41d4-a716-446655440002', 'family-license-001', 'family', 'valid', DATE_ADD(NOW(), INTERVAL 365 DAY),
   JSON_OBJECT(
     'debt_optimizer', true,
     'strategy_simulator', true,
     'scenario_planning', true,
     'detailed_reports', true,
     'bank_api', true,
     'family_accounts', true
   ));

-- Insert active sessions
INSERT INTO sessions (id, user_id, refresh_token, expires_at, ip_address, user_agent) VALUES
  ('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001',
   'refresh_token_admin_12345678901234567890', DATE_ADD(NOW(), INTERVAL 30 DAY),
   '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),

  ('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002',
   'refresh_token_premium_12345678901234567890', DATE_ADD(NOW(), INTERVAL 30 DAY),
   '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),

  ('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003',
   'refresh_token_free_12345678901234567890', DATE_ADD(NOW(), INTERVAL 30 DAY),
   '192.168.1.102', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15');

-- Insert audit log entries
INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, changes, ip_address, user_agent) VALUES
  ('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001',
   'login', 'user', '550e8400-e29b-41d4-a716-446655440001',
   JSON_OBJECT('event', 'successful_login'), '192.168.1.100',
   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),

  ('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002',
   'create', 'account', '950e8400-e29b-41d4-a716-446655440001',
   JSON_OBJECT('account_name', 'Chase Checking', 'account_type', 'checking'),
   '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),

  ('850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001',
   'update', 'feature_flag', 'debt_optimizer_enabled',
   JSON_OBJECT('old_value', false, 'new_value', true),
   '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

-- Insert MFA secrets for users with MFA enabled
INSERT INTO mfa_secrets (id, user_id, secret, backup_codes) VALUES
  ('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002',
   'JBSWY3DPEHPK3PXP',
   JSON_ARRAY('12345678', '23456789', '34567890', '45678901', '56789012', '67890123', '78901234', '89012345'));

-- Note: Password for all demo users is hashed from "Demo123456!"
-- In production, use proper bcrypt hashing with appropriate salt rounds
