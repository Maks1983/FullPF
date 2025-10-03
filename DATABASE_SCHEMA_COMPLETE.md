# OwnCent - Complete Database Schema Documentation

## Database System
**MariaDB 10.5+** (Compatible with MySQL)

## Overview
This document provides a comprehensive mapping of all database tables and their columns as used throughout the OwnCent application.

---

## 1. USERS & AUTHENTICATION TABLES

### 1.1 `users` Table
**Purpose:** Core user accounts and profile information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | CHAR(36) | PRIMARY KEY, DEFAULT UUID() | Unique user identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| `username` | VARCHAR(100) | UNIQUE, NOT NULL | Unique username |
| `password_hash` | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| `display_name` | VARCHAR(255) | NOT NULL | User's display name |
| `first_name` | VARCHAR(100) | NULL | User's first name |
| `last_name` | VARCHAR(100) | NULL | User's last name |
| `phone` | VARCHAR(50) | DEFAULT '' | Phone number |
| `role` | ENUM | NOT NULL, DEFAULT 'user' | User role: owner, manager, user, family, readonly |
| `tier` | ENUM | NOT NULL, DEFAULT 'free' | Subscription tier: free, advanced, premium, family |
| `license_id` | VARCHAR(255) | NULL | FK to licenses table |
| `is_premium` | BOOLEAN | DEFAULT FALSE | Premium status flag |
| `email_verified` | BOOLEAN | DEFAULT FALSE | Email verification status |
| `mfa_enabled` | BOOLEAN | DEFAULT FALSE | Multi-factor auth enabled |
| `timezone` | VARCHAR(50) | NULL | User timezone |
| `locale` | VARCHAR(10) | NULL | User locale (e.g., 'en-US') |
| `currency` | CHAR(3) | DEFAULT 'USD' | Preferred currency code |
| `profile_picture_url` | TEXT | NULL | Profile picture URL |
| `preferences` | JSON | NULL | User preferences object |
| `deleted_at` | TIMESTAMP | NULL | Soft delete timestamp |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

**Indexes:**
- `idx_email` on `email`
- `idx_username` on `username`
- `idx_role` on `role`
- `idx_tier` on `tier`

**Foreign Keys:**
- `license_id` → `licenses.license_id`

---

