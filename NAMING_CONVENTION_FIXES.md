# Naming Convention Fixes Required

## Overview

This document lists all naming convention violations found in the OwnCent project and provides specific fixes to comply with the requirement to avoid third-party service references.

## Violations Found

### 1. File Names

#### Files to Rename:
```
CURRENT → REQUIRED
src/lib/supabase.ts → src/lib/database.ts
supabase/ → middleware/
```

### 2. Directory Structure

#### Directories to Rename:
```
CURRENT → REQUIRED
supabase/functions/ → middleware/functions/
supabase/migrations/ → middleware/migrations/
```

### 3. Code References

#### Import Statements:
```typescript
// CURRENT (Violation)
import { supabase } from '../lib/supabase';
import { createClient } from '@supabase/supabase-js';

// REQUIRED (Compliant)
import { database } from '../lib/database';
import { createClient } from '../lib/database';
```

#### Variable Names:
```typescript
// CURRENT (Violation)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// REQUIRED (Compliant)
const databaseUrl = process.env.VITE_DATABASE_URL;
const databaseKey = process.env.VITE_DATABASE_KEY;
```

#### Function Names:
```typescript
// CURRENT (Violation)
export const supabase = createClient(url, key);

// REQUIRED (Compliant)
export const database = createClient(url, key);
```

### 4. Comments and Documentation

#### Comment Updates:
```typescript
// CURRENT (Violation)
// Use Supabase for databases by default
// Supabase project setup and configuration
// The environment variables for Supabase connection

// REQUIRED (Compliant)
// Use middleware for databases by default
// Database project setup and configuration
// The environment variables for database connection
```

#### Documentation Updates:
```markdown
<!-- CURRENT (Violation) -->
## Supabase Integration
Connect to Supabase for data storage

<!-- REQUIRED (Compliant) -->
## Database Integration
Connect to middleware for data storage
```

### 5. Environment Variables

#### Variable Names:
```bash
# CURRENT (Violation)
VITE_SUPABASE_URL=https://project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# REQUIRED (Compliant)
VITE_DATABASE_URL=http://localhost:4000/api/v1
VITE_DATABASE_KEY=your-api-key
```

### 6. Configuration Files

#### Config Object Properties:
```typescript
// CURRENT (Violation)
export const config = {
  supabase: {
    url: string;
    anonKey: string;
  }
};

// REQUIRED (Compliant)
export const config = {
  database: {
    url: string;
    apiKey: string;
  }
};
```

## Specific File Fixes Required

### src/lib/supabase.ts → src/lib/database.ts

**Current Content (Violation)**:
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

**Required Content (Compliant)**:
```typescript
import { createClient } from '../middleware/database-client';

export const database = createClient(
  import.meta.env.VITE_DATABASE_URL,
  import.meta.env.VITE_DATABASE_KEY
);
```

### src/services/authService.ts

**Current Content (Violation)**:
```typescript
import { supabase } from '../lib/supabase';

export const authService = {
  async signIn(data: SignInData): Promise<AuthUser> {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    // ...
  }
};
```

**Required Content (Compliant)**:
```typescript
import { database } from '../lib/database';

export const authService = {
  async signIn(data: SignInData): Promise<AuthUser> {
    const { data: authData, error } = await database.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    // ...
  }
};
```

### src/context/AuthContext.tsx

**Current Content (Violation)**:
```typescript
import { authApi, initializeTokensFromStorage } from '../lib/apiClient';
// References to Supabase in comments
```

**Required Content (Compliant)**:
```typescript
import { authApi, initializeTokensFromStorage } from '../lib/apiClient';
// References to middleware in comments
```

## Environment Variable Migration

### Current .env (Violations):
```bash
VITE_SUPABASE_URL=https://project.supabase.co
VITE_SUPABASE_ANON_KEY=supabase-anon-key
```

### Required .env (Compliant):
```bash
VITE_DATABASE_URL=http://localhost:4000/api/v1
VITE_DATABASE_KEY=database-api-key
```

## Configuration File Updates

### src/config/app.config.ts

**Current Content (Violation)**:
```typescript
export interface AppConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
}

export const appConfig: AppConfig = {
  supabase: {
    url: getEnvVar('VITE_SUPABASE_URL'),
    anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY'),
  },
};
```

