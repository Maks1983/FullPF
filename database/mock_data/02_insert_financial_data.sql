-- ================================================================
-- OwnCent Mock Data - Financial Data
-- Database: MariaDB 10.5+
-- ================================================================

-- Insert demo accounts for premium user
INSERT INTO accounts (id, user_id, account_name, account_type, institution_name, balance, currency, is_active, account_number_last4, metadata) VALUES
  -- Checking accounts
  ('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Chase Total Checking', 'checking', 'Chase Bank', 3542.67, 'USD', TRUE, '4523',
   JSON_OBJECT('sync_enabled', true, 'connection_id', 'conn_001')),

  ('a50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Wells Fargo Checking', 'checking', 'Wells Fargo', 1230.45, 'USD', TRUE, '7821',
   JSON_OBJECT('sync_enabled', true, 'connection_id', 'conn_002')),

  -- Savings accounts
  ('a50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'High Yield Savings', 'savings', 'Ally Bank', 15000.00, 'USD', TRUE, '9012',
   JSON_OBJECT('sync_enabled', true, 'connection_id', 'conn_003', 'apy', '4.35')),

  ('a50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Emergency Fund', 'savings', 'Marcus by Goldman Sachs', 8500.00, 'USD', TRUE, '3456',
   JSON_OBJECT('sync_enabled', false, 'apy', '4.40')),

  -- Credit cards
  ('a50e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Chase Sapphire Reserve', 'credit_card', 'Chase Bank', -2340.56, 'USD', TRUE, '7890',
   JSON_OBJECT('sync_enabled', true, 'connection_id', 'conn_001', 'credit_limit', 25000, 'apr', '18.99')),

  -- Investment accounts
  ('a50e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'Vanguard 401k', 'investment', 'Vanguard', 87540.23, 'USD', TRUE, '1234',
   JSON_OBJECT('sync_enabled', true, 'connection_id', 'conn_004', 'account_subtype', '401k')),

  ('a50e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 'Fidelity Roth IRA', 'investment', 'Fidelity', 45230.78, 'USD', TRUE, '5678',
   JSON_OBJECT('sync_enabled', true, 'connection_id', 'conn_005', 'account_subtype', 'roth_ira')),

  -- Loan accounts
  ('a50e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', 'Mortgage', 'loan', 'Wells Fargo', -285000.00, 'USD', TRUE, '9999',
   JSON_OBJECT('sync_enabled', true, 'connection_id', 'conn_002', 'interest_rate', '3.25', 'term_months', 360, 'monthly_payment', 1240.12)),

  ('a50e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440002', 'Auto Loan', 'loan', 'Toyota Financial', -18500.00, 'USD', TRUE, '1111',
   JSON_OBJECT('sync_enabled', false, 'interest_rate', '4.5', 'term_months', 60, 'monthly_payment', 345.23));

-- Insert accounts for free user
INSERT INTO accounts (id, user_id, account_name, account_type, institution_name, balance, currency, is_active) VALUES
  ('a50e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', 'Main Checking', 'checking', 'Bank of America', 987.34, 'USD', TRUE),
  ('a50e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440003', 'Savings Account', 'savings', 'Bank of America', 2500.00, 'USD', TRUE);

-- Insert transactions for premium user (last 30 days)
INSERT INTO transactions (id, account_id, user_id, transaction_date, description, amount, category, transaction_type, merchant_name, pending, tags, metadata) VALUES
  -- Recent checking account transactions
  ('t50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002',
   DATE_SUB(NOW(), INTERVAL 1 DAY), 'Salary Deposit', 4500.00, 'income', 'credit', 'Employer Inc', FALSE,
   JSON_ARRAY('income', 'salary'), JSON_OBJECT('external_id', 'txn_001')),

  ('t50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002',
   DATE_SUB(NOW(), INTERVAL 2 DAY), 'Whole Foods Market', -87.54, 'groceries', 'debit', 'Whole Foods', FALSE,
   JSON_ARRAY('groceries', 'food'), JSON_OBJECT('external_id', 'txn_002', 'location', 'Seattle, WA')),

  ('t50e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002',
   DATE_SUB(NOW(), INTERVAL 3 DAY), 'Shell Gas Station', -45.23, 'transportation', 'debit', 'Shell', FALSE,
   JSON_ARRAY('gas', 'transportation'), JSON_OBJECT('external_id', 'txn_003')),

  ('t50e8400-e29b-41d4-a716-446655440004', 'a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002',
   DATE_SUB(NOW(), INTERVAL 5 DAY), 'Netflix Subscription', -15.99, 'entertainment', 'debit', 'Netflix', FALSE,
   JSON_ARRAY('streaming', 'subscription'), JSON_OBJECT('external_id', 'txn_004', 'recurring', true)),

  ('t50e8400-e29b-41d4-a716-446655440005', 'a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002',
   DATE_SUB(NOW(), INTERVAL 7 DAY), 'Amazon.com', -142.67, 'shopping', 'debit', 'Amazon', FALSE,
   JSON_ARRAY('online', 'shopping'), JSON_OBJECT('external_id', 'txn_005')),

  -- Credit card transactions
  ('t50e8400-e29b-41d4-a716-446655440006', 'a50e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002',
   DATE_SUB(NOW(), INTERVAL 3 DAY), 'Starbucks', -6.75, 'dining', 'debit', 'Starbucks', FALSE,
   JSON_ARRAY('coffee', 'dining'), JSON_OBJECT('external_id', 'txn_006')),

  ('t50e8400-e29b-41d4-a716-446655440007', 'a50e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002',
   DATE_SUB(NOW(), INTERVAL 4 DAY), 'Restaurant Dining', -78.50, 'dining', 'debit', 'Local Restaurant', FALSE,
   JSON_ARRAY('dining', 'restaurant'), JSON_OBJECT('external_id', 'txn_007')),

  ('t50e8400-e29b-41d4-a716-446655440008', 'a50e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002',
   DATE_SUB(NOW(), INTERVAL 10 DAY), 'United Airlines', -456.00, 'travel', 'debit', 'United Airlines', FALSE,
   JSON_ARRAY('travel', 'airfare'), JSON_OBJECT('external_id', 'txn_008')),

  -- Pending transaction
  ('t50e8400-e29b-41d4-a716-446655440009', 'a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002',
   NOW(), 'Target', -95.32, 'shopping', 'debit', 'Target', TRUE,
   JSON_ARRAY('shopping', 'retail'), JSON_OBJECT('external_id', 'txn_009'));