### 1.2 `sessions` Table
**Purpose:** JWT refresh tokens and session management

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | CHAR(36) | PRIMARY KEY, DEFAULT UUID() | Unique session identifier |
| `user_id` | CHAR(36) | NOT NULL | FK to users table |
| `refresh_token` | TEXT | NOT NULL | JWT refresh token |
| `access_token_family` | CHAR(36) | NOT NULL | Token family for rotation |
| `ip_address` | VARCHAR(45) | NULL | Client IP address |
| `user_agent` | TEXT | NULL | Client user agent |
| `expires_at` | TIMESTAMP | NOT NULL | Token expiration time |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Session creation time |
| `last_active_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last activity time |

**Indexes:**
- `idx_user_id` on `user_id`
- `idx_expires_at` on `expires_at`
- `idx_token_family` on `access_token_family`

**Foreign Keys:**
- `user_id` → `users.id` ON DELETE CASCADE

---

### 1.3 `password_resets` Table
**Purpose:** Password reset token tracking

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | CHAR(36) | PRIMARY KEY, DEFAULT UUID() | Unique reset identifier |
| `user_id` | CHAR(36) | NOT NULL | FK to users table |
| `token` | VARCHAR(255) | UNIQUE, NOT NULL | Reset token |
| `expires_at` | TIMESTAMP | NOT NULL | Token expiration |
| `used` | BOOLEAN | DEFAULT FALSE | Whether token was used |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Token creation time |

**Indexes:**
- `idx_token` on `token`
- `idx_user_id` on `user_id`
- `idx_expires_at` on `expires_at`

**Foreign Keys:**
- `user_id` → `users.id` ON DELETE CASCADE

---

### 1.4 `audit_logs` Table
**Purpose:** Comprehensive audit trail for all system actions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT UNSIGNED | PRIMARY KEY AUTO_INCREMENT | Unique log identifier |
| `actor_user_id` | CHAR(36) | NOT NULL | User who performed action |
| `impersonated_user_id` | CHAR(36) | NULL | User being impersonated (if any) |
| `user_id` | CHAR(36) | NULL | Target user of action |
| `action` | VARCHAR(255) | NOT NULL | Action performed (e.g., 'login', 'login_failed') |
| `target_entity` | VARCHAR(255) | NOT NULL | Entity type affected |
| `entity_type` | VARCHAR(100) | NULL | Type of entity |
| `entity_id` | VARCHAR(255) | NULL | ID of affected entity |
| `metadata` | JSON | NULL | Additional action metadata |
| `changes` | JSON | NULL | Changes made (before/after) |
| `severity` | ENUM | NOT NULL, DEFAULT 'info' | Severity: info, warning, critical |
| `immutable` | BOOLEAN | DEFAULT FALSE | Whether record is immutable |
| `ip_address` | VARCHAR(45) | NULL | Client IP |
| `user_agent` | TEXT | NULL | Client user agent |
| `timestamp` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Action timestamp |

**Indexes:**
- `idx_actor_user_id` on `actor_user_id`
- `idx_impersonated_user_id` on `impersonated_user_id`
- `idx_timestamp` on `timestamp` DESC
- `idx_severity` on `severity`
- `idx_action` on `action`

**Foreign Keys:**
- `actor_user_id` → `users.id` ON DELETE CASCADE
- `impersonated_user_id` → `users.id` ON DELETE SET NULL

---

## 2. FINANCIAL DATA TABLES

### 2.1 `accounts` Table
**Purpose:** User financial accounts (bank accounts, credit cards, loans, investments)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | CHAR(36) | PRIMARY KEY, DEFAULT UUID() | Unique account identifier |
| `user_id` | CHAR(36) | NOT NULL | FK to users table |
| `name` | VARCHAR(255) | NOT NULL | Account name/label |
| `account_name` | VARCHAR(255) | NOT NULL | Account display name (alias) |
| `type` | ENUM | NOT NULL | Account type: checking, savings, credit, loan, investment, asset, liability |
| `account_type` | VARCHAR(50) | NOT NULL | Account type (alias) |
| `balance` | DECIMAL(15, 2) | DEFAULT 0.00 | Current balance |
| `currency` | CHAR(3) | DEFAULT 'USD' | Currency code |
| `institution` | VARCHAR(255) | DEFAULT '' | Financial institution name |
| `institution_name` | VARCHAR(255) | DEFAULT '' | Institution name (alias) |
| `account_number_last4` | VARCHAR(4) | NULL | Last 4 digits of account number |
| `is_active` | BOOLEAN | DEFAULT TRUE | Account status |
| `metadata` | JSON | NULL | Additional account data |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

**Indexes:**
- `idx_user_id` on `user_id`
- `idx_type` on `type`
- `idx_is_active` on `is_active`
- `idx_created_at` on `created_at`

**Foreign Keys:**
- `user_id` → `users.id` ON DELETE CASCADE

**Notes:**
- `account_name`, `account_type`, `institution_name` are aliases used in API responses
- `metadata` stores connection info, external IDs, etc.

---

### 2.2 `transactions` Table
**Purpose:** Financial transactions for all accounts

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | CHAR(36) | PRIMARY KEY, DEFAULT UUID() | Unique transaction identifier |
| `account_id` | CHAR(36) | NOT NULL | FK to accounts table |
| `user_id` | CHAR(36) | NOT NULL | FK to users table |
| `date` | DATE | NOT NULL | Transaction date |
| `transaction_date` | DATE | NOT NULL | Transaction date (alias) |
| `description` | TEXT | NOT NULL | Transaction description |
| `amount` | DECIMAL(15, 2) | NOT NULL | Transaction amount (negative for debits) |
| `category` | VARCHAR(100) | DEFAULT 'uncategorized' | Transaction category |
| `type` | ENUM | NOT NULL | Type: income, expense, transfer |
| `transaction_type` | VARCHAR(50) | NOT NULL | Transaction type (alias) |
| `merchant_name` | VARCHAR(255) | NULL | Merchant/payee name |
| `pending` | BOOLEAN | DEFAULT FALSE | Whether transaction is pending |
| `tags` | JSON | NULL | Array of tags |
| `notes` | TEXT | NULL | User notes |
| `metadata` | JSON | NULL | Additional transaction data |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

**Indexes:**
- `idx_account_id` on `account_id`
- `idx_user_id` on `user_id`
- `idx_date` on `date` DESC
- `idx_type` on `type`
- `idx_category` on `category`
- `idx_created_at` on `created_at`

**Foreign Keys:**
- `account_id` → `accounts.id` ON DELETE CASCADE
- `user_id` → `users.id` ON DELETE CASCADE

**Notes:**
- `transaction_date`, `transaction_type`, `merchant_name` are aliases used in API
- `metadata` can store external transaction IDs for bank sync

---

### 2.3 `goals` Table
**Purpose:** User financial goals and targets

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | CHAR(36) | PRIMARY KEY, DEFAULT UUID() | Unique goal identifier |
| `user_id` | CHAR(36) | NOT NULL | FK to users table |
| `name` | VARCHAR(255) | NOT NULL | Goal name |
| `target_amount` | DECIMAL(15, 2) | NOT NULL | Target amount |
| `current_amount` | DECIMAL(15, 2) | DEFAULT 0.00 | Current progress |
| `deadline` | DATE | NULL | Target completion date |
| `category` | VARCHAR(100) | DEFAULT 'general' | Goal category |
| `is_completed` | BOOLEAN | DEFAULT FALSE | Completion status |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

**Indexes:**
- `idx_user_id` on `user_id`
- `idx_is_completed` on `is_completed`
- `idx_deadline` on `deadline`
- `idx_category` on `category`

**Foreign Keys:**
- `user_id` → `users.id` ON DELETE CASCADE

---

### 2.4 `budgets` Table
**Purpose:** User budget allocations by category

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | CHAR(36) | PRIMARY KEY, DEFAULT UUID() | Unique budget identifier |
| `user_id` | CHAR(36) | NOT NULL | FK to users table |
| `category` | VARCHAR(100) | NOT NULL | Budget category |
| `amount` | DECIMAL(15, 2) | NOT NULL | Budget amount |
| `period` | ENUM | NOT NULL, DEFAULT 'monthly' | Period: monthly, yearly |
| `is_active` | BOOLEAN | DEFAULT TRUE | Budget status |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

**Indexes:**
- `idx_user_id` on `user_id`
- `idx_category` on `category`
- `idx_period` on `period`
- `idx_is_active` on `is_active`

**Foreign Keys:**
- `user_id` → `users.id` ON DELETE CASCADE

---

## 3. ADMIN & CONFIGURATION TABLES

### 3.1 `licenses` Table
**Purpose:** License key management and subscription tiers

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | CHAR(36) | PRIMARY KEY, DEFAULT UUID() | Unique license record ID |
| `license_id` | VARCHAR(255) | UNIQUE, NOT NULL | License key |
| `tier` | ENUM | NOT NULL, DEFAULT 'free' | Tier: free, advanced, premium, family |
| `status` | ENUM | NOT NULL, DEFAULT 'valid' | Status: valid, expiring, expired |
| `expires_at` | TIMESTAMP | NOT NULL | Expiration date |
| `last_validated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last validation check |
| `override_active` | BOOLEAN | DEFAULT FALSE | Manual override enabled |
| `override_tier` | ENUM | NULL | Override tier if active |
| `features` | JSON | NULL | Available features object |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

