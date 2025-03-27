# StakeMate Project Setup Guide

This guide provides detailed instructions for setting up the StakeMate project, including both the backend and frontend components, with special attention to Hedera and Eliza integration.

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn package manager
- Git
- A Hedera testnet account (for development)

## Project Structure

The StakeMate project consists of two main components:

1. **Backend**: Node.js/Express server with Hedera integration
2. **Frontend**: React application with Tailwind CSS

## Backend Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/okwareddevnest/stakemate-hedera.git
cd stakemate-hedera
```

### Step 2: Install Backend Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server configuration
PORT=3000
NODE_ENV=development

# Hedera configuration
HEDERA_ACCOUNT_ID=your-account-id
HEDERA_PRIVATE_KEY=your-private-key
HEDERA_NETWORK=testnet
HEDERA_KEY_TYPE=ED25519  # or ECDSA

# Optional: Eliza configuration (if using Eliza)
ELIZA_API_URL=http://localhost:3001
```

### Step 4: Start the Backend Server

For development:

```bash
npm run dev
```

For production:

```bash
npm run build
npm start
```

## Frontend Setup

### Step 1: Navigate to the Client Directory

```bash
cd client
```

### Step 2: Install Frontend Dependencies

```bash
npm install
```

### Step 3: Configure Frontend Environment Variables

Create a `.env` file in the client directory:

```
VITE_API_URL=http://localhost:3000/api
```

### Step 4: Start the Frontend Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Eliza Integration

StakeMate can leverage the Eliza agent from the Hedera AI Agent Workshop for enhanced blockchain interactions.

### Step 1: Set Up the Hedera AI Agent Workshop

Clone the workshop repository (if you haven't already):

```bash
git clone https://github.com/hedera-dev/hedera-ai-agent-workshop.git
cd hedera-ai-agent-workshop
```

### Step 2: Install Workshop Dependencies

```bash
npm install
```

### Step 3: Set Up Eliza Plugin

```bash
cd hedera-plugin-eliza
npm install
```

### Step 4: Configure Eliza Environment Variables

Create a `.env` file in the hedera-plugin-eliza directory:

```
HEDERA_PRIVATE_KEY=your-private-key
HEDERA_ACCOUNT_ID=your-account-id
HEDERA_NETWORK_TYPE=testnet
HEDERA_KEY_TYPE=ED25519  # or ECDSA
```

### Step 5: Start Eliza with Universal Helper Character

```bash
pnpm run dev --characters='../characters/universalHelper.character.json'
```

### Step 6: Verify Eliza is Running

Eliza should now be running on http://localhost:3001 (or another port if configured differently).

## Connecting StakeMate to Eliza

With both StakeMate and Eliza running, they can communicate for Hedera interactions. The StakeMate backend includes an Eliza service client configured to interact with the Eliza API.

### Eliza Service Client

The Eliza service client in StakeMate is located at `src/services/elizaService.js`. This service handles communication with Eliza through its API, allowing StakeMate to leverage Eliza's capabilities for Hedera blockchain interactions.

### Using Eliza in StakeMate Backend

Example usage of Eliza service:

```javascript
// In a StakeMate backend controller
const elizaService = require('../services/elizaService');

// In a controller method
async function getTokenInfo(req, res) {
  try {
    const { tokenId, accountId } = req.params;
    const result = await elizaService.getTokenBalance(accountId, tokenId);
    
    // Process and format the response from Eliza
    res.json({ 
      success: true, 
      data: result 
    });
  } catch (error) {
    console.error('Error fetching token info:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch token information',
      error: error.message
    });
  }
}
```

## Direct Hedera Integration

For operations that don't require Eliza, StakeMate includes direct integration with the Hedera JavaScript SDK.

### Hedera Client

The Hedera client in StakeMate is located at `src/hedera/HederaAgentKit.js`. This module provides direct access to Hedera network operations without going through Eliza.

Example usage:

```javascript
const HederaAgentKit = require('../hedera/HederaAgentKit');

// Initialize the client
const hederaClient = new HederaAgentKit();

// Use the client in a service or controller
async function createToken(req, res) {
  try {
    const { name, symbol, initialSupply, decimals } = req.body;
    
    const tokenId = await hederaClient.createToken({
      name,
      symbol,
      initialSupply,
      decimals
    });
    
    res.json({ 
      success: true, 
      tokenId 
    });
  } catch (error) {
    console.error('Error creating token:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create token',
      error: error.message
    });
  }
}
```

## Running the Complete StakeMate Application

To run the complete StakeMate application with Hedera and Eliza integration:

1. **Start Eliza** (in the hedera-plugin-eliza directory):
   ```bash
   pnpm run dev --characters='../characters/universalHelper.character.json'
   ```

2. **Start the StakeMate backend** (in the stakemate-hedera root directory):
   ```bash
   npm run dev
   ```

3. **Start the StakeMate frontend** (in the stakemate-hedera/client directory):
   ```bash
   npm run dev
   ```

## Testing the Setup

Once all components are running, you can test the setup:

1. Visit the frontend at `http://localhost:5173`
2. Navigate to the Dashboard or Projects page
3. The backend should be serving API requests and communicating with Hedera (either directly or through Eliza)

### Example API Endpoints to Test

- `GET http://localhost:3000/api/health` - Check if the backend is running
- `GET http://localhost:3000/api/projects` - Get all infrastructure projects
- `GET http://localhost:3000/api/hedera/balance/{accountId}` - Check HBAR balance (requires Eliza)

## Troubleshooting

### Common Issues and Solutions

#### Backend API Not Responding

- Check if the backend server is running (`npm run dev` in the project root)
- Verify the correct port configuration in the `.env` file
- Check the terminal for any error messages

#### Eliza Connection Issues

- Ensure Eliza is running and accessible at the configured URL
- Check the Eliza terminal for any error messages
- Verify the environment variables in both projects are correctly set

#### Hedera Authentication Errors

- Verify your Hedera account ID and private key are correct
- Ensure you have sufficient HBAR balance in your testnet account
- Check network configuration (`testnet`, `previewnet`, or `mainnet`)

#### Frontend Connection to Backend

- Check that the API URL in the frontend `.env` file matches the backend host and port
- Inspect browser network requests for errors
- Look for CORS issues in the browser console

## Conclusion

Following this guide, you should have a fully functional StakeMate application running with:

1. A Node.js/Express backend with Hedera integration
2. A React frontend with Tailwind CSS styling
3. Eliza integration for enhanced Hedera interactions

For more information and specific usage examples, refer to the API Integration Guide and the project documentation.