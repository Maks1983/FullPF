# OwnCent Violation Remediation Plan

## Critical Issues Identified

### 1. Third-Party Service Dependencies (MUST FIX)

#### Active Supabase Dependencies:
- `src/lib/supabase.ts` - Supabase client configuration
- `src/services/authService.ts` - Uses Supabase Auth
- `src/services/adminService.ts` - Uses Supabase client
- `src/services/financialService.ts` - Uses Supabase client
- `src/context/AuthContext.tsx` - Imports from Supabase services
- `supabase/` directory - Entire Supabase infrastructure

### 2. Naming Convention Violations (MUST FIX)

#### Files with "Supabase" References:
- File names containing "supabase"
- Code comments referencing Supabase
- Import statements from Supabase
- Configuration variables with Supabase naming

## Remediation Actions Required

### IMMEDIATE (Critical Priority)

1. **Remove Supabase Directory**
   - Delete `supabase/` directory entirely
   - Remove all Supabase Edge Functions
   - Remove Supabase migrations

2. **Replace Database Client**
   - Replace `src/lib/supabase.ts` with MariaDB client
   - Update all service imports
   - Remove Supabase configuration

3. **Update Service Layer**
   - Rewrite `src/services/authService.ts` for MariaDB
   - Rewrite `src/services/adminService.ts` for MariaDB
   - Rewrite `src/services/financialService.ts` for MariaDB

4. **Fix Naming Violations**
   - Replace "Supabase" with "Middleware" in all comments
   - Update variable names
   - Update function names

### SHORT-TERM (High Priority)

1. **Implement MariaDB Integration**
   - Deploy MariaDB schema
   - Configure database connections
   - Test database operations

2. **Deploy Express.js API Server**
   - Start Express.js server
   - Configure API endpoints
   - Test API functionality

3. **Update Frontend Configuration**
   - Remove Supabase environment variables
   - Add MariaDB configuration
   - Update API endpoints

### MEDIUM-TERM (Medium Priority)

1. **Complete Testing**
   - Test all authentication flows
   - Test all data operations
   - Test admin panel functionality

2. **Performance Optimization**
   - Optimize database queries
   - Implement caching
   - Monitor performance

3. **Security Hardening**
   - Implement proper session management
   - Add CSRF protection
   - Enable HTTPS

## Success Criteria

### Compliance Validation:
- [ ] No references to "Supabase" anywhere in codebase
- [ ] No third-party service dependencies
- [ ] All services use MariaDB database
- [ ] All naming uses "Middleware" terminology
- [ ] Authentication is self-hosted
- [ ] API is self-hosted

### Functional Validation:
- [ ] All features work with MariaDB
- [ ] Authentication system functional
- [ ] Admin panel operational
- [ ] All pages load correctly
- [ ] Data operations successful

## Timeline

**Total Duration**: 2-3 weeks
- Week 1: Remove violations and implement MariaDB
- Week 2: Deploy API server and test integration
- Week 3: Final testing and optimization

## Risk Mitigation

1. **Backup Current State**: Create full backup before changes
2. **Incremental Migration**: Migrate one service at a time
3. **Parallel Testing**: Test new implementation alongside current
4. **Rollback Plan**: Maintain ability to rollback changes
5. **Documentation**: Document all changes made