**Indexes:**
- `idx_license_id` on `license_id`
- `idx_tier` on `tier`
- `idx_status` on `status`
- `idx_expires_at` on `expires_at`

**Features JSON Structure:**
```json
{
  "debt_optimizer": false,
  "strategy_simulator": false,
  "scenario_planning": false,
  "detailed_reports": false,
  "bank_api": false,
  "family_accounts": false
}
```

---

### 3.2 `feature_flags` Table
**Purpose:** Feature flag management for gradual rollouts

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `key` | VARCHAR(100) | PRIMARY KEY | Unique feature key |
| `description` | TEXT | NOT NULL | Feature description |
| `value` | BOOLEAN | DEFAULT FALSE | Feature enabled/disabled |
| `overridable_by` | JSON | NULL | Roles that can override (array) |
| `last_changed_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last change timestamp |
| `overridden_by_user_id` | CHAR(36) | NULL | User who last changed flag |
| `notes` | TEXT | NULL | Additional notes |

**Indexes:**
- `idx_value` on `value`
- `idx_last_changed_at` on `last_changed_at`

**Foreign Keys:**
- `overridden_by_user_id` → `users.id` ON DELETE SET NULL

**Default Flags:**
- `debt_optimizer_enabled`
- `strategy_simulator_enabled`
- `bank_api_enabled`
- `family_features_enabled`
- `reports_enabled`

---

### 3.3 `config_items` Table
**Purpose:** System configuration key-value store

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `key` | VARCHAR(100) | PRIMARY KEY | Configuration key |
| `value` | TEXT | NOT NULL | Configuration value |
| `encrypted` | BOOLEAN | DEFAULT FALSE | Value is encrypted |
| `masked` | BOOLEAN | DEFAULT FALSE | Value should be masked in UI |
| `description` | TEXT | NOT NULL | Configuration description |
| `requires_step_up` | BOOLEAN | DEFAULT FALSE | Requires elevated auth to change |
| `last_updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |
| `last_updated_by_user_id` | CHAR(36) | NULL | User who last updated |

