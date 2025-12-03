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
   - Operations dropdown shows: List Templates, Get Template, Create Media, List Media, Get Media
   - Credential dropdown shows: Storyteq API

## Setting Up Credentials

1. In n8n, go to **Credentials** (gear icon)
2. Click **Add Credential**
3. Search for **"Storyteq API"**
4. Fill in:
   - **Bearer Token**: Your Storyteq API Bearer token
   - **Region**: Select your region (europe-west1 or us-east4)
5. Click **Save**
6. Use it when configuring the Storyteq node

## Testing Operations

### Test List Templates
1. Add Storyteq node
2. Select **List Templates** operation
3. Select your Storyteq API credential
4. Execute the node
5. Should return a list of templates

### Test Get Template
1. Add Storyteq node
2. Select **Get Template** operation
3. Enter a Template ID
4. Select your Storyteq API credential
5. Execute the node
6. Should return template details with parameters

### Test Create Media
1. Add Storyteq node
2. Select **Create Media** operation
3. Enter Template ID
4. Enter Template Parameters as JSON (e.g., `{"text": "Hello"}`)
5. Select your Storyteq API credential
6. Execute the node
7. Should return media creation response with status

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
- Verify Bearer token is correct
- Verify region matches your Storyteq instance
- Check API endpoint URLs in GenericFunctions.ts

