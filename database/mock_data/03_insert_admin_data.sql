-- ================================================================
-- OwnCent Mock Data - Admin and Configuration
-- Database: MariaDB 10.5+
-- ================================================================

-- Insert bank connections for premium user
INSERT INTO bank_connections (id, user_id, provider, institution_id, institution_name, status, connection_label, last_synced_at, metadata) VALUES
  ('c50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'plaid', 'ins_1', 'Chase Bank', 'active',
   'Chase Personal Banking', DATE_SUB(NOW(), INTERVAL 2 HOUR),
   JSON_OBJECT('item_id', 'item_chase_001', 'accounts_count', 2, 'last_webhook', NOW())),

  ('c50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'plaid', 'ins_2', 'Wells Fargo', 'active',
   'Wells Fargo Primary', DATE_SUB(NOW(), INTERVAL 1 HOUR),
   JSON_OBJECT('item_id', 'item_wells_001', 'accounts_count', 2, 'last_webhook', NOW())),

  ('c50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'plaid', 'ins_3', 'Ally Bank', 'active',
   'Ally Online Savings', DATE_SUB(NOW(), INTERVAL 3 HOUR),
   JSON_OBJECT('item_id', 'item_ally_001', 'accounts_count', 1, 'last_webhook', NOW())),

  ('c50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'plaid', 'ins_4', 'Vanguard', 'active',
   'Vanguard Retirement', DATE_SUB(NOW(), INTERVAL 12 HOUR),
   JSON_OBJECT('item_id', 'item_vanguard_001', 'accounts_count', 1, 'last_webhook', NOW())),

  ('c50e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'plaid', 'ins_5', 'Fidelity', 'active',
   'Fidelity IRA', DATE_SUB(NOW(), INTERVAL 12 HOUR),
   JSON_OBJECT('item_id', 'item_fidelity_001', 'accounts_count', 1, 'last_webhook', NOW())),

  ('c50e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', 'demo', 'demo_bank', 'Demo Bank', 'active',
   'Demo Connection', NULL,
   JSON_OBJECT('demo_mode', true, 'accounts_count', 2));

-- Note: Default feature flags and config items are inserted in schema file 03_create_admin_tables.sql
-- Note: Demo license is inserted in schema file 03_create_admin_tables.sql

-- Update feature flags to enable some premium features for demonstration
UPDATE feature_flags SET value = TRUE, last_changed_at = NOW() WHERE key IN ('debt_optimizer_enabled', 'bank_api_enabled');

-- Update config items with demonstration values (passwords would be properly encrypted in production)
UPDATE config_items SET value = 'smtp.sendgrid.net', last_updated_at = NOW() WHERE key = 'smtp_host';
UPDATE config_items SET value = 'owncent_api', last_updated_at = NOW() WHERE key = 'smtp_user';
UPDATE config_items SET value = 'https://api.owncent.com', last_updated_at = NOW() WHERE key = 'api_base_url';
