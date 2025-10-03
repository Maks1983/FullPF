-- ================================================================
-- OwnCent Database Schema - Financial Data
-- Database: MariaDB 10.5+
-- ================================================================

-- Accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type ENUM('checking', 'savings', 'credit', 'loan', 'investment', 'asset', 'liability') NOT NULL,
  balance DECIMAL(15, 2) DEFAULT 0.00,
  currency CHAR(3) DEFAULT 'USD',
  institution VARCHAR(255) DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_type (type),
  INDEX idx_is_active (is_active),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  account_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  category VARCHAR(100) DEFAULT 'uncategorized',
  type ENUM('income', 'expense', 'transfer') NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_account_id (account_id),
  INDEX idx_user_id (user_id),
  INDEX idx_date (date DESC),
  INDEX idx_type (type),
  INDEX idx_category (category),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  target_amount DECIMAL(15, 2) NOT NULL,
  current_amount DECIMAL(15, 2) DEFAULT 0.00,
  deadline DATE,
  category VARCHAR(100) DEFAULT 'general',
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_is_completed (is_completed),
  INDEX idx_deadline (deadline),
  INDEX idx_category (category),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  period ENUM('monthly', 'yearly') NOT NULL DEFAULT 'monthly',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_category (category),
  INDEX idx_period (period),
  INDEX idx_is_active (is_active),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
