# Offline Expense App API - Quick Start

## Overview

Secure, type-safe API wrapper for minimal offline expense tracking. Designed for mobile apps that store expenses in memory and sync when online.

## Features

✓ **Offline-First**: Expenses stored in memory, synced when connected
✓ **JWT Authentication**: Secure token-based auth via Supabase
✓ **Batch Processing**: Submit up to 50 transactions at once
✓ **Rate Limiting**: Tier-based limits (30-180 req/min)
✓ **Type-Safe**: Full TypeScript support
✓ **RBAC Enforcement**: Role and subscription tier validation
✓ **Live Sync Status**: Track pending transactions

## Quick Start

### 1. Setup

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref
```

### 2. Deploy Functions

```bash
# Deploy all API endpoints
supabase functions deploy api-login
supabase functions deploy api-accounts
supabase functions deploy api-transactions
supabase functions deploy api-user
supabase functions deploy api-sync-status
```

### 3. Test Authentication

```bash
curl -X POST https://your-project.supabase.co/functions/v1/api-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api-login` | POST | Authenticate and get tokens |
| `/api-user` | GET | Get user info and rate limits |
| `/api-accounts` | GET | Fetch expense accounts |
| `/api-transactions` | POST | Batch insert expenses |
| `/api-sync-status` | GET | Check sync status |

## Mobile App Integration

### Initialize Client

```typescript
import { ExpenseAPIClient } from './api-client';

const client = new ExpenseAPIClient({
  baseUrl: 'https://your-project.supabase.co/functions/v1',
  onTokenExpired: async () => {
    // Handle token refresh
    await refreshToken();
  },
});
```

### Login

```typescript
const result = await client.login({
  email: 'user@example.com',
  password: 'password123',
});

if (result.success) {
  localStorage.setItem('accessToken', result.accessToken);
  localStorage.setItem('refreshToken', result.refreshToken);
}
```

### Add Expense (Offline-First)

```typescript
// Add to local memory
const expense = {
  accountId: selectedAccount.id,
  date: new Date().toISOString().split('T')[0],
  description: 'Coffee',
  amount: -4.50,
  category: 'food',
  type: 'expense',
  clientId: `local-${Date.now()}`,
};

pendingExpenses.push(expense);

// Auto-sync when online
if (navigator.onLine) {
  await syncExpenses();
}
```

### Sync Expenses

```typescript
async function syncExpenses() {
  if (pendingExpenses.length === 0) return;

  const result = await client.batchTransactions({
    transactions: pendingExpenses,
  });

  // Remove successfully synced
  const successIds = result.results
    .filter(r => r.success)
    .map(r => r.clientId);

  pendingExpenses = pendingExpenses.filter(
    e => !successIds.has(e.clientId)
  );

  localStorage.setItem('lastSyncTimestamp', result.timestamp);
}
```

### Live/Offline Indicator

```typescript
function ConnectionStatus() {
  const [status, setStatus] = useState<'online' | 'offline'>('online');
  const [pending, setPending] = useState(0);

  useEffect(() => {
    const updateStatus = () => {
      setStatus(navigator.onLine ? 'online' : 'offline');
    };

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  return (
    <div className={`status-indicator ${status}`}>
      <span className={`dot ${status === 'online' ? 'green' : 'gray'}`} />
      {status === 'online' ? 'Live' : 'Offline'}
      {pending > 0 && ` (${pending} pending)`}
    </div>
  );
}
```

## Rate Limits

| Tier | Requests/Minute |
|------|-----------------|
| Free | 30 |
| Advanced | 60 |
| Premium | 120 |
| Family | 180 |

## Security

- **JWT Authentication**: Tokens expire in 1 hour
- **Row Level Security**: Database-level access control
- **RBAC**: Role-based permissions enforced
- **Input Validation**: All data validated server-side

## Project Structure

```
/project
├── src/
│   └── api/
│       ├── types.ts              # TypeScript types
│       └── utils/
│           ├── jwt.ts            # JWT utilities
│           └── rateLimit.ts      # Rate limiting
│
├── supabase/
│   └── functions/
│       ├── api-login/            # Login endpoint
│       ├── api-accounts/         # Accounts endpoint
│       ├── api-transactions/     # Transactions endpoint
│       ├── api-user/             # User info endpoint
│       └── api-sync-status/      # Sync status endpoint
│
├── API_DOCUMENTATION.md          # Full API docs
└── API_README.md                 # This file
```

## Example Client Implementation

```typescript
export class ExpenseAPIClient {
  constructor(private config: {
    baseUrl: string;
    onTokenExpired?: () => Promise<void>;
  }) {}

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('accessToken');

    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (response.status === 401 && this.config.onTokenExpired) {
      await this.config.onTokenExpired();
      return this.request(endpoint, options);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    return data;
  }

  async login(credentials: { email: string; password: string }) {
    return this.request<LoginResponse>('/api-login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getAccounts() {
    return this.request<AccountsResponse>('/api-accounts');
  }

  async batchTransactions(payload: { transactions: ApiTransaction[] }) {
    return this.request<BatchTransactionsResponse>('/api-transactions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getUserInfo() {
    return this.request<UserInfoResponse>('/api-user');
  }

  async getSyncStatus(lastSync?: string) {
    const query = lastSync ? `?lastSyncTimestamp=${lastSync}` : '';
    return this.request<SyncStatusResponse>(`/api-sync-status${query}`);
  }
}
```

## Testing

```bash
# Test login
curl -X POST https://your-project.supabase.co/functions/v1/api-login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Test accounts (requires token)
curl https://your-project.supabase.co/functions/v1/api-accounts \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test batch transactions
curl -X POST https://your-project.supabase.co/functions/v1/api-transactions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "transactions": [{
      "accountId": "ACCOUNT_ID",
      "description": "Test expense",
      "amount": -10.00,
      "type": "expense"
    }]
  }'
```

## Monitoring

### Check Function Logs

```bash
supabase functions logs api-login
supabase functions logs api-transactions
```

### Monitor Rate Limits

Use the `/api-user` endpoint to check remaining requests:

```typescript
const { rateLimit } = await client.getUserInfo();
console.log(`Remaining: ${rateLimit.requestsRemaining}/${rateLimit.requestsPerMinute}`);
```

## Troubleshooting

### Token Expired
**Error**: `Invalid or expired token`
**Solution**: Implement token refresh logic

### Rate Limit Exceeded
**Error**: `Rate limit exceeded`
**Solution**: Wait for reset or upgrade tier

### Account Not Found
**Error**: `Account not found or access denied`
**Solution**: Verify account ownership via `/api-accounts`

### Batch Too Large
**Error**: `Batch size exceeds maximum of 50`
**Solution**: Split into smaller batches

## Next Steps

1. **Deploy Functions**: Follow deployment steps above
2. **Test Endpoints**: Use curl or Postman
3. **Integrate Mobile App**: Use example client code
4. **Monitor Usage**: Check logs and rate limits
5. **Customize**: Extend for your specific needs

## Support

- **Full Documentation**: See `API_DOCUMENTATION.md`
- **Architecture**: See `ARCHITECTURE.md`
- **Supabase Docs**: https://supabase.com/docs

## License

Part of the OwnCent personal finance application.
