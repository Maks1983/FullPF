# Auth Service Multi-Tenancy & Bank Integration

The authentication service now runs as a multi-tenant in-memory authority with per-tenant isolation and support for simulated bank connections.

## Tenants

Two tenants are seeded by default:

| Tenant ID        | Description         | Notes |
| ---------------- | ------------------- | ----- |
| demo-instance  | Original demo data  | No bank connections seeded |
| urora-family  | Premium family plan | Includes an active DNB bank connection |

Every request that reaches the service must include the X-Tenant-ID header with one of the tenant identifiers above (or any additional tenant you seed later). Tokens issued by the service now embed the customerId claim based on that header and all follow-up requests are validated against it.

The front-end piClient automatically sends the header using VITE_TENANT_ID (defaults to demo-instance). Set the variable in .env when you need to work against another tenant:

`ash
VITE_TENANT_ID=aurora-family
`

## New REST Endpoints

All routes require authentication and honor multi-tenant scoping:

- GET /bank/connections[?includeTokens=true]
- POST /bank/connections – create a connection (owner/manager)
- POST /bank/connections/:id/token – issue a short-lived access token
- POST /bank/connections/:id/sync – update sync status metadata
- POST /bank/connections/:id/revoke – revoke a connection and cascade token revocation (owner)
- GET /bank/connections/:id/tokens
- POST /bank/tokens/:id/revoke

Audit events are emitted on all mutating routes so the admin panel surfaces bank activity alongside auth events.

## Front-End Hooks

src/lib/apiClient.ts now exports a ankApi helper with the same operations. Components can opt into the new functionality without reimplementing header logic or token refresh.

## Server Build/Test

- 
pm run build in /server verifies multi-tenant TypeScript builds
- 
pm run build in the project root validates the front-end client adjustments