-- Insert transactions for free user
INSERT INTO transactions (id, account_id, user_id, transaction_date, description, amount, category, transaction_type) VALUES
  ('t50e8400-e29b-41d4-a716-446655440010', 'a50e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003',
   DATE_SUB(NOW(), INTERVAL 1 DAY), 'Paycheck', 2800.00, 'income', 'credit'),

  ('t50e8400-e29b-41d4-a716-446655440011', 'a50e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003',
   DATE_SUB(NOW(), INTERVAL 2 DAY), 'Grocery Store', -56.43, 'groceries', 'debit'),

  ('t50e8400-e29b-41d4-a716-446655440012', 'a50e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003',
   DATE_SUB(NOW(), INTERVAL 5 DAY), 'Electric Bill', -120.00, 'utilities', 'debit');

-- Insert budgets
INSERT INTO budgets (id, user_id, category, period, amount, spent, start_date, end_date, rollover_enabled, alert_threshold) VALUES
  -- Premium user budgets
  ('b50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'groceries', 'monthly', 600.00, 87.54,
   DATE_FORMAT(NOW(), '%Y-%m-01'), LAST_DAY(NOW()), FALSE, 80),

  ('b50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'dining', 'monthly', 300.00, 85.25,
   DATE_FORMAT(NOW(), '%Y-%m-01'), LAST_DAY(NOW()), TRUE, 75),

  ('b50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'transportation', 'monthly', 200.00, 45.23,
   DATE_FORMAT(NOW(), '%Y-%m-01'), LAST_DAY(NOW()), FALSE, 90),

  ('b50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'entertainment', 'monthly', 150.00, 15.99,
   DATE_FORMAT(NOW(), '%Y-%m-01'), LAST_DAY(NOW()), TRUE, 85);

-- Insert savings goals
INSERT INTO savings_goals (id, user_id, goal_name, target_amount, current_amount, target_date, priority, category, linked_account_id, auto_contribute_amount, contribution_frequency, notes) VALUES
  -- Premium user goals
  ('g50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Emergency Fund', 20000.00, 8500.00,
   DATE_ADD(NOW(), INTERVAL 12 MONTH), 'high', 'emergency', 'a50e8400-e29b-41d4-a716-446655440004', 500.00, 'monthly',
   'Target: 6 months of expenses'),

  ('g50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Hawaii Vacation', 5000.00, 1200.00,
   DATE_ADD(NOW(), INTERVAL 8 MONTH), 'medium', 'vacation', 'a50e8400-e29b-41d4-a716-446655440003', 200.00, 'biweekly',
   'Family trip planned for summer'),

  ('g50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'New Car Down Payment', 15000.00, 3500.00,
   DATE_ADD(NOW(), INTERVAL 18 MONTH), 'medium', 'purchase', 'a50e8400-e29b-41d4-a716-446655440003', 300.00, 'monthly',
   'Target: 20% down payment'),

  ('g50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Home Renovation', 30000.00, 5000.00,
   DATE_ADD(NOW(), INTERVAL 24 MONTH), 'low', 'home', NULL, NULL, NULL,
   'Kitchen and bathroom updates');

-- Insert recurring transactions
INSERT INTO recurring_transactions (id, user_id, account_id, description, amount, category, frequency, next_date, end_date, merchant_name, auto_pay_enabled) VALUES
  ('r50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440008',
   'Mortgage Payment', -1240.12, 'housing', 'monthly', DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 MONTH), '%Y-%m-01'), NULL,
   'Wells Fargo Mortgage', TRUE),

  ('r50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440001',
   'Netflix Subscription', -15.99, 'entertainment', 'monthly', DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 MONTH), '%Y-%m-15'), NULL,
   'Netflix', TRUE),

  ('r50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440001',
   'Spotify Premium', -9.99, 'entertainment', 'monthly', DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 MONTH), '%Y-%m-10'), NULL,
   'Spotify', TRUE),

  ('r50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440001',
   'Salary Deposit', 4500.00, 'income', 'biweekly', DATE_ADD(NOW(), INTERVAL 14 DAY), NULL,
   'Employer Inc', FALSE),

  ('r50e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440001',
   'Electric Bill', -120.00, 'utilities', 'monthly', DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 MONTH), '%Y-%m-20'), NULL,
   'City Electric', FALSE);

-- Insert investment holdings
INSERT INTO investment_holdings (id, account_id, user_id, symbol, name, quantity, cost_basis, current_price, current_value, asset_type, sector) VALUES
  ('h50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002',
   'VTSAX', 'Vanguard Total Stock Market Index Fund', 850.5432, 75.45, 102.34, 87034.78, 'mutual_fund', 'diversified'),

  ('h50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002',
   'VFIAX', 'Vanguard 500 Index Fund', 250.1234, 150.23, 180.89, 45245.78, 'mutual_fund', 'large_cap'),

  ('h50e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002',
   'AAPL', 'Apple Inc.', 15.0000, 145.67, 175.23, 2628.45, 'stock', 'technology');
