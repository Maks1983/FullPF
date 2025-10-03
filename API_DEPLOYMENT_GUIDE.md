# API Deployment Guide

## Prerequisites

1. **Supabase Project**: Create a project at https://supabase.com
2. **Supabase CLI**: Install globally
   ```bash
   npm install -g supabase
   ```
3. **Environment Setup**: Configure `.env` with Supabase credentials

## Step 1: Login to Supabase

```bash
supabase login
```

This will open a browser window for authentication.

## Step 2: Link Your Project

```bash
supabase link --project-ref your-project-ref
```

Find your project reference in the Supabase dashboard URL:
`https://supabase.com/dashboard/project/[your-project-ref]`

## Step 3: Verify Database Schema

Ensure all migrations have been applied:

```bash
supabase db push
```

Required tables:
- `users`
- `accounts`
- `transactions`
- `goals`
- `budgets`
- `bank_connections`

## Step 4: Deploy Edge Functions

Deploy each API endpoint:

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

### Deploy All at Once

```bash
supabase functions deploy api-login && \
supabase functions deploy api-accounts && \
supabase functions deploy api-transactions && \
supabase functions deploy api-user && \
supabase functions deploy api-sync-status
```

## Step 5: Verify Deployment

Test each endpoint:

### Test Login

```bash
curl -X POST https://your-project.supabase.co/functions/v1/api-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword"
  }'
```

Expected response:
```json
{
  "success": true,
  "accessToken": "eyJhbGc...",
  "refreshToken": "v1.MKo...",
  "expiresIn": 3600,
  "user": { ... }
}
```

### Test User Info

```bash
curl https://your-project.supabase.co/functions/v1/api-user \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Test Accounts

```bash
curl https://your-project.supabase.co/functions/v1/api-accounts \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Test Transactions

```bash
curl -X POST https://your-project.supabase.co/functions/v1/api-transactions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "transactions": [{
      "accountId": "YOUR_ACCOUNT_ID",
      "description": "Test expense",
      "amount": -10.00,
      "type": "expense"
    }]
  }'
```

### Test Sync Status

```bash
curl https://your-project.supabase.co/functions/v1/api-sync-status \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Step 6: Configure Mobile App

Update your mobile app configuration:

```typescript
const API_BASE_URL = 'https://your-project.supabase.co/functions/v1';

const client = new ExpenseAPIClient({
  baseUrl: API_BASE_URL,
});
```

## Step 7: Monitor Functions

### View Logs

```bash
# View logs for specific function
supabase functions logs api-login

# Follow logs in real-time
supabase functions logs api-login --follow

# View all function logs
supabase functions logs
```

### Check Function Status

```bash
supabase functions list
```

## Step 8: Set Up Environment Variables (Optional)

If you need custom environment variables:

```bash
supabase secrets set API_KEY=your-api-key
supabase secrets set OTHER_SECRET=value
```

View current secrets:
```bash
supabase secrets list
```

## Troubleshooting

### Function Not Found (404)

**Problem**: Function returns 404
**Solution**:
1. Verify function is deployed: `supabase functions list`
2. Check function name matches endpoint
3. Redeploy: `supabase functions deploy api-login`

### CORS Errors

**Problem**: Browser shows CORS errors
**Solution**: All functions include CORS headers. Verify:
1. OPTIONS request is handled
2. CORS headers are in response
3. Check browser console for specific error

### Authentication Errors

**Problem**: 401 Unauthorized
**Solution**:
1. Verify token is valid: check expiration
2. Ensure token is in Authorization header
3. Check user exists in database
4. Verify RLS policies on tables

### Database Connection Errors

**Problem**: 500 Internal Server Error
**Solution**:
1. Check function logs: `supabase functions logs api-name`
2. Verify database tables exist
3. Check RLS policies are correct
4. Ensure Supabase URL and keys are correct

## Performance Optimization

### Enable Function Caching

For read-heavy endpoints, add cache headers:

```typescript
return new Response(JSON.stringify(data), {
  headers: {
    ...corsHeaders,
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=60',
  },
});
```

### Connection Pooling

Supabase automatically handles connection pooling. For high-traffic apps:
1. Monitor connection usage in Supabase dashboard
2. Consider upgrading to Pro plan for more connections
3. Use connection pooler for external connections

## Security Checklist

- [ ] All Edge Functions deployed
- [ ] RLS policies enabled on all tables
- [ ] Test authentication flow
- [ ] Verify rate limiting works
- [ ] Test CORS from mobile app
- [ ] Check function logs for errors
- [ ] Verify token expiration handling
- [ ] Test with invalid credentials
- [ ] Confirm data isolation between users
- [ ] Review and limit function permissions

## Production Checklist

- [ ] All functions deployed to production project
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Test data seeded (if needed)
- [ ] Monitoring set up
- [ ] Error tracking configured
- [ ] Rate limits tested
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Mobile app updated with production URL

## Monitoring Setup

### Supabase Dashboard

1. Go to your project in Supabase dashboard
2. Navigate to **Functions** section
3. View metrics:
   - Request count
   - Error rate
   - Average latency
   - Cold starts

### Custom Logging

Add structured logging to functions:

```typescript
console.log(JSON.stringify({
  level: 'info',
  message: 'Transaction processed',
  userId: user.id,
  count: transactions.length,
  timestamp: new Date().toISOString(),
}));
```

## Rollback Procedure

If you need to rollback a deployment:

1. **Identify last good version**
   ```bash
   git log supabase/functions/api-login/
   ```

2. **Checkout previous version**
   ```bash
   git checkout <commit-hash> supabase/functions/api-login/
   ```

3. **Redeploy**
   ```bash
   supabase functions deploy api-login
   ```

## Update Procedure

To update an existing function:

1. **Make changes** to function code
2. **Test locally** (if possible)
3. **Deploy**
   ```bash
   supabase functions deploy api-login
   ```
4. **Verify** deployment with test requests
5. **Monitor** logs for errors

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy Supabase Functions

on:
  push:
    branches: [main]
    paths:
      - 'supabase/functions/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest

      - name: Deploy Functions
        run: |
          supabase functions deploy api-login
          supabase functions deploy api-accounts
          supabase functions deploy api-transactions
          supabase functions deploy api-user
          supabase functions deploy api-sync-status
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          PROJECT_REF: ${{ secrets.PROJECT_REF }}
```

## Cost Estimation

### Free Tier (Hobby)
- 500K Edge Function Invocations/month
- 2GB Bandwidth
- Suitable for: Development, small apps

### Pro Tier
- 2M Edge Function Invocations/month
- 50GB Bandwidth
- Suitable for: Production apps, moderate traffic

### Usage Monitoring

Check usage in Supabase dashboard:
1. Go to **Settings** > **Billing**
2. View current usage
3. Set up billing alerts

## Support

- **Supabase Docs**: https://supabase.com/docs/guides/functions
- **Edge Functions**: https://supabase.com/docs/guides/functions
- **API Documentation**: See `API_DOCUMENTATION.md`
- **Support**: https://supabase.com/support

## Next Steps

1. Deploy all functions
2. Test with Postman or curl
3. Update mobile app configuration
4. Set up monitoring
5. Configure CI/CD
6. Monitor usage and performance
