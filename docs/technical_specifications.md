# Technical Specifications

## 1. Overview

This document details the technical specifications for the zkNFT Ownership Proof project—a privacy-preserving NFT verification system that uses zero-knowledge proofs to confirm NFT ownership without revealing private information. The system leverages Circom for circuit design, snarkjs for proof generation, and the PLONK updatable scheme for on-chain verification. It covers the cryptographic primitives, circuit design, key generation and trusted setup, proof handling, smart contract implementation, and frontend integration.

## 2. Zero-Knowledge Proof Infrastructure

### 2.1 Circom Circuit Design

- **Circuit Language & Version:**
  - Developed in Circom (v2.2.1).
- **Cryptographic Primitives:**
  - **Hash Function:**
    - Utilizes the Poseidon hash function (optimized for SNARKs) to compute a commitment for NFT ownership.
- **Inputs & Outputs:**
  - **Private Inputs:**
    - `secret` – a secret value (e.g., a private key or nonce) known only to the NFT owner.
    - `tokenId` – the NFT identifier (or related secret token data) used in the commitment.
  - **Public Input:**
    - `nftCommitment` – the Poseidon hash output computed off-chain and stored on-chain.
- **Circuit Constraints:**
  - **Commitment Verification:**
    - The circuit computes `Poseidon(secret, tokenId)` and asserts equality with the public `nftCommitment`.

### 2.2 Implementation Details of `circuits/nft_proof.circom`

- The `circuits/nft_proof.circom` file implements the NFT ownership proof logic.
- It processes the private inputs (the secret and tokenId), computes the hash using Poseidon, and enforces that the resulting value matches the provided public `nftCommitment`.

## 3. Key Generation & Trusted Setup

### 3.1 Powers-of-Tau Ceremony

- **File Requirements:**
  - A pre-generated Powers-of-Tau file (e.g., `pot12_final.ptau`) is required to establish the common reference string (CRS) for the trusted setup.

### 3.2 PLONK Setup

- **Commands & Tools:**
  - Use snarkjs to execute the PLONK setup:
    - **Phase 1:** Compile the Circom circuit to generate R1CS, WASM, and symbol files.
    - **Phase 2:** Generate the witness using the compiled WASM.
    - **Phase 3:** Generate proving and verification keys using the PLONK setup command.
- **File Structure:**
  - Store the proving key (e.g., `proving_key.zkey`) and verification key (e.g., `verification_key.json`) securely, ideally in a dedicated `/keys` directory.

## 4. Proof Generation & Verification

### 4.1 Witness Generation

- **Process:**
  - Once the circuit is compiled, generate a witness from the input JSON file using the produced WASM.
- **Command:**
  ```sh
  snarkjs wtns calculate nft_proof.wasm input.json witness.wtns
  ```

### 4.2 Proof Generation

- **Using snarkjs with PLONK:**
  - Generate the proof using the witness and the proving key.
- **Command:**
  ```sh
  snarkjs plonk prove proving_key.zkey witness.wtns proof.json public.json
  ```

### 4.3 Local Proof Verification

- **Pre-Deployment Check:**
  - Verify the generated proof locally before submitting it on-chain.
- **Command:**
  ```sh
  snarkjs plonk verify verification_key.json public.json proof.json
  ```

## 5. Smart Contract Implementation

### 5.1 Contract Overview

- **Language & Version:**
  - Written in Solidity (version 0.8.x recommended for its built-in overflow checks).
- **Verifier & NFT Contract:**
  - Integrates standard ERC-721 functionality (using OpenZeppelin) with an embedded PLONK verifier.
- **Key Function:**
  - A function that accepts the proof and public inputs, verifies the zkSNARK proof using the PLONK updatable scheme logic, and confirms NFT ownership.

### 5.2 Deployment

- **Tools:**
  - Utilize Hardhat for compiling, testing, and deploying the smart contract.
- **On-Chain Interaction:**
  - Deploy the contract initially on a testnet (e.g., Rinkeby or Goerli) for comprehensive testing before moving to mainnet.

## 6. Frontend Integration

### 6.1 User Interface

- **Technologies:**
  - A web interface built with Next.js or React.
- **Functionality:**
  - Collects user inputs (e.g., secret and tokenId).
  - Initiates witness and proof generation through backend integration.
  - Displays NFT status and proof verification results.

### 6.2 Web3 Interaction

- **Connecting to the Blockchain:**
  - Leverages MetaMask (or another wallet provider) to enable users to sign and send transactions.
- **Smart Contract Interaction:**
  - Uses ethers.js to submit the proof and public input to the smart contract for on-chain verification.

## 7. Deployment Environment & Tooling

### 7.1 Environment Setup

- **Containerized Development Environment:**
  - Use Docker to establish a reproducible development setup that includes Node.js, Circom, snarkjs, Hardhat, and ethers.js.
  - Document Docker commands and configuration in the repository to ensure consistency across development environments.

### 7.2 Testing & Continuous Integration

- **Testing:**
  - Create unit tests for Circom circuits using test cases and integration tests for smart contracts using Hardhat.
  - Develop end-to-end tests that simulate the full proof generation and verification workflow.
- **CI/CD Tools:**
  - Utilize GitHub Actions with Docker support to run tests on every commit, ensuring continuous integration and a stable development pipeline.

## 8. Security Considerations

### 8.1 Cryptographic Parameters

- **Parameter Choices:**
  - Ensure that all cryptographic operations, including the Poseidon hash, use secure and standardized parameters (bit lengths, field sizes, etc.) to guarantee robust security.

### 8.2 Trusted Setup Security

- **Mitigation Strategies:**
  - Adopt a universal trusted setup, and where possible, consider a multi-party computation (MPC) approach to reduce single-point failure risks.
  - For PLONK’s updatable scheme, ensure that key updates are securely managed.

### 8.3 Smart Contract Security

- **Best Practices:**
  - Follow Solidity best practices: use the latest compiler version, enforce proper error handling, and integrate thorough testing.
  - Consider third-party audits or formal verification of the verifier contract to further enhance security.

## 9. Summary of Tools & Versions

- **Circom:** v2.2.1
- **snarkjs:** Latest version supporting PLONK updatable scheme (e.g., v0.7.5 or later)
- **Solidity:** 0.8.28 (or later)
- **Node.js:** v22.14.0 (Latest LTS)
- **Development Framework:** Hardhat (v2.22.19)
- **Frontend Libraries:** ethers.js, Next.js
