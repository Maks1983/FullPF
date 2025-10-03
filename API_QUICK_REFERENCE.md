# API Quick Reference Card

## Base URLs

```
Production: https://your-project.supabase.co/functions/v1
Development: http://localhost:54321/functions/v1
```

## Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api-login` | POST | No | Login and get tokens |
| `/api-user` | GET | Yes | Get user info + rate limits |
| `/api-accounts` | GET | Yes | Get expense accounts |
| `/api-transactions` | POST | Yes | Batch insert (max 50) |
| `/api-sync-status` | GET | Yes | Check sync status |

## Authentication

```bash
# Login
curl -X POST $BASE_URL/api-login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass"}'

# Use token
curl $BASE_URL/api-user \
  -H "Authorization: Bearer $TOKEN"
```

## Rate Limits

| Tier | Req/Min |
|------|---------|
| Free | 30 |
| Advanced | 60 |
| Premium | 120 |
| Family | 180 |

## Quick Start (TypeScript)

```typescript
import { ExpenseAPIClient } from './api/client';

const client = new ExpenseAPIClient({
  baseUrl: 'https://your-project.supabase.co/functions/v1'
});

// Login
const { accessToken } = await client.login({
  email: 'user@example.com',
  password: 'password'
});

// Get accounts
const { accounts } = await client.getAccounts();

// Add expense
await client.batchTransactions({
  transactions: [{
    accountId: accounts[0].id,
    description: 'Coffee',
    amount: -4.50,
    type: 'expense',
    clientId: `local-${Date.now()}`
  }]
});
```

## Offline Flow

```typescript
// 1. Store in memory while offline
pendingExpenses.push(expense);

// 2. Sync when online
if (navigator.onLine) {
  const result = await client.batchTransactions({
    transactions: pendingExpenses
  });

  // 3. Remove synced
  const synced = result.results
    .filter(r => r.success)
    .map(r => r.clientId);

  pendingExpenses = pendingExpenses
    .filter(e => !synced.has(e.clientId));
}
```

## Error Codes

| Code | Meaning |
|------|---------|
| `UNAUTHORIZED` | Missing/invalid token |
| `INVALID_CREDENTIALS` | Wrong email/password |
| `INVALID_INPUT` | Malformed request |
| `BATCH_TOO_LARGE` | >50 transactions |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

## Deployment

```bash
# Link project
supabase link --project-ref YOUR_REF

# Deploy all
supabase functions deploy api-login
supabase functions deploy api-accounts
supabase functions deploy api-transactions
supabase functions deploy api-user
supabase functions deploy api-sync-status
```

## Testing

```bash
# Test login
curl -X POST $BASE_URL/api-login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'

# Test with token
TOKEN="your-token-here"

curl $BASE_URL/api-user \
  -H "Authorization: Bearer $TOKEN"

curl $BASE_URL/api-accounts \
  -H "Authorization: Bearer $TOKEN"

curl -X POST $BASE_URL/api-transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"transactions":[{"accountId":"UUID","description":"Test","amount":-10,"type":"expense"}]}'
```

## Connection Indicator

```typescript
function ConnectionStatus({ isOnline, pending }) {
  return (
    <div className={isOnline ? 'online' : 'offline'}>
      <span className={isOnline ? '🟢' : '⚪'} />
      {isOnline ? 'Live' : 'Offline'}
      {pending > 0 && ` (${pending} pending)`}
    </div>
  );
}
```

## Common Patterns

### Add Expense
```typescript
await client.batchTransactions({
  transactions: [{
    accountId: 'uuid',
    date: '2025-10-03',
    description: 'Coffee',
    amount: -4.50,
    category: 'food',
    type: 'expense',
    clientId: `local-${Date.now()}`
  }]
});
```

### Check Sync
```typescript
const status = await client.getSyncStatus({
  lastSyncTimestamp: localStorage.getItem('lastSync')
});

if (status.needsFullSync) {
  // Full refresh needed
}
```

### Handle Offline
```typescript
window.addEventListener('online', async () => {
  await syncPendingExpenses();
});

window.addEventListener('offline', () => {
  showOfflineMessage();
});
```

## Documentation

- **Full API Docs**: `API_DOCUMENTATION.md`
- **Quick Start**: `API_README.md`
- **Deployment**: `API_DEPLOYMENT_GUIDE.md`
- **Implementation**: `API_IMPLEMENTATION_SUMMARY.md`
- **Examples**: `src/api/examples/mobile-app.example.ts`

## Support URLs

- Supabase: https://supabase.com/docs
- Functions: https://supabase.com/docs/guides/functions
- Project: https://supabase.com/dashboard/project/YOUR_REF
