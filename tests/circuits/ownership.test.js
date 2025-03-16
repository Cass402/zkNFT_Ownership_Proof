/** This file is for testing the voting.circom circuit to ensure it is working. */

const { expect } = require("chai"); // for the assertions
const { execSync } = require("child_process"); // for executing shell commands
const fs = require("fs"); // for file system operations
const path = require("path"); // for path operations
const circomlib = require("circomlibjs"); // for circomlib (for the poseidon hash)

// describing the test suite (describe() is a function from Mocha that allows for grouping tests)
describe("Ownership Circuit Tests", function () {
  this.timeout(10000); // setting a timeout for the tests (10 seconds)

  // Defining the various paths required for the test
  const circuitPath = path.join(__dirname, "../../circuits/ownership.circom"); // path to the circuit file
  const inputPath = path.join(__dirname, "ownership_input.json"); // path to the input file
  const witnessPath = path.join(__dirname, "ownership.wtns"); // path to the witness file
  const proofPath = path.join(__dirname, "ownership_proof.json"); // path to the proof file
  const publicPath = path.join(__dirname, "ownership_public.json"); // path to the public file
  const verificationPath = path.join(__dirname, "verification_key.json"); // path to the verification key
  const invalidProofPath = path.join(__dirname, "invalid_proof.json"); // path to the invalid proof file

  // before() is a mocha hook that runs before all tests in the block
  before(async function () {
    // Compile the circuit using circom
    console.log("Compiling the circuit...");
    execSync(`circom ${circuitPath} --r1cs --wasm --sym`, { stdio: "inherit" });

    // Generate the input JSON file
    console.log("Generating input JSON file...");
    const generatedNftCommitment = await generateNftCommitment();
    fs.writeFileSync(
      inputPath,
      JSON.stringify(
        {
          secret: 1234567890,
          tokenId: 9876543210,
          nftCommitment: generatedNftCommitment,
        },
        null,
        2
      ) // pretty print the JSON with 2 spaces
    );

    // Generate the witness file
    console.log("Generating witness file...");
    execSync(
      `node ${path.join(
        __dirname,
        "../../circuits/ownership_js/generate_witness.js"
      )} ${path.join(
        __dirname,
        "../../circuits/ownership_js/ownership.wasm"
      )} ${inputPath} ${witnessPath}`,
      { stdio: "inherit" }
    );

    // Generate the proof file
    console.log("Generating proof file...");
    execSync(
      `snarkjs plonk prove ${path.join(
        __dirname,
        `../../keys/ownership_final.zkey`
      )} ${witnessPath} ${proofPath} ${publicPath}`,
      { stdio: "inherit" }
    );

    // Create a copy of the proof file and modify it for simulating the invalid proof
    console.log("Creating a copy of the proof file...");
    fs.copyFileSync(proofPath, invalidProofPath);
    let proofData = JSON.parse(fs.readFileSync(invalidProofPath));
    proofData.A[0] = "0";
    fs.writeFileSync(invalidProofPath, JSON.stringify(proofData));
  });

  // Test case to check the validity of the proof
  it("should generate a valid proof", async function () {
    // Verify the proof using snarkjs
    console.log("Verifying proof...");
    const result = execSync(
      `snarkjs plonk verify ${verificationPath} ${publicPath} ${proofPath}`,
      { encoding: "utf-8" }
    );
    expect(result.toString()).to.contain("OK");
  });

  // Test case to check the invalidity of the proof
  it("should fail with an invalid proof", async function () {
    // Verify the proof using snarkjs
    console.log("Verifying invalid proof...");
    try {
      execSync(
        `snarkjs plonk verify ${verificationPath} ${publicPath} ${invalidProofPath}`,
        { encoding: "utf-8" }
      );
      // If the command does not throw an error, the test should fail
      expect.fail("Expected an error but none was thrown");
    } catch (error) {
      // Check that the error message contains the expected text
      expect(error.message).to.contain("Command failed");
    }
  });
});

// Function to generate a random NFT commitment using the poseidon hash
async function generateNftCommitment() {
  // Initialize the poseidon hash function
  const poseidon = await circomlib.buildPoseidon();
  const F = poseidon.F; // the finite field

  // Computing the hash using the inputs (secret and tokenId)
  const hash = poseidon([1234567890, 9876543210]);

  // Return the hash
  return F.toString(hash); // convert the hash to a string
}
