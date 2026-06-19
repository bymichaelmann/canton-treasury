# CantonTreasury

Tokenized Treasury Bill platform built on the **Canton Network**. Institutional-grade issuance, compliance-managed transfer, and confidential data room for digital asset workflows.

## Overview

CantonTreasury enables financial institutions to issue, manage, and transfer tokenized US Treasury Bills using the Canton Network's privacy-by-design architecture. The platform enforces KYC/AML compliance at the smart contract layer and provides a confidential data room for sharing deal documents with qualified investors.

### Key Features

- **CIP-056 Tokenized T-Bills** — UTXO-based token standard with split/merge capabilities, mirroring the lifecycle of traditional Treasury Bills
- **Compliance-First Transfers** — Smart contract-enforced transfer restrictions based on investor accreditation and jurisdictional rules
- **Private Data Room** — Confidential document sharing leveraging Canton's privacy model; only authorized parties see document contents
- **KYC/AML Registry** — On-chain investor registration with accreditation levels (Accredited Investor, QIB, Retail)
- **REST API** — Express.js backend exposing a clean API for minting, transferring, compliance management, and data room operations
- **React Dashboard** — Modern single-page application built with React, TypeScript, Vite, and Tailwind CSS

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Canton Network                          │
│  ┌──────────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  TreasuryBill    │  │  Investor    │  │  PrivateDataRoom │  │
│  │  (CIP-056 Token) │  │  Registry    │  │  (Data Room)     │  │
│  │  Split / Merge   │  │  KYC/AML     │  │  Grant Access    │  │
│  │  Transfer        │  │  Accred.     │  │  Confidential    │  │
│  └────────┬─────────┘  └──────┬───────┘  └────────┬─────────┘  │
│           │                   │                    │           │
│           └───────────────────┴────────────────────┘           │
│                              │                                 │
│                   Canton JSON Ledger API                       │
└──────────────────────────────┼─────────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │    Backend (4000)    │
                    │  Express + TypeScript │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │   Frontend (5173)    │
                    │  React + Vite + TW   │
                    └─────────────────────┘
```

## Smart Contracts

The Daml smart contracts implement the core business logic:

| Contract | Description |
|---|---|
| **TreasuryBill** | CIP-056-compatible tokenized T-Bill with Transfer, Split, and Merge choices |
| **InvestorRegistry** | KYC/AML compliance registry with accreditation levels and status lifecycle |
| **TransferRestriction** | Rule-based transfer restrictions (min accreditation, max holding, jurisdiction blocks) |
| **PrivateDataRoom** | Confidential document sharing with per-investor access grants |

### Test Coverage

Daml Script tests cover five key workflows:

1. **Mint & Verify** — Creates a T-Bill and validates its properties
2. **Split** — Splits a UTXO into two, verifying correct amounts
3. **Merge** — Merges two UTXOs back into one
4. **KYC Workflow** — Full registration and approval lifecycle
5. **Compliant Transfer** — Transfer with compliance restriction verification

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm (recommended) or npm
- Docker & Docker Compose (for local Canton network)
- Daml SDK (for compiling smart contracts)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/canton-treasury.git
cd canton-treasury

# Install backend dependencies
cd backend && pnpm install && cd ..

# Install frontend dependencies
cd frontend && pnpm install && cd ..
```

### Running Locally

#### 1. Start the Canton Network

```bash
docker compose up canton-localnet postgres pqs
```

#### 2. Compile Daml Smart Contracts

```bash
cd daml
dpm build
cd ..
```

#### 3. Start the Backend

```bash
cd backend
pnpm run dev
```

#### 4. Start the Frontend

```bash
cd frontend
pnpm run dev
```

Visit `http://localhost:5173` to access the dashboard.

### Running Tests

```bash
# Daml Script tests
cd daml && dpm test && cd ..

# Backend unit tests
cd backend && pnpm test && cd ..
```

## API Reference

### Treasury

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/treasury/mint` | Mint a new T-Bill token |
| POST | `/api/treasury/transfer` | Transfer tokens with compliance check |
| POST | `/api/treasury/split` | Split a T-Bill UTXO |

### Compliance

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/compliance/register` | Register investor KYC |
| POST | `/api/compliance/approve` | Approve KYC status |
| GET | `/api/compliance/status/:party` | Get KYC status |

### Data Room

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/dataroom/create` | Create a new document |
| POST | `/api/dataroom/grant` | Grant document access to investor |
| GET | `/api/dataroom/documents/:party` | List visible documents |

## Technology Stack

| Layer | Technology |
|---|---|
| Smart Contracts | Daml 3.4 (Canton Network) |
| Backend | TypeScript, Express.js, Node.js |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Database | PostgreSQL (via PQS) |
| Infrastructure | Docker Compose |
| Token Standard | CIP-056 (UTXO-based) |

## License

Apache-2.0

---

Built with Daml on the Canton Network.
