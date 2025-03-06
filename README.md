# zkNFT Ownership Proof

Imagine a world where you can prove ownership of your NFT with absolute confidence that your identity remains concealed, yet verifiers can confirm the authenticity of your claim. Welcome to zkNFT Ownership Proof, a revolutionary system that leverages zero-knowledge proofs (zk-SNARKs) to ensure both privacy and trust in NFT ownership verification.

## Executive Summary

### Project Overview

zkNFT Ownership Proof is a privacy-preserving protocol that enables NFT owners to generate a zero-knowledge proof demonstrating ownership without revealing private keys or sensitive details. This system integrates off-chain proof generation with on-chain verification using smart contracts, ensuring that your NFT is authenticated securely and privately.

### Key Features

- **Proof Generation & Validation**: Generate zkSNARK proofs off-chain without exposing sensitive information and validate them on-chain.
- **Secure Key Management**: Implements trusted key generation and secure handling of cryptographic secrets.
- **On-Chain Verification**: Deploys an ERC-721 smart contract integrated with zkSNARK proof verification.
- **User-Friendly Interface**: Provides an intuitive web interface for users to interact with the system.
- **Modular & Transparent Architecture**: Separates concerns for efficient development, testing, and future scalability.

### Goals

- **Privacy**: Maintain the anonymity of NFT owners by ensuring no sensitive data is exposed.
- **Security**: Prevent fraudulent claims and ensure that only valid proofs trigger state changes on-chain.
- **Scalability**: Design the system to handle a large volume of proof verifications efficiently.
- **Transparency**: Enable public auditing of the vote verification process without compromising individual privacy.

## User Guide

### Requirements

- Docker
- Docker Compose
- Node.js (Latest LTS version recommended)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/Cass402/zkNFT_Ownership_Proof.git
   cd zkNFT_Ownership_Proof
   ```

2. Build the Docker images:

   ```sh
   docker compose build
   ```

3. Start the containers:

   ```sh
   docker compose up
   ```

### Usage

1. Access the frontend at:

   ```sh
   http://localhost:80
   ```

2. Follow the UI instructions to:
   - Generate your zkSNARK proof off-chain.
   - Submit the proof to the blockchain for on-chain verification.
   - View the outcome of the verification process.

### Docker Setup

- The `Dockerfile` defines the environment for application execution.
- The `docker-compose.yml` file orchestrates the services including the frontend, backend, and supporting tools.

## Examples and Use Cases

### Example 1: Basic Proof Generation

1. Open the application interface.
2. Input your secret key and NFT details to generate a zero-knowledge proof.
3. The system produces a zkSNARK proof, which is displayed in the UI.
4. The generated proof can be stored locally or submitted for on-chain verification.

### Example 2: On-Chain Verification

1. After proof generation, submit the proof via the UI.
2. The proof is securely transmitted to the smart contract.
3. On-chain verification is conducted to authenticate the proof.
4. The system displays the verification result, confirming or denying NFT ownership.

### Use Case: Secure NFT Ownership Verification

Scenarios where NFT ownership needs to be verified without exposing sensitive information include:

- **Digital Art Marketplaces**: Authenticate the ownership of digital art NFTs without revealing the collector's identity.
- **Collectibles Verification**: Securely validate ownership of rare digital collectibles.
- **Gaming Assets**: Prove ownership of in-game digital assets on blockchain-powered games while maintaining player privacy.

## Documentation

For detailed technical insights, please refer to the following documents in the `/docs` folder:

- [Project Requirements & Threat Model](docs/requirements_and_threat_model.md)
- [Circuit Design](docs/circuit_design.md)
- [Architecture Overview](docs/architecture.md)
- [Technical Specifications](docs/technical_specifications.md)

## Testing and Coverage

Documentation for testing procedures and code coverage will be added as the project matures.
