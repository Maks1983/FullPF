# Offline Expense App API Documentation

## Overview

The OwnCent Offline Expense App API provides a minimal, secure interface for mobile apps to sync expense data. The API is designed for offline-first applications where expenses are stored temporarily in memory and synced when internet is available.

## Architecture

### Technology Stack
- **Runtime**: Supabase Edge Functions (Deno)
- **Authentication**: JWT via Supabase Auth
- **Database**: Supabase PostgreSQL
- **Security**: Row Level Security (RLS) + RBAC

### Key Features
- JWT-based authentication
- Role and subscription tier enforcement
- Rate limiting per tier
- Batch transaction processing
- Offline-first design
- Type-safe requests/responses

## Base URL

```
Production: https://your-project.supabase.co/functions/v1
Development: http://localhost:54321/functions/v1
```

## Authentication

All endpoints except `/api-login` require authentication via Bearer token in the Authorization header.

```http
Authorization: Bearer <access_token>
```

### Token Lifecycle
- **Access Token**: Valid for 1 hour
- **Refresh Token**: Valid for 7 days (handled by Supabase Auth)
- **Auto-refresh**: Mobile app should handle token refresh before expiration

## Rate Limits

Rate limits are enforced per subscription tier:

| Tier | Requests/Minute |
|------|-----------------|
| Free | 30 |
| Advanced | 60 |
| Premium | 120 |
| Family | 180 |

## Endpoints

### 1. Login

Authenticate user and obtain access tokens.

**Endpoint**: `POST /api-login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "accessToken": "eyJhbGc...",
  "refreshToken": "v1.MKo...",
  "expiresIn": 3600,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "johndoe",
    "displayName": "John Doe",
    "role": "user",
    "tier": "premium",
    "isPremium": true
  }
}
```

**Error Responses**:
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid credentials

**Example**:
```typescript
const response = await fetch(`${baseUrl}/api-login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
  }),
});

const data = await response.json();
if (data.success) {
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
}
```

---

### 2. Get User Info

Fetch minimal user information and rate limit status.

**Endpoint**: `GET /api-user`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "johndoe",
    "displayName": "John Doe",
    "role": "user",
    "tier": "premium",
    "isPremium": true
  },
  "rateLimit": {
    "tier": "premium",
    "requestsPerMinute": 120,
    "requestsRemaining": 115,
    "resetAt": "2025-10-03T14:30:00Z"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: User profile not found

**Example**:
```typescript
const response = await fetch(`${baseUrl}/api-user`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
});

const data = await response.json();
console.log(`User: ${data.user.displayName}, Tier: ${data.user.tier}`);
```

---

### 3. Get Accounts

Fetch accounts available for expense entry (excludes bank-linked accounts by default).

**Endpoint**: `GET /api-accounts`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Query Parameters**:
- `includeInactive` (boolean, optional): Include inactive accounts (default: false)
- `excludeBankLinked` (boolean, optional): Exclude bank-linked accounts (default: true)

**Response** (200 OK):
```json
{
  "success": true,
  "accounts": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Personal Checking",
      "type": "checking",
      "balance": 2500.50,
      "currency": "USD",
      "institution": "Local Bank",
      "isActive": true
    },
    {
      "id": "789e4567-e89b-12d3-a456-426614174001",
      "name": "Savings Account",
      "type": "savings",
      "balance": 10000.00,
      "currency": "USD",
      "institution": "Local Bank",
      "isActive": true
    }
  ],
  "timestamp": "2025-10-03T14:25:30Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token

**Example**:
```typescript
const response = await fetch(
  `${baseUrl}/api-accounts?excludeBankLinked=true`,
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  }
);

const data = await response.json();
const accountOptions = data.accounts.map(acc => ({
  label: acc.name,
  value: acc.id,
}));
```

---

### 4. Batch Insert Transactions

Submit multiple expense transactions for processing. Maximum 50 transactions per batch.

