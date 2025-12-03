# Installation Guide for n8n-nodes-storyteq

This guide covers different ways to install the Storyteq node in your n8n instance.

## Prerequisites

- Node.js (v22 or higher recommended)
- pnpm (or npm/yarn)
- n8n instance (local or remote)

## Installation Methods

### Method 1: Development Mode (Best for Development)

This is the recommended approach when developing or testing the node locally.

```bash
# Clone or navigate to the project directory
cd n8n-nodes-storyteq

# Install dependencies
pnpm install

# Start development server (includes n8n)
pnpm dev
```

**What this does:**
- Builds the node automatically
- Starts n8n on `http://localhost:5678`
- Watches for file changes and rebuilds automatically
- Links the node to n8n's custom nodes directory (`~/.n8n-node-cli/.n8n/custom`)

**Advantages:**
- Hot reload - changes appear immediately
- No need to restart n8n
- Isolated environment for testing
- Perfect for development

### Method 2: Install in Existing n8n Instance

If you already have n8n running and want to add this node:

#### Step 1: Build the Node

```bash
cd n8n-nodes-storyteq
pnpm build
```

This creates the `dist/` folder with compiled files.

#### Step 2: Install in n8n

**Option A: Install from Local Path**

```bash
# Navigate to your n8n installation directory
cd /path/to/your/n8n-installation

# Install the local package
npm install /absolute/path/to/n8n-nodes-storyteq
# or with pnpm
pnpm add /absolute/path/to/n8n-nodes-storyteq
```

**Option B: Use pnpm/npm link (Symlink)**

```bash
# In the node package directory
cd n8n-nodes-storyteq
pnpm link

# In your n8n installation directory
cd /path/to/your/n8n-installation
pnpm link n8n-nodes-storyteq
```

**Option C: Copy to Custom Nodes Directory**

```bash
# Build the node
cd n8n-nodes-storyteq
pnpm build

# Copy to n8n custom nodes directory
# Default location: ~/.n8n/custom
cp -r dist ~/.n8n/custom/n8n-nodes-storyteq

# Or if using Docker, copy to the custom nodes volume
```

#### Step 3: Restart n8n

After installation, restart your n8n instance:

```bash
# If running via npm/pnpm
# Stop and restart your n8n process

# If running via Docker
docker restart n8n-container-name

# If running via systemd
sudo systemctl restart n8n
```

### Method 3: Use External n8n (Development)

If you have n8n running separately and want to develop against it:

```bash
cd n8n-nodes-storyteq
pnpm dev --external-n8n
```

This will:
- Build your node
- Link it to n8n's custom nodes directory
- Watch for changes and rebuild
- **NOT** start n8n (assumes it's already running)

### Method 4: Install from npm (After Publishing)

Once published to npm:

```bash
# In your n8n installation directory
npm install n8n-nodes-storyteq
# or
pnpm add n8n-nodes-storyteq

# Restart n8n
```

## Verifying Installation

After installation, verify the node is available:

1. Open n8n in your browser
2. Create a new workflow
3. Click **Add Node**
4. Search for **"Storyteq"**
5. You should see the node in the results

## Setting Up Credentials

1. In n8n, go to **Credentials** (gear icon)
2. Click **Add Credential**
3. Search for **"Storyteq API"**
4. Fill in:
   - **Bearer Token**: Your Storyteq API Bearer token
   - **Region**: Select your region (europe-west1 or us-east4)
5. Click **Save**
6. The credential is now available for use in workflows

## Troubleshooting

### Node Not Appearing

1. **Check build output:**
   ```bash
   cd n8n-nodes-storyteq
   pnpm build
   ls -la dist/nodes/Storyteq/
   ```

2. **Check n8n custom nodes directory:**
   ```bash
   ls -la ~/.n8n/custom/
   ```

3. **Check n8n logs** for errors:
   ```bash
   # If running via npm/pnpm, check console output
   # If running via Docker:
   docker logs n8n-container-name
   ```

4. **Clear n8n cache:**
   ```bash
   rm -rf ~/.n8n/custom
   # Then reinstall
   ```

### Credential Not Appearing

1. Ensure the credential file was built:
   ```bash
   ls -la dist/credentials/Storyteq.credentials.js
   ```

2. Check `package.json` includes credentials:
   ```json
   "n8n": {
     "credentials": [
       "dist/credentials/Storyteq.credentials.js"
     ]
   }
   ```

3. Restart n8n after installing

### Build Errors

1. **TypeScript errors:**
   ```bash
   pnpm typecheck
   ```

2. **Linting errors:**
   ```bash
   pnpm lint
   pnpm lint:fix
   ```

3. **Missing dependencies:**
   ```bash
   pnpm install
   ```

## Docker Installation

If running n8n via Docker:

```bash
# Build the node
cd n8n-nodes-storyteq
pnpm build

# Copy to Docker volume or mount point
docker cp dist/. n8n-container:/home/node/.n8n/custom/n8n-nodes-storyteq/

# Or use a volume mount in docker-compose.yml:
volumes:
  - ./n8n-nodes-storyteq/dist:/home/node/.n8n/custom/n8n-nodes-storyteq

# Restart container
docker restart n8n-container
```

## Development Workflow

For active development:

1. **Terminal 1:** Run `pnpm dev` (starts n8n with hot reload)
2. **Terminal 2:** Make code changes
3. Changes automatically rebuild and appear in n8n
4. Test in n8n UI at `http://localhost:5678`

## Production Deployment

For production:

1. Build the node: `pnpm build`
2. Install in production n8n instance
3. Restart n8n
4. Create credentials in production environment
5. Test workflows

