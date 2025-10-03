# OwnCent Architecture Documentation

## Overview

OwnCent is a consolidated personal finance application built with React, TypeScript, and Supabase. All backend functionality is handled through Supabase's managed services, eliminating the need for a separate backend server.

## Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Database Client**: Supabase JS Client

### Backend Stack
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime (optional)
- **Storage**: Supabase Storage (optional)

## Project Structure

```
/project
├── src/
│   ├── config/
│   │   └── app.config.ts          # Centralized configuration
│   ├── lib/
│   │   ├── supabase.ts            # Supabase client & types
│   │   └── apiClient.ts           # (Legacy - can be removed)
│   ├── services/
│   │   ├── authService.ts         # Authentication service
│   │   ├── adminService.ts        # Admin operations
│   │   └── financialService.ts   # Financial data operations
│   ├── context/
│   │   ├── AuthContext.tsx        # Auth state management
│   │   ├── AdminFoundation.tsx    # Admin functionality
│   │   └── DashboardContext.tsx   # Dashboard state
│   ├── components/
│   │   ├── auth/                  # Authentication components
│   │   ├── admin/                 # Admin panel components
│   │   ├── dashboard/             # Dashboard components
│   │   └── ...
│   └── ...
├── .env                           # Environment configuration
└── supabase/                      # Supabase migrations (in database)
```

## Configuration Management

### Centralized Configuration

All application configuration is managed through a single source: `src/config/app.config.ts`

```typescript
{
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
  };
  supabase: {
    url: string;
    anonKey: string;
  };
  tenant: {
    id: string;
    name: string;
    confirmationToken: string;
  };
  features: {
    enableBankIntegration: boolean;
    enablePremiumFeatures: boolean;
    enableAnalytics: boolean;
  };
  security: {
    stepUpCode: string;
    stepUpValidWindowMs: number;
  };
}
```

### Environment Variables

Configuration is controlled through environment variables in `.env`:

```env
# Required - Supabase Connection
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional - Application Settings
VITE_APP_ENV=development
VITE_TENANT_ID=demo-instance
VITE_TENANT_NAME=OwnCent Demo Instance

# Optional - Feature Flags
VITE_ENABLE_BANK_INTEGRATION=false
VITE_ENABLE_PREMIUM_FEATURES=true
VITE_ENABLE_ANALYTICS=false
```

## Database Schema

### Core Tables

#### users
- User profiles and authentication metadata
- Roles: owner, manager, user, family, readonly
- Tiers: free, advanced, premium, family
- RLS: Users can only access their own profile

#### accounts
- Financial accounts (checking, savings, credit, etc.)
- Balance tracking
- RLS: Users can only access their own accounts

#### transactions
- Financial transactions linked to accounts
- Categorization and tagging
- RLS: Users can only access their own transactions

#### goals
- Savings and financial goals
- Progress tracking
- RLS: Users can only access their own goals

#### budgets
- Budget categories and limits
- Period-based tracking (monthly, yearly)
- RLS: Users can only access their own budgets

### Admin Tables

#### feature_flags
- System-wide feature toggles
- Role-based override permissions
- RLS: All authenticated users can read, only owners can update

#### config_items
- System configuration (SMTP, API URLs, etc.)
- Encrypted and masked values
- RLS: Only owners/managers can read, only owners can update

#### licenses
- License management and tier enforcement
- Override capabilities for support
- RLS: All authenticated users can read, only owners can update

#### audit_logs
- Complete audit trail of all admin actions
- Immutable records with impersonation tracking
- RLS: Only owners can read, authenticated users can create

### Security Tables

#### sessions
- User session management
- Refresh token storage
- RLS: Users can only access their own sessions

#### bank_connections
- Third-party banking integrations
- Connection status tracking
- RLS: Users can only access their own connections

## Admin Panel

### Role-Based Access Control

#### Super Admin (Owner)
- Full system access
- Feature flag management
- License override
- Configuration management
- User impersonation
- Infrastructure controls (backups, deletion)
- Audit log access

#### Manager
- Limited admin access
- View monitoring
- View audit logs (read-only)
- User management (limited)
- No configuration changes

