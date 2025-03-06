# High-Level Architecture Document for zkNFT Ownership Proof

## 1. Introduction

### Project Goal

Build a system that allows users to prove NFT ownership using zero-knowledge proofs (zkSNARKs) without revealing sensitive information. The system integrates an off-chain proof generation mechanism with an on-chain ERC-721 smart contract that verifies these proofs.

### Purpose of the Document

- Describe the overall system architecture.
- Define key components and their interactions.
- Provide a visual and descriptive representation of the data flow.
- Serve as a reference for development, testing, and future enhancements.

## 2. Architectural Components

### 2.1 Off-Chain Components

#### Proof Generation Module

- **Function**: Generates zkSNARK proofs based on a secret input (private key/nonce) and public commitment.
- **Tools**: Utilizes snarkjs to compile and execute the circuit.
- **Responsibilities**:
  - Accept user inputs.
  - Execute the zkSNARK circuit.
  - Output a proof that can be verified on-chain.

#### User Interface (UI)

- **Function**: Provides a friendly, web-based interface for users.
- **Responsibilities**:
  - Facilitate proof generation.
  - Allow users to interact with the blockchain (e.g., submit proofs, view NFT status).
  - Use ethers.js to communicate with smart contracts.

### 2.2 On-Chain Components

#### ERC-721 Smart Contract

- **Function**: Manages NFTs and includes logic for zkSNARK proof verification.
- **Responsibilities**:
  - Store NFT metadata and associated commitments.
  - Verify the zkSNARK proof using a built-in verification function.
  - Maintain standard ERC-721 functionalities such as minting, transferring, and burning tokens.

#### Blockchain Network

- **Function**: The underlying blockchain (Ethereum and its testnets) where the smart contract is deployed.
- **Responsibilities**:
  - Provide a decentralized environment for executing and verifying smart contracts.
  - Ensure the integrity and immutability of NFT data and proof verification processes.

## 3. Data Flow and Integration

### 3.1 End-to-End Data Flow

1. **User Initiates Proof Generation**:
   - The user provides their secret input (e.g., a private key or nonce) via the UI.
   - The UI sends the data to the Proof Generation Module off-chain.
2. **Proof Generation**:
   - The Proof Generation Module uses the zkSNARK circuit to generate a proof.
   - The circuit computes a SNARK-friendly hash from the private input and compares it with a public commitment.
   - A valid proof is produced if the constraints are met.
3. **Submission to the Blockchain**:
   - The generated proof, along with the necessary public inputs (commitment, NFT identifier, etc.), is sent from the UI to the ERC-721 Smart Contract.
   - A transaction is initiated to invoke the proof verification function on-chain.
4. **On-Chain Verification**:
   - The smart contract verifies the zkSNARK proof.
   - Upon successful verification, the smart contract confirms NFT ownership or performs related state changes.
5. **User Feedback**:
   - The UI receives transaction status and verification results.
   - The user is notified whether the proof was valid and, if applicable, any changes to their NFT status are updated.

### 3.2 Architectural Diagram

Below is a conceptual diagram representing the system architecture:

```
                                         +----------------------+
                                         |      User Device     |
                                         |      (Web Browser)   |
                                         +----------+-----------+
                                                                |
                                                                |  (UI Interaction)
                                                                v
                                         +----------------------+
                                         |        UI Layer      |
                                         |      (ethers.js)     |
                                         +----------+-----------+
                                                                |
                                                                |  (Data & Proof Requests)
                                                                v
                                         +----------------------+
                                         |  Proof Generation    |
                                         |      Module          |
                                         |      (snarkjs)       |
                                         +----------+-----------+
                                                                |
                                                                |  (Proof & Public Inputs)
                                                                v
                                         +----------------------+
                                         |   ERC-721 Smart      |
                                         |    Contract with     |
                                         |   zkSNARK Verifier   |
                                         +----------+-----------+
                                                                |
                                                                |  (Transactions)
                                                                v
                                         +----------------------+
                                         |  Blockchain Network  |
                                         |      (Ethereum)      |
                                         +----------------------+
```

## 4. Integration Points and Deployment Considerations

### 4.1 Integration Points

- **UI ↔ Off-Chain Proof Module**:
  - Ensure secure and reliable communication (HTTPS and WebSocket for real-time updates).
  - Validate inputs on the UI before sending to the Proof Module.
- **Off-Chain Proof Module ↔ Smart Contract**:
  - Define a standardized data format for proofs and public inputs.
  - Ensure the off-chain generated proof is compatible with the on-chain verifier.
- **Smart Contract ↔ Blockchain Network**:
  - Optimize gas usage for proof verification functions.
  - Incorporate error handling for transaction failures or invalid proofs.

### 4.2 Deployment Considerations

- **Development and Testing**:
  - Use a local blockchain environment (Hardhat Network) for initial testing.
  - Implement comprehensive unit and integration tests for each component.
- **Mainnet/Testnet Deployment**:
  - Once fully tested, deploy the smart contract to a public testnet before mainnet launch.
  - Audit the smart contract code, especially the verification logic, for security vulnerabilities.
- **Scalability and Performance**:
  - Monitor and optimize off-chain proof generation to ensure timely processing.
  - Design the UI to handle multiple concurrent users without performance degradation.
