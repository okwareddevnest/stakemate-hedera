# Stakemate AI Agent Development Guide

## Project Reference
- **Project Directory**: ~/Desktop/Projects Directory/Hackathons/Hedera Hacks/hedera-ai-agent-workshop
- **Repository Base**: Build on the existing Hedera AI Agent Workshop codebase

## Core Architecture

- **Base Framework**: Build on Eliza system pattern with Hedera integration
- **AI Agent Character**: Custom character definition with autonomous capabilities
- **Hedera Integration**: HTS for tokens, HCS for consensus, immutable logging
- **Modular Design**: Separation of education, analysis, simulation, and guidance components

## Development Rules

### Hedera Integration
- Every data point must be verified through Hedera consensus
- All investment recommendations must be recorded on-chain
- Always implement complete error handling around Hedera operations
- Use HederaAgentKit pattern for all blockchain interactions
- Tokens should implement HTS standards with rich metadata

### Agent Capabilities Implementation
- Autonomous scanning requires scheduled tasks and event triggers
- Context-awareness requires both on-chain and external data sources
- Reactivity requires efficient state management and event listeners
- Explainability requires clear rationale storage for all recommendations
- Format all response data in both human-readable and machine-readable formats

### Data Architecture
- Infrastructure project data must include financials, milestones, and ESG metrics
- User profiles must track risk tolerance, history, and learning progress
- Virtual currency system must accurately simulate real investments
- Sentiment data must be correlated with financial metrics
- All data models must support Hedera consensus verification

### Implementation Priorities
1. Core Hedera integration and base agent functionality
2. Education and analysis systems
3. Portfolio simulation and management
4. Compliance checking and regulatory alignment
5. Sentiment analysis and timing recommendations
6. User experience and interface refinement

## Technical Components

### Required Hedera Actions
- Project token creation and management
- Investment simulation transactions
- Data verification via HCS
- On-chain recording of recommendations
- Compliance verification and attestation
- Milestone tracking and verification

### Agent Capabilities
- Natural language education system
- Risk scoring algorithm
- Portfolio allocation strategy engine
- Regulatory compliance validation
- Sentiment analysis integration
- Automated notifications and alerts

### Interface Requirements
- Conversational education interface
- Portfolio visualization dashboard
- Project comparison tools
- Risk/reward visual representations
- Simulation controls and results display
- Learning progress tracking

## Kenyan Market Considerations
- Align with CMA regulatory requirements
- Focus on infrastructure projects relevant to Kenyan development
- Adjust risk tolerance algorithms for local market conditions
- Incorporate local news and sentiment sources
- Design for accessibility across varying technical literacy levels
- Support micro-investment amounts appropriate for target users

## Best Practices
- Follow TypeScript patterns to build
- Implement comprehensive testing for all components
- Document all integration points and APIs
- Secure user data and investment information
- Ensure transparent decision-making in all agent recommendations
- Design for educational value alongside investment guidance

## Demo Scenario Implementation
- Nairobi commuter rail project analysis
- Diversified portfolio recommendation with solar project
- Clear explanation of risk factors and ESG benefits
- Simulated investment with projected outcomes
- Demonstration of regulatory compliance checking
- Recording of all actions and recommendations on Hedera

This guide serves as a comprehensive reference for maintaining consistency and focus throughout the development of the Stakemate AI agent for decentralized micro-investing. 