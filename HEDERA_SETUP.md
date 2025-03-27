# Stakemate Hedera Integration Setup

This guide covers how to configure Stakemate to work with the Hedera network, either through direct API access or via the Eliza API service.

## Prerequisites

1. Node.js (v14+) and npm installed
2. A Hedera testnet or mainnet account (for direct integration)
3. Eliza API access (for simplified integration)

## Configuration Options

Stakemate supports two integration methods with Hedera:

1. **Direct Integration**: Connect directly to Hedera networks using credentials stored in environment variables. This provides more control but requires managing your own Hedera account and private keys.

2. **Eliza Integration**: Use the Eliza API service as a proxy to Hedera. This simplifies integration by letting Eliza handle the token management and transaction signing.

You can use either or both integrations simultaneously.

## Environment Variables

Create or update a `.env` file in the root of your project with the following variables:

### For Direct Hedera Integration

```
# Hedera Network Configuration (direct)
HEDERA_NETWORK=testnet       # Options: testnet, mainnet, previewnet
HEDERA_ACCOUNT_ID=0.0.12345  # Your Hedera account ID
HEDERA_PRIVATE_KEY=302e0208...  # Your Hedera private key
```

### For Eliza API Integration

```
# Eliza API Configuration
ELIZA_API_URL=https://api.eliza.example.com/v1
ELIZA_API_KEY=your_api_key_here
```

## Testing Your Configuration

Once configured, you can test the integration using the health check endpoint:

```
GET /api/health
```

The response will indicate whether both integration methods are properly configured:

```json
{
  "status": "ok",
  "timestamp": "2023-08-01T12:34:56.789Z",
  "elizaStatus": "configured",  // or "not configured"
  "hederaClientStatus": "configured"  // or "not configured"
}
```

## Available API Endpoints

### Direct Hedera Endpoints

The direct Hedera integration provides these endpoints:

- **GET /api/direct-hedera/status**: Check direct Hedera client status
- **GET /api/direct-hedera/account/:accountId/balance**: Get account HBAR balance
- **GET /api/direct-hedera/account/:accountId/info**: Get detailed account information
- **GET /api/direct-hedera/token/:tokenId/info**: Get token information
- **GET /api/direct-hedera/account/:accountId/token/:tokenId/balance**: Get token balance for a specific account
- **POST /api/direct-hedera/token/associate**: Associate a token with an account
- **POST /api/direct-hedera/hbar/transfer**: Transfer HBAR to another account
- **POST /api/direct-hedera/token/transfer**: Transfer tokens to another account

### Eliza Hedera Integration Endpoints

The Eliza integration provides these endpoints:

- **GET /api/hedera/balance/:accountId**: Get HBAR balance for a specified account
- **GET /api/hedera/tokens/:tokenId/balance/:accountId**: Get token balance for a specific account
- **GET /api/hedera/tokens/:accountId**: Get all token balances for an account
- **GET /api/hedera/tokens/:tokenId/holders**: Get all holders of a specific token
- **POST /api/hedera/tokens**: Create a new fungible token
- **POST /api/hedera/tokens/transfer**: Transfer tokens from Eliza's account to another account

### Token Service Endpoints

The token service layer provides unified access to both integration methods:

- **POST /api/tokens/projects/:projectId**: Create a new token for a project
- **GET /api/tokens/:tokenId/info**: Get token information
- **GET /api/tokens/:tokenId/holders**: Get token holders
- **GET /api/tokens/projects/:projectId/distribution**: Create a token distribution plan
- **GET /api/tokens/projects/:projectId/valuation**: Simulate token valuation
- **GET /api/tokens/projects/:projectId/metrics**: Calculate token metrics
- **POST /api/tokens/associate**: Associate a token with a user's account
- **POST /api/tokens/users/:userId/projects/:projectId/invest**: Process a simulated investment
- **POST /api/tokens/transfer**: Transfer tokens to an investor

## Example: Creating a New Token

To create a token for an infrastructure project:

```
POST /api/tokens/projects/:projectId
```

This will:
1. Retrieve project information 
2. Create a token with the project name and symbol
3. Update the project record with the token ID
4. Return the token creation details

## Example: Simulating an Investment

To simulate an investment for a user:

```
POST /api/tokens/users/:userId/projects/:projectId/invest
{
  "amount": 1000
}
```

This will generate a detailed simulation including:
- Token amount received
- Projected returns 
- Maturity information

## Error Handling

All endpoints follow a consistent error handling pattern:

- HTTP 400: Client errors (invalid input)
- HTTP 404: Resource not found
- HTTP 500: Server errors

Responses follow this format:

```json
{
  "success": false,
  "error": "Error message details"
}
```

## Security Considerations

When using direct Hedera integration:

1. Store private keys securely - never in code or public repositories
2. Use environment variables for sensitive configuration
3. Consider using a key management service for production deployments
4. Implement proper input validation (already in place in controllers)
5. Limit access to token transfer endpoints with appropriate authentication

## Need Help?

If you encounter issues with the Hedera integration:

1. Check the server logs for detailed error messages
2. Verify your environment variables are properly set
3. For Eliza API issues, check that the service is accessible
4. For direct integration, confirm your Hedera account is active and funded 