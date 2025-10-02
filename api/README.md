# Personal Finance API Microservice

A comprehensive REST API for personal finance management, designed as an independent microservice.

## Features

- **User Management** - Registration, authentication, profile management
- **Account Management** - Bank accounts, credit cards, investments
- **Transaction Tracking** - Income, expenses, transfers with categorization
- **Budget Management** - Category-based budgets with spending analysis
- **Goal Tracking** - Financial goals with progress monitoring
- **Analytics** - Financial health scoring and trend analysis
- **Security** - JWT authentication, rate limiting, input validation

## Quick Start

1. **Install dependencies:**
   ```bash
   cd api
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/change-password` - Change password

### Accounts
- `GET /api/accounts` - Get all accounts
- `POST /api/accounts` - Create new account
- `GET /api/accounts/:id` - Get account by ID
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account
- `GET /api/accounts/summary/overview` - Get account summary

### Transactions
- `GET /api/transactions` - Get transactions (with filters)
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/:id` - Get transaction by ID
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/analytics/monthly/:year` - Get monthly totals

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `GET /api/categories/:id` - Get category by ID
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category
- `GET /api/categories/analytics/spending` - Get spending by category

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create new goal
- `GET /api/goals/:id` - Get goal by ID
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `POST /api/goals/:id/progress` - Update goal progress
- `GET /api/goals/analytics/progress` - Get goal progress analytics

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create new budget
- `GET /api/budgets/:id` - Get budget by ID
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget
- `GET /api/budgets/analytics/analysis` - Get budget analysis

### Analytics
- `GET /api/analytics/dashboard` - Get comprehensive analytics
- `GET /api/analytics/health` - Get financial health score

### Dashboard
- `GET /api/dashboard` - Get complete dashboard data
- `GET /api/dashboard/stats` - Get quick stats

## Data Models

### User
```typescript
{
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  currency: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Account
```typescript
{
  id: string;
  userId: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'loan';
  balance: number;
  currency: string;
  isActive: boolean;
  institution?: string;
  accountNumber?: string;
  interestRate?: number;
  creditLimit?: number;
  minimumBalance?: number;
}
```

### Transaction
```typescript
{
  id: string;
  userId: string;
  accountId: string;
  categoryId?: string;
  amount: number;
  description: string;
  date: Date;
  type: 'income' | 'expense' | 'transfer';
  status: 'pending' | 'completed' | 'cancelled';
  merchant?: string;
  location?: string;
  notes?: string;
  tags?: string[];
}
```

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Rate Limiting** - Prevents abuse and brute force attacks
- **Input Validation** - Comprehensive request validation with Joi
- **Error Handling** - Consistent error responses
- **CORS Protection** - Configurable cross-origin resource sharing
- **Helmet Security** - Security headers and protection

## Development

### Project Structure
```
api/
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic services
│   ├── types/           # TypeScript type definitions
│   └── index.ts         # Application entry point
├── dist/                # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

### Environment Variables

See `.env.example` for all available configuration options.

### Testing

```bash
npm test
```

### Linting and Formatting

```bash
npm run lint
npm run format
```

## Production Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Set production environment variables**

3. **Start the server:**
   ```bash
   npm start
   ```

## Database Integration

This microservice currently uses in-memory storage for demo purposes. For production:

1. **Choose a database** (PostgreSQL recommended)
2. **Add database client** (e.g., `pg`, `prisma`, `typeorm`)
3. **Replace service implementations** with database queries
4. **Add migrations** for schema management

## Future Enhancements

- Database integration with migrations
- Real-time notifications
- Bank API integrations
- Advanced analytics and reporting
- Automated categorization with ML
- Multi-currency support
- Backup and restore functionality