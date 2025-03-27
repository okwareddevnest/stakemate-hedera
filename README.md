# Stakemate: AI Agent for Decentralized Micro-Investing

Stakemate is an autonomous AI agent designed to educate, analyze, simulate, and guide micro-investors in tokenized infrastructure projects—using the Hedera network as its data backbone and execution layer.

## Overview

Built for the Kenyan retail investor, Stakemate turns capital markets into a guided experience, lowering entry barriers and building investor confidence through AI mentorship.

## Core Capabilities

1. **🧑‍🏫 Educator Mode**: Uses NLP to answer questions about tokenized investments and generates bite-sized lessons.
2. **🔎 Due Diligence Analyst**: Continuously scans Hedera-stored infrastructure project data.
3. **💰 Portfolio Mentor**: Simulates micro-investments using a virtual currency system.
4. **📋 Compliance Assistant**: Verifies if projects comply with CMA guidelines.
5. **📊 Sentiment Synthesizer**: Collects and interprets social media and news trends related to tokenized projects.

## Hedera Integration

- **Project Tokens**: HTS tokens or NFTs represent infrastructure projects with verifiable metadata
- **AI Agent Logs**: Every recommendation or user decision is recorded immutably via Hedera
- **Data Verification**: Hedera Consensus Service validates incoming project status changes
- **Investment Simulation**: Real-time updates simulate Hedera's actual transaction speed and costs
- **Smart Notifications**: Agent pings users based on Hedera-stored triggers

## Getting Started

```bash
# Clone the repository
git clone https://github.com/yourusername/stakemate.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit the .env file with your Hedera credentials

# Start the development server
npm run dev
```

## Project Structure

- `src/`: Source code
  - `agent/`: AI agent implementation
  - `hedera/`: Hedera integration code
  - `models/`: Data models
  - `services/`: Core services
  - `utils/`: Utility functions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 