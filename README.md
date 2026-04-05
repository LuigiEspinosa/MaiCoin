# MaiCoin

A full-stack ERC-20 learning project — Solidity smart contract, Hardhat 3 testing, Sepolia testnet deployment, and a React dashboard for wallet interaction.

![Solidity](https://img.shields.io/badge/Solidity-0.8.28-363636?logo=solidity)
![Hardhat](https://img.shields.io/badge/Hardhat-3.x-yellow)
![ethers.js](https://img.shields.io/badge/ethers.js-v6-blue)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)

---

## What it does

Deploy the `MaiCoin` (MAI) token to Sepolia, send it to friends, let them burn some. Total cost: $0 — Sepolia ETH is free from a faucet.

---

## System architecture

```mermaid
flowchart LR
    subgraph Browser
        UI[React Dashboard]
        MM[MetaMask]
        UI -->|eth_requestAccounts| MM
        MM -->|BrowserProvider + Signer| UI
    end

    subgraph Sepolia
        Contract[MaiCoin.sol\nERC-20 + Ownable]
    end

    subgraph Hardhat
        Local[hardhatMainnet\nedr-simulated]
    end

    MM -->|sign tx| Contract
    UI -->|read calls| Contract
    Contract -.->|local dev| Local
```

---

## User flow

```mermaid
sequenceDiagram
    actor User
    participant App
    participant MetaMask
    participant Contract

    User->>App: open dashboard
    User->>App: click Connect Wallet
    App->>MetaMask: eth_requestAccounts
    MetaMask-->>App: address + provider
    App->>Contract: balanceOf(address)
    Contract-->>App: MAI balance
    User->>App: send / mint / burn
    App->>MetaMask: sign transaction
    MetaMask->>Contract: execute tx
    Contract-->>App: Transfer event
    App->>Contract: balanceOf(address)
    Contract-->>App: updated balance
```

---

## Local setup

**Prerequisites:** Node.js 22, pnpm, MetaMask browser extension.

```bash
# 1. Clone
git clone git@github.com:LuigiEspinosa/MaiCoin.git
cd MaiCoin

# 2. Install contract dependencies
npm install

# 3. Compile the contract
npx hardhat compile

# 4. Deploy locally
npx hardhat run scripts/deploy.ts --network hardhatMainnet
# Copy the printed address into frontend/src/lib/contract.ts → CONTRACT_ADDRESS

# 5. Install and start the frontend
cd frontend
pnpm install
pnpm dev
# Open http://localhost:5173
```

---

## Sepolia deployment

```bash
# 1. Copy and fill in .env
cp .env.example .env
# SEPOLIA_RPC_URL  — get a free key at alchemy.com
# SEPOLIA_PRIVATE_KEY — your MetaMask private key (never commit this)
# ETHERSCAN_API_KEY — free at etherscan.io

# 2. Get free testnet ETH
# https://sepoliafaucet.com

# 3. Deploy
npx hardhat run scripts/deploy.ts --build-profile production --network sepolia

# 4. Set the frontend env
echo "VITE_CONTRACT_ADDRESS=0x..." > frontend/.env
```

---

## License

MIT
