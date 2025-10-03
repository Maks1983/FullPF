/*
  # Financial Data Tables

  1. New Tables
    - `accounts`
      - `id` (uuid, primary key) - Account unique identifier
      - `user_id` (uuid, foreign key) - Reference to users table
      - `name` (text) - Account name
      - `type` (text) - Account type (checking, savings, credit, loan, investment, asset, liability)
      - `balance` (decimal) - Current account balance
      - `currency` (text) - Currency code (USD, EUR, etc.)
      - `institution` (text) - Financial institution name
      - `is_active` (boolean) - Whether account is active
      - `created_at` (timestamptz) - Account creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `transactions`
      - `id` (uuid, primary key) - Transaction unique identifier
      - `account_id` (uuid, foreign key) - Reference to accounts table
      - `user_id` (uuid, foreign key) - Reference to users table
      - `date` (date) - Transaction date
      - `description` (text) - Transaction description
      - `amount` (decimal) - Transaction amount
      - `category` (text) - Transaction category
      - `type` (text) - Transaction type (income, expense, transfer)
      - `notes` (text) - Additional notes
      - `created_at` (timestamptz) - Transaction creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `goals`
      - `id` (uuid, primary key) - Goal unique identifier
      - `user_id` (uuid, foreign key) - Reference to users table
      - `name` (text) - Goal name
      - `target_amount` (decimal) - Target amount
      - `current_amount` (decimal) - Current progress
      - `deadline` (date) - Goal deadline
      - `category` (text) - Goal category
      - `is_completed` (boolean) - Whether goal is completed
      - `created_at` (timestamptz) - Goal creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `budgets`
      - `id` (uuid, primary key) - Budget unique identifier
      - `user_id` (uuid, foreign key) - Reference to users table
      - `category` (text) - Budget category
      - `amount` (decimal) - Budget amount
      - `period` (text) - Budget period (monthly, yearly)
      - `is_active` (boolean) - Whether budget is active
      - `created_at` (timestamptz) - Budget creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on all tables
    - Users can only access their own financial data
    - All operations require authentication
*/

-- Accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('checking', 'savings', 'credit', 'loan', 'investment', 'asset', 'liability')),
  balance decimal(15, 2) DEFAULT 0,
  currency text DEFAULT 'USD',
  institution text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own accounts"
  ON accounts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own accounts"
  ON accounts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own accounts"
  ON accounts FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own accounts"
  ON accounts FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  description text NOT NULL,
  amount decimal(15, 2) NOT NULL,
  category text DEFAULT 'uncategorized',
  type text NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  target_amount decimal(15, 2) NOT NULL,
  current_amount decimal(15, 2) DEFAULT 0,
  deadline date,
  category text DEFAULT 'general',
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own goals"
  ON goals FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own goals"
  ON goals FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category text NOT NULL,
  amount decimal(15, 2) NOT NULL,
  period text NOT NULL DEFAULT 'monthly' CHECK (period IN ('monthly', 'yearly')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own budgets"
  ON budgets FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own budgets"
  ON budgets FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own budgets"
  ON budgets FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own budgets"
  ON budgets FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
