# Testing Storyteq Node with Local n8n

## Quick Test

Run the test script to verify the node structure:
```bash
node test-node.js
```

## Testing with Local n8n

### Option 1: Development Mode (Recommended)

This starts n8n with your node loaded and watches for changes:

```bash
pnpm dev
```

This will:
- Build the node automatically
- Start n8n on `http://localhost:5678`
- Watch for changes and rebuild automatically
- Link the node to n8n's custom nodes directory

### Option 2: Link to Running n8n

If you already have n8n running:

```bash
# Build the node
pnpm build

# Link to n8n's custom nodes directory
mkdir -p ~/.n8n/custom
rm -rf ~/.n8n/custom/n8n-nodes-storyteq
ln -sfn $(pwd)/dist ~/.n8n/custom/n8n-nodes-storyteq

# Restart n8n or wait for auto-reload (if N8N_DEV_RELOAD=true)
```

### Option 3: Install as Package

```bash
# Build the node
pnpm build

# In your n8n installation directory
npm install /path/to/n8n-nodes-storyteq
# or
pnpm add /path/to/n8n-nodes-storyteq

# Restart n8n
```

## Verifying Installation

1. Open n8n in your browser (usually `http://localhost:5678`)
2. Create a new workflow
3. Click **Add Node**
4. Search for **"Storyteq"**
5. You should see the Storyteq node in the results
6. Add the node and verify:
   - Operations dropdown shows all 14 operations
   - Credential dropdown shows: Storyteq API

## Setting Up Credentials

1. In n8n, go to **Credentials** (gear icon)
2. Click **Add Credential**
3. Search for **"Storyteq API"**
4. Fill in:
   - **CMP Tenant URL**: Your tenant URL (e.g., `https://your-tenant.storyteq.com`)
   - **Client ID**: Your OAuth 2.0 client ID
   - **Username**: Your Storyteq username
   - **Password**: Your Storyteq password
   - **Grant Type**: Password (or Refresh Token if you have a refresh token)
5. Click **Save** - credentials are automatically tested
6. Use it when configuring the Storyteq node

## Testing Operations

### Test List User Domains

1. Add Storyteq node
2. Select **List User Domains** operation
3. Select your Storyteq API credential
4. Execute the node
5. Should return a list of domains with IDs and titles

### Test List Assets

1. Add Storyteq node
2. Select **List Assets** operation
3. Choose a **Domain ID** (dynamically loaded from your account)
4. Configure:
   - Phase: Active
   - Listing Style: Page
   - Listing Limit: 20
5. Select your Storyteq API credential
6. Execute the node
7. Should return paginated asset results

### Test Get Asset

1. Add Storyteq node
2. Select **Get Asset** operation
3. Enter an **Asset ID** (from List Assets or your known asset)
4. Select your Storyteq API credential
5. Execute the node
6. Should return asset details

### Test Get Asset Info

1. Add Storyteq node
2. Select **Get Asset Info** operation
3. Enter an **Asset ID**
4. Select your Storyteq API credential
5. Execute the node
6. Should return extended asset metadata

### Test Get Asset URL

1. Add Storyteq node
2. Select **Get Asset URL** operation
3. Enter an **Asset ID**
4. Select **Download Type**: Link
5. Select your Storyteq API credential
6. Execute the node
7. Should return a signed download URL

### Test Download Asset Preview

1. Add Storyteq node
2. Select **Download Asset Preview** operation
3. Enter an **Asset ID**
4. Choose a **Recipe**: Icon 512 (or other size)
5. Select your Storyteq API credential
6. Execute the node
7. Should return binary data (thumbnail image)

### Test Set Asset Fields

1. Add Storyteq node
2. Select **Set Asset Fields** operation
3. Enter an **Asset ID**
4. Provide **Fields (JSON)**:
   ```json
   {
     "fieldId1": "value1",
     "fieldId2": "value2"
   }
   ```
5. Select your Storyteq API credential
6. Execute the node
7. Should return success response

### Test Set Asset Narrative

1. Add Storyteq node
2. Select **Set Asset Narrative** operation
3. Enter an **Asset ID**
4. Choose **Narrative Name**: Description
5. Enter **Value**: "Test description"
6. Select your Storyteq API credential
7. Execute the node
8. Should return success response

### Test Edit Asset Keywords

1. Add Storyteq node
2. Select **Edit Asset Keywords** operation
3. Enter **Asset IDs**: "123,456" (comma-separated)
4. Enter **Keyword IDs**: "789,101" (comma-separated)
5. Choose **Operation**: Add (or Remove)
6. Select your Storyteq API credential
7. Execute the node
8. Should return success response

## Troubleshooting

### Node Not Appearing
- Check build: `pnpm build`
- Verify dist folder exists: `ls -la dist/nodes/Storyteq/`
- Check n8n logs for errors
- Restart n8n

### Credential Not Appearing
- Check credential file: `ls -la dist/credentials/Storyteq.credentials.js`
- Verify package.json includes credentials
- Restart n8n

### Build Errors
- Run typecheck: `pnpm typecheck`
- Run lint: `pnpm lint`
- Check for TypeScript errors

### Runtime Errors
- Check n8n console for error messages
- Verify credentials are correct
- Check CMP Tenant URL matches your account
- Verify asset/domain IDs exist
- Check API endpoint URLs in GenericFunctions.ts

### Authentication Errors
- Verify credentials are correct
- Check that token is being obtained (see DEBUG.md)
- Ensure account has API access enabled
- Try re-authenticating

### Operation-Specific Errors
- Verify required parameters are provided
- Check that asset/domain IDs exist
- Ensure your account has permissions for the operation
- Review API documentation for endpoint requirements
