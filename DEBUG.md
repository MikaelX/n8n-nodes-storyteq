# Debugging Storyteq Credentials

## Manual Token Test

Use the debug script to test the token endpoint directly:

```bash
node debug-token.js <cmpTenant> <clientId> <username> <password>
```

Or set environment variables:

```bash
export CMP_TENANT="https://your-tenant.storyteq.com"
export CLIENT_ID="your-client-id"
export USERNAME="your-username"
export PASSWORD="your-password"

node debug-token.js
```

## Expected Request Format

The token endpoint expects:

- **URL**: `https://enterprise.api.storyteq.com/cmp/v2/token`
- **Method**: POST
- **Headers**:
  - `CMP-Tenant`: Your tenant URL (e.g., `https://your-tenant.storyteq.com`)
  - `Content-Type`: `application/x-www-form-urlencoded`
  - `Accept`: `application/json`
- **Body** (form-urlencoded):
  ```
  client_id=xxx&username=xxx&password=xxx&grant_type=password
  ```

## Common Issues

1. **Invalid CMP-Tenant**: Make sure it's the full URL (e.g., `https://your-tenant.storyteq.com`)
2. **Wrong Content-Type**: Must be `application/x-www-form-urlencoded`, not `application/json`
3. **Missing grant_type**: Must be included in the body
4. **URL encoding**: Special characters in username/password should be URL-encoded

## Checking n8n Credential Test

When testing credentials in n8n, check:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to save credentials
4. Look for the request to `/cmp/v2/token`
5. Check:
   - Request headers (especially `CMP-Tenant`)
   - Request body format
   - Response status and body

## Testing with cURL

```bash
curl --location 'https://enterprise.api.storyteq.com/cmp/v2/token' \
  --header 'CMP-Tenant: https://your-tenant.storyteq.com' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --header 'Accept: application/json' \
  --data-urlencode "client_id=your-client-id" \
  --data-urlencode "username=your-username" \
  --data-urlencode "password=your-password" \
  --data-urlencode "grant_type=password"
```

