# n8n-nodes-storyteq

n8n community node for integrating with Storyteq Creative Automation Platform (CMP) API v2.

[![npm version](https://img.shields.io/npm/v/n8n-nodes-storyteq.svg)](https://www.npmjs.com/package/n8n-nodes-storyteq)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Repository](https://github.com/MikaelX/n8n-nodes-storyteq) | [npm Package](https://www.npmjs.com/package/n8n-nodes-storyteq)

## Overview

This node provides seamless integration between n8n workflows and Storyteq's Content Management Platform (CMP) API v2. It enables automated creative asset workflows, including asset management, metadata operations, and content distribution.

## Features

- **OAuth 2.0 Authentication**: Automatic token acquisition and refresh with support for password and refresh token grant types
- **14 CMP v2 Operations**: Comprehensive coverage of asset management operations
- **Lazy Loading**: Dynamic domain selection for improved user experience
- **Credential Validation**: Automatic credential testing on save
- **TypeScript**: Fully typed for better development experience

## Installation

### Install from npm (Recommended)

```bash
npm install n8n-nodes-storyteq
# or
pnpm add n8n-nodes-storyteq
```

Then restart your n8n instance.

### Development Mode

For local development and testing:

```bash
git clone https://github.com/MikaelX/n8n-nodes-storyteq.git
cd n8n-nodes-storyteq
pnpm install
pnpm dev
```

This will:
- Build the node automatically
- Start n8n with your node loaded
- Watch for changes and rebuild automatically
- Open n8n in your browser at `http://localhost:5678`

See [INSTALLATION.md](INSTALLATION.md) for more installation options.

## Setting Up Credentials

1. Go to **Credentials** in n8n
2. Click **Add Credential**
3. Search for **"Storyteq API"**
4. Enter your credentials:
   - **CMP Tenant URL**: Your Storyteq tenant URL (e.g., `https://your-tenant.storyteq.com`)
   - **Client ID**: Your OAuth 2.0 client ID
   - **Username**: Your Storyteq username
   - **Password**: Your Storyteq password
   - **Grant Type**: Choose "Password" or "Refresh Token"
   - **Refresh Token**: (Optional) Auto-populated when tokens are obtained
5. Click **Save** - credentials are automatically tested on save

**Note**: Tokens are automatically managed. The node handles token acquisition and refresh transparently.

## Available Operations

### Asset Management

- **Get Asset** - Retrieve asset details by ID
- **Get Asset Info** - Get extended asset metadata
- **List Assets** - List assets with filters, pagination, and sorting
- **Download Asset** - Get signed download URL for asset
- **Download Asset Preview** - Download asset thumbnail (Icon 512, 256, 128, or 64)
- **Get Asset Derivative Menu** - List available derivatives/transforms for an asset

### Asset Metadata

- **Get Asset Fields** - Retrieve custom field values for an asset
- **Set Asset Fields** - Update custom field values (JSON format)
- **Get Asset Taxonomy** - Get taxonomy information for an asset
- **List Asset Narratives** - List Description and Usage narratives
- **Set Asset Narrative** - Set Description or Usage narrative text
- **Edit Asset Keywords** - Add or remove keywords from assets
- **List Asset Availability** - List availability windows for an asset

### Domain Management

- **List User Domains** - List available domains for the authenticated user

## Usage Examples

### Example 1: List Assets in a Domain

1. Add a **Storyteq** node to your workflow
2. Select **List Assets** operation
3. Choose a **Domain ID** (dynamically loaded from your account)
4. Configure filters:
   - Phase: Active
   - Listing Style: Page
   - Listing Limit: 100
   - Search: (optional) text search on asset name
   - Available: true (only available assets)
5. Execute to get paginated results

### Example 2: Download Asset

1. Add a **Storyteq** node
2. Select **Download Asset** operation
3. Enter the **Asset ID**
4. Select **Download Type**: Link
5. Execute to get a signed download URL

### Example 3: Update Asset Metadata

1. Add a **Storyteq** node
2. Select **Set Asset Fields** operation
3. Enter the **Asset ID**
4. Provide **Fields (JSON)**:
   ```json
   {
     "fieldId1": "value1",
     "fieldId2": "value2"
   }
   ```
5. Execute to update the asset

### Example 4: Set Asset Narrative

1. Add a **Storyteq** node
2. Select **Set Asset Narrative** operation
3. Enter the **Asset ID**
4. Choose **Narrative Name**: Description or Usage
5. Enter the **Value** text
6. Execute to update the narrative

## API Documentation

For detailed API documentation, refer to the [Storyteq CMP API v2 documentation](https://developer.storyteq.com/?urls.primaryName=Content+Management+Platform+API+V2).

## Development

### Prerequisites

- Node.js (v20 or higher)
- pnpm (or npm/yarn)

### Setup

```bash
pnpm install
```

### Development Commands

```bash
# Development mode with hot reload
pnpm dev

# Build for production
pnpm build

# Build in watch mode
pnpm build:watch

# Lint code
pnpm lint
pnpm lint:fix

# Type check
pnpm typecheck
```

### Project Structure

```
n8n-nodes-storyteq/
├── src/
│   ├── credentials/
│   │   └── Storyteq.credentials.ts    # Credential definition
│   └── nodes/
│       └── Storyteq/
│           ├── Storyteq.node.ts         # Main node implementation
│           ├── GenericFunctions.ts     # Shared API functions
│           ├── actions/                # Operation implementations
│           └── storyteq.svg            # Node icon
├── dist/                                # Compiled output
├── package.json
└── tsconfig.json
```

## Troubleshooting

### Credential Issues

- Ensure your CMP Tenant URL is the full URL (e.g., `https://your-tenant.storyteq.com`)
- Verify your Client ID, Username, and Password are correct
- Check that your account has API access enabled
- See [DEBUG.md](DEBUG.md) for debugging credential issues

### Node Not Appearing

- Ensure the package is installed: `npm list n8n-nodes-storyteq`
- Check that n8n was restarted after installation
- Verify the build completed: `pnpm build`
- Check n8n logs for errors

### API Errors

- Verify your credentials are correct
- Check that the asset/domain IDs exist
- Ensure your account has permissions for the requested operations
- Review the API documentation for endpoint requirements

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE.md](LICENSE.md) for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/MikaelX/n8n-nodes-storyteq/issues)
- **Documentation**: [Storyteq API Documentation](https://developer.storyteq.com/?urls.primaryName=Content+Management+Platform+API+V2)
