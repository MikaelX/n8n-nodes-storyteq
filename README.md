# n8n-nodes-storyteq

n8n community node for integrating with Storyteq API (Creative Automation).

[Repository](https://github.com/MikaelX/n8n-nodes-storyteq)

## Installation

### Option 1: Development Mode (Recommended for Local Development)

The easiest way to test and develop locally is using the built-in development server:

```bash
pnpm install
pnpm dev
```

This will:
- Build your node automatically
- Start n8n with your node loaded
- Watch for changes and rebuild automatically
- Open n8n in your browser at `http://localhost:5678`

The node will be available immediately and updates automatically when you make changes.

### Option 2: Install in Existing n8n Instance

This package works as a **standalone community package**, completely isolated from any n8n installation. It follows standard community node patterns.

#### Method A: Development Mode with External n8n

If you have n8n running separately:

```bash
# Build and link to your running n8n instance
pnpm build
pnpm dev --external-n8n
```

This links the node to `~/.n8n/custom/` (standard community node location) and watches for changes.

#### Method B: Install from Local Path

```bash
# Build the node first
pnpm build

# Install from local path (works with any n8n installation)
npm install /path/to/n8n-nodes-storyteq
# or
pnpm add /path/to/n8n-nodes-storyteq

# Restart n8n
```

#### Method C: Copy to Custom Nodes Directory (Standard Method)

```bash
# Build the node
pnpm build

# Copy to standard community node location
mkdir -p ~/.n8n/custom
cp -r dist ~/.n8n/custom/n8n-nodes-storyteq

# Restart n8n
```

**Note:** n8n automatically loads community nodes from `~/.n8n/custom/` - this is the standard installation location.

#### Method D: Install from npm (after publishing)

```bash
npm install n8n-nodes-storyteq
# Restart n8n
```

**Important:** This package is completely isolated and works with any n8n installation (monorepo, standalone, Docker, etc.) without requiring modifications to the n8n codebase.

### Option 3: Use External n8n Instance

If you have n8n running separately and want to develop against it:

```bash
pnpm dev --external-n8n
```

This will build and link your node without starting n8n (assumes n8n is already running).

## Usage

After installation, the Storyteq node will be available in your n8n instance. You can use it to interact with the Storyteq API for creative automation and media creation operations.

### Setting Up Credentials

1. Go to **Credentials** in n8n
2. Click **Add Credential**
3. Search for **"Storyteq API"**
4. Enter your:
   - **Bearer Token**: Your Storyteq API Bearer token
   - **Region**: Select your region (europe-west1 or us-east4)
5. Save the credential
6. Use it when configuring the Storyteq node

## Development

This project uses `@n8n/node-cli` for development, following the modern n8n node development approach.

### Prerequisites

- Node.js (v22 or higher)
- pnpm (or npm/yarn)

### Setup

```bash
pnpm install
```

### Development Mode (with hot reload)

```bash
pnpm dev
```

Starts n8n with your node loaded and automatically rebuilds on changes. Opens n8n in your browser (usually http://localhost:5678).

### Build

```bash
pnpm build
```

Compiles TypeScript to JavaScript for production.

### Build (Watch Mode)

```bash
pnpm build:watch
```

Builds in watch mode (auto-rebuilds on changes).

### Lint

```bash
pnpm lint
pnpm lint:fix
```

Check code for errors and auto-fix issues when possible.

### Type Check

```bash
pnpm typecheck
```

Type check without building.

### Release

```bash
pnpm release
```

Create a new release.

## Project Structure

```
n8n-nodes-storyteq/
├── src/
│   └── nodes/
│       └── Storyteq/
│           ├── Storyteq.node.ts      # Main node implementation
│           └── Storyteq.node.json    # Node metadata
├── dist/                                   # Compiled output
├── package.json
└── tsconfig.json
```

## Resources

- **Templates** - List and get templates
- **Media** - Create, list, and get media

## API Documentation

For detailed API documentation, refer to the [Storyteq API documentation](https://api.storyteq.com) and the OpenAPI spec included in this repository (`storyteq-api_v4_openapi.yaml`).

## Repository

- GitHub: [https://github.com/MikaelX/n8n-nodes-storyteq](https://github.com/MikaelX/n8n-nodes-storyteq)

## License

MIT License - see [LICENSE.md](LICENSE.md) for details.

