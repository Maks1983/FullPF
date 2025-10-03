# OwnCent MariaDB Database Setup

This directory contains the complete MariaDB schema and mock data for the OwnCent personal finance application.

## Directory Structure

```
database/
├── schema/
│   ├── 01_create_users_and_auth.sql      # Users, sessions, audit logs
│   ├── 02_create_financial_tables.sql    # Accounts, transactions, budgets, goals
│   └── 03_create_admin_tables.sql        # Feature flags, config, licenses
├── mock_data/
│   ├── 01_insert_users_and_auth.sql      # Demo users and sessions
│   ├── 02_insert_financial_data.sql      # Sample accounts and transactions
│   └── 03_insert_admin_data.sql          # Bank connections and config
└── README.md                              # This file
```

## Database Requirements

- **MariaDB**: Version 10.5 or higher
- **Character Set**: utf8mb4
- **Collation**: utf8mb4_unicode_ci
- **Storage Engine**: InnoDB

## Quick Start

### 1. Create Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE owncent CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE owncent;
```

### 2. Run Schema Scripts (in order)

```bash
mysql -u root -p owncent < database/schema/01_create_users_and_auth.sql
mysql -u root -p owncent < database/schema/02_create_financial_tables.sql
mysql -u root -p owncent < database/schema/03_create_admin_tables.sql
```

### 3. Load Mock Data (optional, for testing)

```bash
mysql -u root -p owncent < database/mock_data/01_insert_users_and_auth.sql
mysql -u root -p owncent < database/mock_data/02_insert_financial_data.sql
mysql -u root -p owncent < database/mock_data/03_insert_admin_data.sql
```

## Demo Users

After loading mock data, you can test with these demo accounts:

| Email | Password | Role | License Tier |
|-------|----------|------|--------------|
| admin@owncent.com | Demo123456! | owner | free |
| premium@example.com | Demo123456! | user | premium |
| free@example.com | Demo123456! | user | free |
| family@example.com | Demo123456! | family | family |

**Note**: Passwords are hashed using bcrypt. The plaintext password `Demo123456!` is shown for testing purposes only.

## Schema Overview

### Core Tables

#### Users & Authentication
- `users` - User accounts with profile information
- `sessions` - Active user sessions with refresh tokens
- `audit_logs` - Comprehensive audit trail of all system actions
- `password_reset_tokens` - Secure password reset mechanism
- `mfa_secrets` - Multi-factor authentication secrets and backup codes

#### Financial Data
- `accounts` - Bank accounts, credit cards, loans, investments
- `transactions` - All financial transactions with categorization
- `budgets` - Monthly/yearly budget tracking by category
- `savings_goals` - User-defined savings targets with progress tracking
- `recurring_transactions` - Scheduled recurring income/expenses
- `investment_holdings` - Portfolio holdings with real-time values

#### Admin & Configuration
- `feature_flags` - Toggle premium features per license tier
- `config_items` - System configuration (SMTP, API keys, etc.)
- `licenses` - License management with tier-based features
- `bank_connections` - Open banking / aggregation connections

## Key Design Decisions

### UUID Storage
UUIDs are stored as `CHAR(36)` for maximum compatibility across systems. While MariaDB supports native UUID types in newer versions, CHAR(36) ensures:
- Easy migration to/from other databases
- Standard string representation
- No binary encoding issues

### Monetary Values
All monetary amounts use `DECIMAL(15,2)` providing:
- Up to 999,999,999,999.99 (trillion-scale support)
- Exact precision (no floating-point errors)
- Standard currency formatting

### Timestamps
- All tables use `TIMESTAMP` with automatic `updated_at` triggers
- Default to `CURRENT_TIMESTAMP` for creation
- `ON UPDATE CURRENT_TIMESTAMP` for modifications

### JSON Fields
MariaDB 10.5+ provides native JSON support used for:
- Flexible metadata storage
- Feature flag overrides
- User preferences
- Transaction tags and enrichment

### Indexes
Strategic indexes are placed on:
- Foreign keys (automatic in InnoDB)
- Frequently queried columns (status, dates)
- Columns used in WHERE clauses
- Columns used in JOIN operations

## Security Considerations

### Password Storage
- All passwords MUST be hashed using bcrypt with salt rounds ≥ 10
- Never store plaintext passwords
- Use prepared statements to prevent SQL injection

### Sensitive Data
- Config items support encryption (`encrypted` flag)
- Sensitive values can be masked (`masked` flag)
- Audit logging tracks all sensitive operations
- Foreign keys use `ON DELETE` rules to maintain data integrity

### Application-Layer Security
Since this is a self-hosted MariaDB setup (not using Supabase RLS):
- **Authentication** must be enforced at the application/API layer
- **Authorization** checks must validate user_id matches session
- **Input validation** is critical before database operations
- **Prepared statements** must be used for all queries

## Maintenance

### Backup Strategy
```bash
# Full backup
mysqldump -u root -p owncent > backup_$(date +%Y%m%d_%H%M%S).sql

# Schema only
mysqldump -u root -p --no-data owncent > schema_backup.sql

# Data only
mysqldump -u root -p --no-create-info owncent > data_backup.sql
```

### Regular Maintenance
```sql
-- Optimize tables (monthly)
OPTIMIZE TABLE users, accounts, transactions, audit_logs;

-- Analyze tables for query optimization (weekly)
ANALYZE TABLE users, accounts, transactions;

-- Clean old audit logs (quarterly)
DELETE FROM audit_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 2 YEAR);

-- Clean expired sessions (daily)
DELETE FROM sessions WHERE expires_at < NOW();

-- Clean expired password reset tokens (hourly)
DELETE FROM password_reset_tokens WHERE expires_at < NOW();
```

## Connection Configuration

### Environment Variables
```bash
DB_HOST=localhost
DB_PORT=3306
DB_NAME=owncent
DB_USER=owncent_app
DB_PASSWORD=your_secure_password_here
DB_POOL_MIN=2
DB_POOL_MAX=10
```

### Node.js Connection Example
```javascript
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_POOL_MAX),
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

export default pool;
```

## Migration from Supabase

If migrating from the previous Supabase setup:

1. **Export Supabase data** using their CLI or dashboard
2. **Transform data** to match MariaDB schema (UUIDs remain the same)
3. **Import using SQL** files with proper foreign key ordering
4. **Update application** to use MariaDB connection instead of Supabase client
5. **Replace RLS policies** with application-layer authentication checks
6. **Test thoroughly** with all user roles and permissions

## Troubleshooting

### Common Issues

**Foreign Key Constraint Failures**
- Ensure parent records exist before inserting child records
- Load tables in dependency order (users → accounts → transactions)

**UUID Format Errors**
- MariaDB expects UUIDs in format: `550e8400-e29b-41d4-a716-446655440001`
- Use `UUID()` function or generate with proper format

**Character Set Issues**
- Always specify `utf8mb4` for international character support
- Set connection charset: `SET NAMES utf8mb4;`

**JSON Parsing Errors**
- Validate JSON before insertion using `JSON_VALID()` function
- Use `JSON_OBJECT()` and `JSON_ARRAY()` for construction

## Support

For questions or issues:
1. Check this README first
2. Review schema comments in SQL files
3. Examine mock data for examples
4. Consult MariaDB documentation: https://mariadb.org/documentation/

## License

This database schema is part of the OwnCent application.