**Required Content (Compliant)**:
```typescript
export interface AppConfig {
  database: {
    url: string;
    apiKey: string;
  };
}

export const appConfig: AppConfig = {
  database: {
    url: getEnvVar('VITE_DATABASE_URL'),
    apiKey: getEnvVar('VITE_DATABASE_KEY'),
  },
};
```

## Implementation Steps

### Step 1: File Renames
```bash
# Rename main database file
mv src/lib/supabase.ts src/lib/database.ts

# Remove Supabase directory
rm -rf supabase/
```

### Step 2: Update Imports
Search and replace across all files:
```bash
# Find all Supabase imports
grep -r "from.*supabase" src/

# Replace with database imports
sed -i 's/from.*supabase/from.*database/g' src/**/*.ts src/**/*.tsx
```

### Step 3: Update Variable Names
```bash
# Find all supabase variable references
grep -r "supabase\." src/

# Replace with database references
sed -i 's/supabase\./database\./g' src/**/*.ts src/**/*.tsx
```

### Step 4: Update Comments
```bash
# Find all Supabase comments
grep -r "Supabase" src/

# Replace with Middleware
sed -i 's/Supabase/Middleware/g' src/**/*.ts src/**/*.tsx
```

### Step 5: Update Environment Variables
```bash
# Update .env file
sed -i 's/VITE_SUPABASE_/VITE_DATABASE_/g' .env
sed -i 's/SUPABASE_/DATABASE_/g' .env
```

## Validation

### Automated Validation Script

```bash
#!/bin/bash
# validate-naming.sh

echo "Checking for naming violations..."

# Check for Supabase references
SUPABASE_REFS=$(grep -r "Supabase\|supabase" src/ --exclude-dir=node_modules || true)
if [ -n "$SUPABASE_REFS" ]; then
    echo "❌ Found Supabase references:"
    echo "$SUPABASE_REFS"
    exit 1
fi

# Check for third-party service imports
THIRD_PARTY_IMPORTS=$(grep -r "@supabase\|@firebase\|@aws" src/ --exclude-dir=node_modules || true)
if [ -n "$THIRD_PARTY_IMPORTS" ]; then
    echo "❌ Found third-party service imports:"
    echo "$THIRD_PARTY_IMPORTS"
    exit 1
fi

echo "✅ No naming violations found"
```

### Manual Validation Checklist

- [ ] No files contain "supabase" in name
- [ ] No directories contain "supabase" in name
- [ ] No imports from "@supabase/*" packages
- [ ] No variable names containing "supabase"
- [ ] No comments referencing "Supabase"
- [ ] No environment variables with "SUPABASE" prefix
- [ ] All references use "Middleware" or "Database"

## Post-Migration Testing

### Functional Testing
1. **Authentication**: Login, logout, token refresh
2. **Data Operations**: CRUD operations on all entities
3. **Admin Panel**: All admin functions working
4. **Charts**: All visualizations rendering
5. **Premium Features**: Debt optimizer, strategy simulator

### Performance Testing
1. **Page Load Times**: All pages load within 2 seconds
2. **API Response Times**: All API calls respond within 500ms
3. **Database Queries**: All queries execute within 100ms
4. **Memory Usage**: No memory leaks detected

### Security Testing
1. **Authentication**: Proper token validation
2. **Authorization**: Role-based access working
3. **Input Validation**: All inputs properly validated
4. **Rate Limiting**: Tier-based limits enforced

## Success Criteria

### Compliance Validation:
✅ **No third-party service dependencies**
✅ **No naming convention violations**
✅ **All services use MariaDB**
✅ **All references use neutral terminology**

### Functional Validation:
✅ **All features work with new architecture**
✅ **Authentication system functional**
✅ **Admin panel operational**
✅ **Data operations successful**

## Timeline

**Total Duration**: 1-2 weeks
- Days 1-3: Remove violations and update naming
- Days 4-7: Implement MariaDB integration
- Days 8-10: Test and validate
- Days 11-14: Production deployment and monitoring

## Risk Mitigation

1. **Backup**: Create full backup before starting
2. **Incremental**: Make changes incrementally
3. **Testing**: Test each change thoroughly
4. **Rollback**: Maintain rollback capability
5. **Documentation**: Document all changes made