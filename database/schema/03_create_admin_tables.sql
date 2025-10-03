-- ================================================================
-- OwnCent Database Schema - Admin and Configuration
-- Database: MariaDB 10.5+
-- ================================================================

-- Feature flags table
CREATE TABLE IF NOT EXISTS feature_flags (
  key VARCHAR(100) PRIMARY KEY,
  description TEXT NOT NULL,
  value BOOLEAN DEFAULT FALSE,
  overridable_by JSON DEFAULT NULL,
  last_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  overridden_by_user_id CHAR(36),
  notes TEXT,
  INDEX idx_value (value),
  INDEX idx_last_changed_at (last_changed_at),
  FOREIGN KEY (overridden_by_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Configuration items table
CREATE TABLE IF NOT EXISTS config_items (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  encrypted BOOLEAN DEFAULT FALSE,
  masked BOOLEAN DEFAULT FALSE,
  description TEXT NOT NULL,
  requires_step_up BOOLEAN DEFAULT FALSE,
  last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_updated_by_user_id CHAR(36),
  INDEX idx_encrypted (encrypted),
  INDEX idx_masked (masked),
  INDEX idx_requires_step_up (requires_step_up),
  FOREIGN KEY (last_updated_by_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Licenses table
CREATE TABLE IF NOT EXISTS licenses (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  license_id VARCHAR(255) UNIQUE NOT NULL,
  tier ENUM('free', 'advanced', 'premium', 'family') NOT NULL DEFAULT 'free',
  status ENUM('valid', 'expiring', 'expired') NOT NULL DEFAULT 'valid',
  expires_at TIMESTAMP NOT NULL,
  last_validated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  override_active BOOLEAN DEFAULT FALSE,
  override_tier ENUM('free', 'advanced', 'premium', 'family'),
  features JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_license_id (license_id),
  INDEX idx_tier (tier),
  INDEX idx_status (status),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bank connections table
CREATE TABLE IF NOT EXISTS bank_connections (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  provider ENUM('demo', 'teller', 'plaid', 'finicity', 'basiq', 'other') NOT NULL DEFAULT 'demo',
  institution_id VARCHAR(255) NOT NULL,
  institution_name VARCHAR(255) NOT NULL,
  status ENUM('pending', 'active', 'error', 'revoked') NOT NULL DEFAULT 'pending',
  connection_label VARCHAR(255) DEFAULT '',
  failure_reason TEXT,
  last_synced_at TIMESTAMP NULL,
  metadata JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_provider (provider),
  INDEX idx_institution_id (institution_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default feature flags
INSERT IGNORE INTO feature_flags (key, description, value, overridable_by) VALUES
  ('debt_optimizer_enabled', 'Enable the premium debt optimization module.', FALSE, JSON_ARRAY('owner')),
  ('strategy_simulator_enabled', 'Enable what-if strategy simulator.', FALSE, JSON_ARRAY('owner')),
  ('bank_api_enabled', 'Allow direct bank data aggregation.', FALSE, JSON_ARRAY('owner')),
  ('family_features_enabled', 'Unlock multi-user household planning features.', FALSE, JSON_ARRAY('owner')),
  ('reports_enabled', 'Enable premium reporting engine.', FALSE, JSON_ARRAY('owner'));

-- Insert default config items
INSERT IGNORE INTO config_items (key, value, encrypted, masked, description, requires_step_up) VALUES
  ('smtp_host', '', FALSE, FALSE, 'SMTP server hostname', FALSE),
  ('smtp_port', '587', FALSE, FALSE, 'SMTP server port', FALSE),
  ('smtp_user', '', FALSE, TRUE, 'SMTP authentication username', TRUE),
  ('smtp_password', '', TRUE, TRUE, 'SMTP authentication password', TRUE),
  ('jwt_secret', '', TRUE, TRUE, 'JWT signing secret key', TRUE),
  ('api_base_url', 'http://localhost:4000', FALSE, FALSE, 'API base URL', FALSE);

-- Insert default license
INSERT IGNORE INTO licenses (license_id, tier, status, expires_at, features) VALUES
  ('demo-license-001', 'free', 'valid', DATE_ADD(NOW(), INTERVAL 365 DAY),
   JSON_OBJECT(
     'debt_optimizer', FALSE,
     'strategy_simulator', FALSE,
     'scenario_planning', FALSE,
     'detailed_reports', FALSE,
     'bank_api', FALSE,
     'family_accounts', FALSE
   ));