**Indexes:**
- `idx_encrypted` on `encrypted`
- `idx_masked` on `masked`
- `idx_requires_step_up` on `requires_step_up`

**Foreign Keys:**
- `last_updated_by_user_id` → `users.id` ON DELETE SET NULL

**Default Config:**
- `smtp_host`, `smtp_port`, `smtp_user`, `smtp_password`
- `jwt_secret`
- `api_base_url`

---

### 3.4 `bank_connections` Table
**Purpose:** Bank API connection status and metadata

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | CHAR(36) | PRIMARY KEY, DEFAULT UUID() | Unique connection identifier |
| `user_id` | CHAR(36) | NOT NULL | FK to users table |
| `provider` | ENUM | NOT NULL, DEFAULT 'demo' | Provider: demo, teller, plaid, finicity, basiq, other |
| `institution_id` | VARCHAR(255) | NOT NULL | Institution identifier |
| `institution_name` | VARCHAR(255) | NOT NULL | Institution name |
| `status` | ENUM | NOT NULL, DEFAULT 'pending' | Status: pending, active, error, revoked |
| `connection_label` | VARCHAR(255) | DEFAULT '' | User-defined label |
| `failure_reason` | TEXT | NULL | Error message if failed |
| `last_synced_at` | TIMESTAMP | NULL | Last successful sync |
| `metadata` | JSON | NULL | Provider-specific metadata |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Connection creation |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

**Indexes:**
- `idx_user_id` on `user_id`
- `idx_status` on `status`
- `idx_provider` on `provider`
- `idx_institution_id` on `institution_id`

**Foreign Keys:**
- `user_id` → `users.id` ON DELETE CASCADE

---

## 4. CLIENT-SIDE TABLES (IndexedDB/Dexie)

### 4.1 `loans` (Client-Side Only)
**Purpose:** Debt/loan tracking for debt optimizer feature

| Column | Type | Description |
|--------|------|-------------|
| `id` | string | Unique loan identifier |
| `name` | string | Loan name |
| `type` | string | Loan type: mortgage, auto, personal, student, credit_card |
| `principal` | number | Original loan amount |
| `currentBalance` | number | Current balance |
| `interestRate` | number | Annual interest rate (percentage) |
| `monthlyPayment` | number | Required monthly payment |
| `fees` | number | Monthly fees |
| `startDate` | Date | Loan start date |
| `termMonths` | number | Total loan term in months |
| `color` | string | Display color (hex) |

**Indexes:**
- Primary: `id`
- Secondary: `name`, `type`, `principal`, `currentBalance`, `interestRate`

### 4.2 `scenarios` (Client-Side Only)
**Purpose:** Debt payoff scenario simulations

| Column | Type | Description |
|--------|------|-------------|
| `id` | string | Unique scenario identifier |
| `name` | string | Scenario name |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last update timestamp |

**Indexes:**
- Primary: `id`
- Secondary: `name`, `createdAt`, `updatedAt`

---

## 5. MISSING TABLES IDENTIFIED

Based on API routes and service layer analysis, the following columns are referenced but missing from schema:

### In `users` table:
- ✅ `first_name` - NEEDS TO BE ADDED
- ✅ `last_name` - NEEDS TO BE ADDED
- ✅ `timezone` - NEEDS TO BE ADDED
- ✅ `locale` - NEEDS TO BE ADDED
- ✅ `currency` - NEEDS TO BE ADDED
- ✅ `mfa_enabled` - NEEDS TO BE ADDED
- ✅ `profile_picture_url` - NEEDS TO BE ADDED
- ✅ `preferences` (JSON) - NEEDS TO BE ADDED
- ✅ `deleted_at` - NEEDS TO BE ADDED
- ✅ `license_id` - NEEDS TO BE ADDED

### In `accounts` table:
- ✅ `account_name` - Currently using `name` but API expects `account_name`
- ✅ `account_type` - Currently using `type` but API expects `account_type`
- ✅ `institution_name` - Currently using `institution` but API expects `institution_name`
- ✅ `account_number_last4` - NEEDS TO BE ADDED
- ✅ `metadata` (JSON) - NEEDS TO BE ADDED