#### User Roles
- User: Standard access to own financial data
- Family: Shared access features (premium tier)
- Readonly: View-only access

### Admin Features

#### Step-Up Authentication
- Required for sensitive operations
- 5-minute validity window
- Simulated with demo code: `246810`

#### User Impersonation
- Owner-only feature
- Full audit trail
- Requires step-up verification
- Cannot perform sensitive ops while impersonating

#### Feature Flags
- Enable/disable features system-wide
- Tied to license tiers
- Real-time updates

#### Configuration Management
- Encrypted secrets
- Masked sensitive values
- Requires step-up for editing

#### Monitoring
- Database health
- System metrics
- Queue backlogs
- Uptime tracking

#### Infrastructure Controls
- Manual/scheduled backups
- Restore with dry-run
- Deletion scheduling (with safeguards)

## Authentication Flow

### Sign Up
1. User provides email and password
2. Supabase Auth creates auth user
3. Trigger creates profile in `users` table
4. User is automatically signed in

### Sign In
1. User provides email and password
2. Supabase Auth validates credentials
3. Session is established
4. User profile is loaded from `users` table

### Sign Out
1. Supabase Auth clears session
2. Local state is reset

### Session Management
- Automatic token refresh
- Persistent sessions across tabs
- Real-time auth state updates

## Data Flow

### Reading Data
```
Component → Service → Supabase Client → RLS Check → Database
```

### Writing Data
```
Component → Service → Supabase Client → RLS Check → Database → Realtime Update
```

### Admin Operations
```
Admin Component → Admin Service → Audit Log → Supabase Client → RLS Check → Database
```

## Row Level Security (RLS)

All tables have RLS enabled with policies enforcing:

1. **User Data Isolation**: Users can only access their own data
2. **Role-Based Access**: Owners/managers have elevated permissions
3. **Audit Trail**: All admin actions are logged
4. **Read Protection**: Sensitive data requires proper role
5. **Write Protection**: Modifications require ownership or admin role

Example Policy:
```sql
CREATE POLICY "Users can read own accounts"
  ON accounts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
```

## Security Best Practices

### Authentication
- Email/password authentication via Supabase
- No custom password storage
- Automatic session management

### Authorization
- RLS enforces data access
- Role checks in application layer
- Step-up for sensitive operations

### Data Protection
- Encrypted config values
- Masked secrets in UI
- Audit logging for all changes

### API Security
- Supabase anon key is safe for client use
- RLS prevents unauthorized access
- Service role key never exposed to frontend

## Deployment

### Prerequisites
1. Supabase project (created at supabase.com)
2. Database migrations applied
3. Environment variables configured

### Build Process
```bash
npm install
npm run build
```

### Environment Configuration
1. Copy `.env.example` to `.env`
2. Update Supabase credentials
3. Configure feature flags and settings

### Hosting Options
- Vercel (recommended)
- Netlify
- Any static hosting with environment variable support

## Maintenance

### Adding New Features
1. Update database schema (migration)
2. Create service functions
3. Update RLS policies
4. Add UI components
5. Update admin panel if needed

### Configuration Updates
- Update via Admin Panel (owners only)
- Changes are audited
- Requires step-up for secrets

### Monitoring
- Use Admin Panel monitoring section
- Review audit logs regularly
- Check database health

## Migration Guide

### From Old Architecture
The previous architecture had:
- Separate API server (`/api`)
- Separate tenant server (`/server`)
- Custom JWT authentication
- Multiple configuration files

New architecture:
- Single Supabase backend
- Supabase Auth
- One configuration file (`app.config.ts`)
- All files in `/src`

Removed directories:
- `/api` - Replaced by Supabase
- `/server` - Replaced by Supabase

## Support

For issues or questions:
1. Check audit logs for admin operations
2. Review RLS policies for access issues
3. Verify environment configuration
4. Check Supabase dashboard for errors

## Future Enhancements

Potential additions:
- Supabase Edge Functions for webhooks
- Supabase Storage for document uploads
- Supabase Realtime for live updates
- Multi-tenancy with tenant isolation
- Advanced reporting with materialized views
