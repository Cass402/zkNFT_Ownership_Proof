# Using an Ubuntu base image
FROM ubuntu:20.04

# Avoid interactive prompts during the build
ENV DEBIAN_FRONTEND=noninteractive

# Update the package list and install basic dependencies
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    git \
    curl \
    software-properties-common \
    wget \
    libgmp-dev \
    nlohmann-json3-dev \
    nasm \
    python3 \
    python3-pip \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Install Rust using rustup (this includes cargo)
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
# Set the PATH for Rust
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Node.js v22.x (latest LTS)
RUN curl -sL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install the Solidity compiler (solc)
RUN npm install -g solc && \
    # Create a symlink for solc so that we can use "solc" instead of "solcjs"
    ln -s $(which solcjs) /usr/local/bin/solc || true

# Clone, checkout, and build the RUST version of circom (v2.2.1)
RUN git clone https://github.com/iden3/circom.git /circom && \
    cd /circom && \
    git checkout v2.2.1 && \
    cargo build --release && \
    cp target/release/circom /usr/local/bin/ 

# Install snarkjs and Hardhat globally via npm
RUN npm install -g snarkjs hardhat

# Set the working directory
WORKDIR /app

# Copy the local files to the container
COPY . .

# Start a bash shell when the container runs
CMD ["/bin/bash"]