**Endpoint**: `POST /api-transactions`

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "transactions": [
    {
      "accountId": "123e4567-e89b-12d3-a456-426614174000",
      "date": "2025-10-03",
      "description": "Coffee Shop",
      "amount": -4.50,
      "category": "food",
      "type": "expense",
      "notes": "Morning coffee",
      "clientId": "local-1696345200000"
    },
    {
      "accountId": "123e4567-e89b-12d3-a456-426614174000",
      "date": "2025-10-03",
      "description": "Grocery Store",
      "amount": -75.32,
      "category": "groceries",
      "type": "expense",
      "clientId": "local-1696345800000"
    }
  ]
}
```

**Transaction Fields**:
- `accountId` (string, required): Account UUID
- `date` (string, optional): ISO date (defaults to today)
- `description` (string, required): Transaction description
- `amount` (number, required): Transaction amount (negative for expenses)
- `category` (string, optional): Category (defaults to "uncategorized")
- `type` (string, required): "income", "expense", or "transfer"
- `notes` (string, optional): Additional notes
- `clientId` (string, optional): Client-side ID for tracking

**Response** (200 OK):
```json
{
  "success": true,
  "results": [
    {
      "clientId": "local-1696345200000",
      "id": "abc123-def456-ghi789",
      "success": true
    },
    {
      "clientId": "local-1696345800000",
      "id": "xyz987-uvw654-rst321",
      "success": true
    }
  ],
  "processed": 2,
  "failed": 0,
  "timestamp": "2025-10-03T14:27:15Z"
}
```

**Error Response** (Partial Failure):
```json
{
  "success": true,
  "results": [
    {
      "clientId": "local-1696345200000",
      "id": "abc123-def456-ghi789",
      "success": true
    },
    {
      "clientId": "local-1696345800000",
      "success": false,
      "error": "Account not found or access denied"
    }
  ],
  "processed": 1,
  "failed": 1,
  "timestamp": "2025-10-03T14:27:15Z"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input, batch too large (>50)
- `401 Unauthorized`: Missing or invalid token

**Example**:
```typescript
const pendingTransactions = [
  {
    accountId: selectedAccountId,
    date: '2025-10-03',
    description: 'Lunch',
    amount: -12.50,
    category: 'food',
    type: 'expense',
    clientId: `local-${Date.now()}`,
  },
];

const response = await fetch(`${baseUrl}/api-transactions`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ transactions: pendingTransactions }),
});

const result = await response.json();
const successIds = result.results
  .filter(r => r.success)
  .map(r => r.clientId);

// Remove successfully synced transactions from local storage
successIds.forEach(id => removeFromPending(id));
```

---

### 5. Sync Status

Check sync status and pending transaction count.

**Endpoint**: `GET /api-sync-status`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Query Parameters**:
- `lastSyncTimestamp` (string, optional): ISO timestamp of last successful sync

**Response** (200 OK):
```json
{
  "success": true,
  "lastSyncTimestamp": "2025-10-03T14:25:30Z",
  "pendingCount": 5,
  "serverTime": "2025-10-03T14:30:00Z",
  "needsFullSync": false
}
```

**Field Descriptions**:
- `lastSyncTimestamp`: Most recent transaction timestamp on server
- `pendingCount`: Number of transactions created since last sync
- `serverTime`: Current server time (for clock sync)
- `needsFullSync`: True if >24 hours since last sync

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token

**Example**:
```typescript
const lastSync = localStorage.getItem('lastSyncTimestamp');

const response = await fetch(
  `${baseUrl}/api-sync-status?lastSyncTimestamp=${lastSync}`,
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  }
);

const status = await response.json();
if (status.needsFullSync) {
  // Trigger full data refresh
  await fullSyncData();
} else if (status.pendingCount > 0) {
  // Show indicator: "5 new transactions"
  showSyncIndicator(status.pendingCount);
}
```

---

## Mobile App Integration

### Offline-First Flow

```typescript
class ExpenseTracker {
  private pendingTransactions: ApiTransaction[] = [];
  private accessToken: string | null = null;
  private isOnline = navigator.onLine;

  async addExpense(expense: ApiTransaction) {
    // Add to memory
    this.pendingTransactions.push({
      ...expense,
      clientId: `local-${Date.now()}`,
    });

    // Try immediate sync if online
    if (this.isOnline) {
      await this.syncTransactions();
    }
  }

  async syncTransactions() {
    if (!this.isOnline || this.pendingTransactions.length === 0) {
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api-transactions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactions: this.pendingTransactions,
        }),
      });

      const result = await response.json();

      // Remove successfully synced transactions
      const successIds = new Set(
        result.results
          .filter(r => r.success)
          .map(r => r.clientId)
      );

      this.pendingTransactions = this.pendingTransactions.filter(
        txn => !successIds.has(txn.clientId)
      );

      localStorage.setItem('lastSyncTimestamp', result.timestamp);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }

  setupConnectivityMonitoring() {
    window.addEventListener('online', async () => {
      this.isOnline = true;
      await this.syncTransactions();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Periodic sync check every 5 minutes
    setInterval(() => {
      if (this.isOnline) {
        this.syncTransactions();
      }
    }, 5 * 60 * 1000);
  }
}
```

### Live/Offline Indicator

```typescript
function ConnectionIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={`indicator ${isOnline ? 'online' : 'offline'}`}>
      <span className={`dot ${isOnline ? 'green' : 'gray'}`} />
      {isOnline ? 'Live' : 'Offline'}
      {pendingCount > 0 && ` (${pendingCount} pending)`}
    </div>
  );
}
```

---

## Error Handling

### Standard Error Response

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Error Codes

| Code | Description |
|------|-------------|
| `METHOD_NOT_ALLOWED` | Wrong HTTP method used |
| `UNAUTHORIZED` | Missing or invalid auth header |
| `INVALID_TOKEN` | Expired or malformed token |
| `INVALID_CREDENTIALS` | Wrong email/password |
| `USER_NOT_FOUND` | User profile missing |
| `INVALID_INPUT` | Malformed request body |
| `BATCH_TOO_LARGE` | Too many transactions (>50) |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

### Retry Strategy

```typescript
async function apiRequestWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3
): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);

      // Don't retry client errors (4xx except 429)
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        return response;
      }

      // Retry on server errors (5xx) or rate limit (429)
      if (response.status >= 500 || response.status === 429) {
        const delay = Math.min(1000 * Math.pow(2, i), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.min(1000 * Math.pow(2, i), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Max retries exceeded');
}
```

---

## Security

### Authentication
- JWT tokens via Supabase Auth
- Tokens expire after 1 hour
- Refresh tokens valid for 7 days

### Authorization
- Row Level Security (RLS) enforces data isolation
- Users can only access their own data
- Role-based access control (RBAC)

### Data Validation
- All inputs validated server-side
- Account ownership verified
- Transaction limits enforced

### Rate Limiting
- Per-user, per-tier limits
- 429 status on limit exceeded
- Resets every minute

---

## Deployment

### Supabase Edge Functions

Deploy all functions:

```bash
# Deploy login endpoint
supabase functions deploy api-login

# Deploy accounts endpoint
supabase functions deploy api-accounts

# Deploy transactions endpoint
supabase functions deploy api-transactions

# Deploy user info endpoint
supabase functions deploy api-user

# Deploy sync status endpoint
supabase functions deploy api-sync-status
```

### Environment Variables

All required environment variables are automatically available in Supabase Edge Functions:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (if needed)

---

## Testing

### Example Test Suite

```typescript
describe('Expense API', () => {
  let accessToken: string;
  let accountId: string;

  beforeAll(async () => {
    // Login
    const loginRes = await fetch(`${baseUrl}/api-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });
    const loginData = await loginRes.json();
    accessToken = loginData.accessToken;

    // Get accounts
    const accountsRes = await fetch(`${baseUrl}/api-accounts`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    const accountsData = await accountsRes.json();
    accountId = accountsData.accounts[0].id;
  });

  test('should create expense', async () => {
    const res = await fetch(`${baseUrl}/api-transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactions: [{
          accountId,
          description: 'Test expense',
          amount: -10.00,
          type: 'expense',
          clientId: 'test-1',
        }],
      }),
    });

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.processed).toBe(1);
    expect(data.failed).toBe(0);
  });
});
```

---

## Migration Notes

### From Bolt Database to MariaDB

The API is designed to be database-agnostic. When migrating from Supabase to MariaDB:

1. **Service Layer**: No changes needed - service functions abstract database access
2. **RLS**: Implement equivalent access control in application layer
3. **Auth**: Continue using Supabase Auth or migrate to custom JWT
4. **Edge Functions**: Can be migrated to Express/Fastify endpoints

---

## Support

For issues or questions:
- Check error codes in responses
- Review rate limit headers
- Verify token expiration
- Check RLS policies in Supabase

## Changelog

### v1.0.0 (2025-10-03)
- Initial release
- Login endpoint
- User info endpoint
- Accounts endpoint
- Batch transactions endpoint
- Sync status endpoint
- Rate limiting per tier
- Full RLS and RBAC enforcement
