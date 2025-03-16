pragma circom 2.2.1; // The circom circuit compiler version being used

// Including the necessary libraries
include "circomlib/circuits/poseidon.circom"; //for poseidon hash
include "circomlib/circuits/comparators.circom"; // for less than and IsEqual checker

template Ownership() {
    // Private inputs of the circuit
    signal input secret; // the secret value (e.g., a private key or nonce)
    signal input tokenId; // the token ID

    // Public input of the circuit
    signal input nftCommitment; // a public commitment hash stored on chain (hash computed from secret and tokenId much match this)

    // compute Poseidon hash for commitment verification
    component poseidon = Poseidon(2); // 2 is the number of inputs for the hash function
    poseidon.inputs[0] <== secret; // the first input is the secret value
    poseidon.inputs[1] <== tokenId; // the second input is the tokenId

    // Checking whether the computed Poseidon hash matches the public nftCommitment
    component eq = IsEqual(); // a component (instance) of the IsEqual circuit in comparators
    eq.in[0] <== nftCommitment; // the first input is the the public nftCommitment
    eq.in[1] <== poseidon.out; // the second input is the computed poseidon hash of secret and tokenId
    eq.out === 1; // a constraint that ensures output of the IsEqual is 1 (nftCommitment is equal to poseidon.out)
}

component main {public [nftCommitment]} = Ownership(); // setting the public input as nftCommitment and creating an instance of the circuit