### In `transactions` table:
- ✅ `transaction_date` - Currently using `date` but API expects `transaction_date`
- ✅ `transaction_type` - Currently using `type` but API expects `transaction_type`
- ✅ `merchant_name` - NEEDS TO BE ADDED
- ✅ `pending` - NEEDS TO BE ADDED
- ✅ `tags` (JSON) - NEEDS TO BE ADDED
- ✅ `metadata` (JSON) - NEEDS TO BE ADDED

### In `audit_logs` table:
- ✅ `user_id` - NEEDS TO BE ADDED (for general actions)
- ✅ `entity_type` - NEEDS TO BE ADDED
- ✅ `entity_id` - NEEDS TO BE ADDED
- ✅ `changes` (JSON) - NEEDS TO BE ADDED
- ✅ `ip_address` - NEEDS TO BE ADDED
- ✅ `user_agent` - NEEDS TO BE ADDED

---

## 6. RELATIONSHIP DIAGRAM

```
users (1) ----< (M) sessions
users (1) ----< (M) password_resets
users (1) ----< (M) accounts
users (1) ----< (M) transactions
users (1) ----< (M) goals
users (1) ----< (M) budgets
users (1) ----< (M) bank_connections
users (M) ----< (1) licenses [via license_id]
users (1) ----< (M) audit_logs [as actor_user_id]
users (1) ----< (M) audit_logs [as impersonated_user_id]
users (1) ----< (M) feature_flags [as overridden_by_user_id]
users (1) ----< (M) config_items [as last_updated_by_user_id]

accounts (1) ----< (M) transactions
```

---

## 7. DATA TYPES & CONVENTIONS

### UUIDs
- All primary keys use CHAR(36) with DEFAULT UUID()
- Format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### Timestamps
- All tables have `created_at` and `updated_at`
- Format: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- Auto-update: ON UPDATE CURRENT_TIMESTAMP

### JSON Columns
- `metadata`, `preferences`, `features`, `tags`, `changes`
- Store structured data as JSON
- Always check for NULL before parsing

### ENUMs
- Strict value enforcement at database level
- Common: roles, tiers, statuses, types

### Decimals
- Financial amounts: DECIMAL(15, 2)
- Percentages/rates: DECIMAL(5, 2) or stored as whole numbers

### Soft Deletes
- Use `deleted_at` TIMESTAMP NULL
- Filter with `WHERE deleted_at IS NULL`

---

## 8. INDEXES SUMMARY

### Critical Indexes (Performance)
- All foreign keys are indexed
- `user_id` on all user-owned tables
- Date columns for chronological queries
- Status/active flags for filtering
- Email/username for authentication

### Composite Indexes Needed
- `(user_id, created_at)` on transactions for user timeline
- `(user_id, is_active)` on accounts for active accounts query
- `(user_id, deadline)` on goals for upcoming goals

---

## 9. SECURITY CONSIDERATIONS

### Row Level Security (RLS)
While this is MariaDB (not PostgreSQL/Supabase), implement equivalent:
- All queries MUST filter by `user_id`
- Use middleware to inject user context
- Validate user ownership before updates/deletes

### Sensitive Data
- Passwords: bcrypt hashed in `password_hash`
- API keys: encrypted in `config_items`
- PII: `email`, `phone`, `profile_picture_url`

### Audit Trail
- All data modifications logged in `audit_logs`
- Include IP address and user agent
- Immutable audit records (set `immutable = TRUE`)

---

## 10. MIGRATION PRIORITIES

### CRITICAL (Required for API to work):
1. Add missing columns to `users` table
2. Add missing columns to `accounts` table
3. Add missing columns to `transactions` table
4. Add missing columns to `audit_logs` table

### HIGH (Required for features):
5. Ensure all indexes are created
6. Add foreign key constraints
7. Insert default feature flags
8. Insert default config items
9. Insert default license

### MEDIUM (Data integrity):
10. Add CHECK constraints for valid ENUMs
11. Add triggers for `updated_at` if not using ON UPDATE
12. Add triggers for soft delete cascades

---

## 11. SQL GENERATION CHECKLIST

When generating migration SQL:
- [ ] Use `IF NOT EXISTS` for tables
- [ ] Use `IF NOT EXISTS` for columns (via DO blocks)
- [ ] Create indexes after table creation
- [ ] Add foreign keys last
- [ ] Use proper ENGINE=InnoDB
- [ ] Use utf8mb4 charset and collation
- [ ] Set DEFAULT values appropriately
- [ ] Include comments explaining complex fields

---

**Last Updated:** 2025-10-03
**Database Version:** MariaDB 10.5+
**Schema Version:** 1.0
