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
  - `Content-Type`: `application/json`
  - `Accept`: `application/json`
- **Body** (JSON):
  ```json
  {
    "client_id": "your-client-id",
    "username": "your-username",
    "password": "your-password",
    "grant_type": "password"
  }
  ```

**Note**: Despite some API documentation showing `application/x-www-form-urlencoded`, the CMP v2 API actually expects JSON format.

## Common Issues

1. **Invalid CMP-Tenant**: Make sure it's the full URL (e.g., `https://your-tenant.storyteq.com`)
2. **Wrong Content-Type**: Must be `application/json`, not `application/x-www-form-urlencoded`
3. **Missing grant_type**: Must be included in the body
4. **Invalid credentials**: Verify your Client ID, Username, and Password are correct
5. **403 Forbidden**: Check that your account has API access enabled

## Checking n8n Credential Test

When testing credentials in n8n, check:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to save credentials
4. Look for the request to `/cmp/v2/token`
5. Check:
   - Request headers (especially `CMP-Tenant`)
   - Request body format (should be JSON)
   - Response status and body

## Testing with cURL

```bash
curl --location 'https://enterprise.api.storyteq.com/cmp/v2/token' \
  --header 'CMP-Tenant: https://your-tenant.storyteq.com' \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --data '{
    "client_id": "your-client-id",
    "username": "your-username",
    "password": "your-password",
    "grant_type": "password"
  }'
```

## Expected Response

A successful response should look like:

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

## Troubleshooting Authentication Errors

### 401 Unauthorized
- Check that your username and password are correct
- Verify your account is active
- Ensure API access is enabled for your account

### 403 Forbidden
- Verify your Client ID is correct
- Check that your account has permissions to use the API
- Ensure the CMP Tenant URL matches your account's tenant

### 400 Bad Request
- Verify the request body is valid JSON
- Check that all required fields are present (client_id, username, password, grant_type)
- Ensure Content-Type header is set to `application/json`

## Automatic Token Refresh

The node automatically handles token refresh when using refresh tokens. If you're experiencing issues:

1. Check that the refresh token is being stored correctly
2. Verify the refresh token hasn't expired
3. Check n8n logs for token refresh errors
4. Try re-authenticating with password grant type
