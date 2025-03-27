# StakeMate

StakeMate is an AI-powered decentralized micro-investing platform that enables retail investors to participate in infrastructure tokenization on the Hedera network.

![StakeMate Banner](https://i.imgur.com/your-banner-image.png)

## Overview

StakeMate is designed to democratize infrastructure investment by lowering barriers to entry and providing AI-driven insights and recommendations. The platform leverages Hedera's distributed ledger technology to provide transparent, secure, and efficient investment opportunities in infrastructure projects.

### Key Features

- **Micro-investing Platform**: Allows small-scale investments in tokenized infrastructure projects
- **AI-Driven Insights**: Provides intelligent investment recommendations based on user profile and market data
- **Educational Resources**: Helps users understand infrastructure investments through personalized learning paths
- **Tokenization**: Utilizes the Hedera network for secure, transparent token issuance and management
- **Real-time Analytics**: Offers detailed analytics on project performance and investment returns
- **ESG Integration**: Incorporates environmental, social, and governance factors into project evaluation

## Technology Stack

- **Frontend**: React.js, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express
- **Blockchain**: Hedera Hashgraph
- **AI/ML**: Sentiment analysis, recommendation engines, risk assessment models
- **Database**: MongoDB

## Getting Started

### Prerequisites

- Node.js v16 or higher
- npm or yarn package manager
- A Hedera testnet account (for development)
- MongoDB v4.4 or higher

### MongoDB Setup

1. Install MongoDB:
   - **Linux**: Follow the [official MongoDB installation guide](https://docs.mongodb.com/manual/administration/install-on-linux/)
   - **macOS**: `brew install mongodb-community`
   - **Windows**: Download and install from the [MongoDB website](https://www.mongodb.com/try/download/community)

2. Start MongoDB service:
   ```bash
   sudo systemctl start mongod    # Linux
   brew services start mongodb-community    # macOS
   ```

3. Create a database and user for StakeMate:
   ```bash
   mongosh
   ```

   ```javascript
   // Inside the MongoDB shell
   use stakemate
   
   db.createUser({
     user: "stakemate_user",
     pwd: "secure_password_here",
     roles: [{ role: "readWrite", db: "stakemate" }]
   })
   
   exit
   ```

4. Update your `.env` file with your MongoDB configuration (copy from `.env.example`):
   ```
   DB_HOST=localhost
   DB_PORT=27017
   DB_NAME=stakemate
   DB_USER=stakemate_user
   DB_PASSWORD=secure_password_here
   ```

   Alternatively, use a connection URI:
   ```
   DB_URI=mongodb://stakemate_user:secure_password_here@localhost:27017/stakemate
   ```

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/okwareddevnest/stakemate-hedera.git
   cd stakemate-hedera
   ```

2. Install backend dependencies
   ```bash
   npm install
   ```

3. Install frontend dependencies
   ```bash
   cd client
   npm install
   ```

4. Create a `.env` file in the root directory with your Hedera credentials
   ```
   HEDERA_ACCOUNT_ID=your-account-id
   HEDERA_PRIVATE_KEY=your-private-key
   HEDERA_NETWORK=testnet
   ```

5. Start the development server
   ```bash
   # Start backend (from root directory)
   npm run dev
   
   # Start frontend (from client directory)
   npm run dev
   ```

## Project Structure

```
stakemate/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/                # React source code
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page components
│       └── services/       # API services
├── src/                    # Backend server code
│   ├── agent/              # AI agent implementation
│   ├── hedera/             # Hedera integration modules
│   ├── models/             # Data models
│   ├── services/           # Business logic services
│   └── utils/              # Utility functions
└── tests/                  # Test files
```

## Features

### For Investors

- **Discover Projects**: Browse and discover a variety of infrastructure projects
- **Investment Analysis**: Get AI-powered insights on project potential
- **Portfolio Management**: Track and manage your infrastructure investments
- **Educational Content**: Access personalized learning resources
- **Risk Assessment**: Understand the risk profile of different projects

### For Project Owners

- **Project Tokenization**: Tokenize infrastructure projects on Hedera
- **Progress Tracking**: Update and share project milestones
- **Compliance Management**: Ensure regulatory compliance
- **Investor Communication**: Engage with investors and stakeholders

## Roadmap

- **Q2 2024**: Alpha release with basic functionality
- **Q3 2024**: Integration with Hedera mainnet
- **Q4 2024**: Enhanced AI recommendation engine
- **Q1 2025**: Mobile application launch
- **Q2 2025**: Expansion to additional markets

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Hedera Hashgraph for providing the distributed ledger infrastructure
- The open-source community for their invaluable tools and libraries

---

© 2024 StakeMate. All rights reserved.