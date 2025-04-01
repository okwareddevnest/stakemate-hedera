# StakeMate

StakeMate is an AI-powered decentralized micro-investing platform that enables retail investors to participate in infrastructure tokenization on the Hedera network.

<p align="center">
  <img src="screenshots/stakemate-banner.png" alt="StakeMate Banner" width="800">
</p>

## 📋 Overview

StakeMate democratizes infrastructure investment by lowering barriers to entry and providing AI-driven insights. The platform leverages Hedera's distributed ledger technology to provide transparent, secure, and efficient investment opportunities in infrastructure projects.

## 🔑 Key Features

- **Micro-investing Platform**: Invest small amounts in tokenized infrastructure projects
- **AI-Driven Insights**: Get intelligent investment recommendations based on your profile
- **Educational Resources**: Learn about infrastructure investments through personalized learning paths
- **Tokenization**: Utilize Hedera network for secure, transparent token management
- **Real-time Analytics**: Track detailed project performance and investment returns
- **ESG Integration**: Evaluate projects using environmental, social, and governance factors

## 🚶‍♂️ Project Walkthrough

### 1. Authentication and Onboarding

StakeMate offers secure authentication through Hedera accounts, providing a passwordless sign-in experience.

<p align="center">
  <img src="screenshots/auth-flow.png" alt="Authentication Flow" width="800">
</p>

#### Features:
- Hedera account-based authentication
- Multi-step verification process
- Secure challenge-response protocol
- Direct integration with the Hedera network

#### How it works:
1. Enter your Hedera account ID (e.g., 0.0.5781013)
2. Connect your Hedera wallet
3. Sign a challenge to prove ownership
4. Access your personalized dashboard

### 2. Dashboard

The dashboard provides a comprehensive overview of your investment portfolio and available projects.

<p align="center">
  <img src="screenshots/dashboard.png" alt="Dashboard" width="800">
</p>

#### Features:
- Portfolio value tracker
- Active projects counter
- Expected returns calculator
- Risk level assessment
- Featured projects showcase
- Portfolio allocation visualization
- Performance charts

#### Key metrics:
- Total portfolio value
- Number of active investments (3 in the example)
- Average projected returns (3.33% in the example)
- Overall risk profile (Medium in the example)
- Performance over time

### 3. Project Discovery and Analysis

Browse and analyze various infrastructure projects available for investment.

<p align="center">
  <img src="screenshots/projects.png" alt="Projects" width="800">
</p>

#### Features:
- Filterable project listings
- Detailed project information
- ESG metrics and impact assessment
- Risk and return projections
- Timeline visualization
- Token information and performance

#### Project types:
- Transportation infrastructure (e.g., Nairobi Commuter Rail)
- Renewable energy (e.g., Lake Turkana Wind Power)
- Digital infrastructure (e.g., Okware)
- Water and sanitation
- Social infrastructure

### 4. Investment Process

Make informed investment decisions and execute them through a streamlined process.

<p align="center">
  <img src="screenshots/investment.png" alt="Investment" width="800">
</p>

#### Features:
- Investment simulation
- Token purchase interface
- Real-time transaction status
- Investment confirmation
- Automatic portfolio update

#### How it works:
1. Select a project to invest in
2. Enter your investment amount (in HBAR)
3. Review the investment details
4. Confirm the transaction
5. Receive tokens in your portfolio

### 5. Portfolio Management

Track and manage your infrastructure investments in one place.

<p align="center">
  <img src="screenshots/portfolio.png" alt="Portfolio" width="800">
</p>

#### Features:
- Investment history table
- Performance tracking charts
- Token holdings visualization
- Allocation breakdown by project type
- Export and transfer options

#### Portfolio insights:
- Total value of holdings
- Initial investment amount (110 HBAR in the example)
- Return percentages
- Token allocations by project type (TRA, DIG)
- Performance trends over time

### 6. Learning Center

Enhance your knowledge about infrastructure investments and tokenization.

<p align="center">
  <img src="screenshots/learning.png" alt="Learning Center" width="800">
</p>

#### Features:
- Personalized learning paths
- Interactive tutorials
- Infrastructure investment basics
- Tokenization fundamentals
- Risk management strategies
- ESG investing principles

## 🛠️ Technology Stack

- **Frontend**: React.js, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express
- **Blockchain**: Hedera Hashgraph
- **AI/ML**: Sentiment analysis, recommendation engines, risk assessment models
- **Database**: MongoDB

## 🚀 Getting Started

### Prerequisites

- Node.js v16 or higher
- npm or yarn package manager
- A Hedera testnet account (for development)
- MongoDB v4.4 or higher

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

## 📊 API Integration

The platform provides a comprehensive API for integrating with external services and extending functionality. See [API_INTEGRATION.md](API_INTEGRATION.md) for detailed documentation.

## 🗺️ Roadmap

- **Q2 2024**: Alpha release with basic functionality
- **Q3 2024**: Integration with Hedera mainnet
- **Q4 2024**: Enhanced AI recommendation engine
- **Q1 2025**: Mobile application launch
- **Q2 2025**: Expansion to additional markets

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Hedera Hashgraph for providing the distributed ledger infrastructure
- The open-source community for their invaluable tools and libraries

---

© 2024 StakeMate. All rights reserved.