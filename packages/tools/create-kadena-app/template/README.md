# Kadena dApp Template – Absolute Beginner Guide

This template gives you a full local setup to learn and build on Kadena:

- A local devnet node (via Docker)
- Pact smart contracts and deployment scripts (in `contracts`)
- A Next.js frontend that calls your contract (in `frontend`)

You can get from zero to a running app in minutes by following the steps below.

---

## What you will install

- Node.js 18 or newer
- npm (or Yarn)
- Docker (to run the local Kadena devnet)
- TypeScript tools for scripts
  - `ts-node` (used by deployment and config generation)

Optional:

- Corepack (to manage Yarn), but npm works fine

---

## Project layout

- `contracts` – Pact contracts and scripts to run a local chain, create a dev account, and deploy your module
  - Scripts: `start-devnet.sh`, `stop-devnet.sh`, `dev-account.sh`, `deploy.ts`, `script.ts`
  - Pact examples: `helloWorld.pact`, `contract.pact`
- `frontend` – Next.js app that auto-loads your contract config and exposes buttons to call functions

---

## Quick start (copy/paste)

1. Install dependencies for both parts

```bash
# Contracts tooling (needed for deploy + Kadena CLI)
cd contracts
npm install
# Add ts-node for TypeScript scripts if not installed by your environment
npm install -D ts-node

# Frontend (Next.js)
cd ../frontend
npm install
```

2. Start the local Kadena devnet (keep it running)

```bash
cd ../contracts
npm run start-chain
```

This launches a Docker container named `devnet` on `http://localhost:8080`.

3. Create and fund a development account

```bash
npm run dev-account
```

This uses the Kadena CLI to:

- Generate a keypair (saved as `testing-account.yaml` by default)
- Create an account alias and fund it on devnet chain 0

4. Deploy the example contract and generate frontend config

```bash
# From contracts
npm run deploy -- -f ./helloWorld.pact
```

During deploy, you’ll see prompts for host/network/chain; defaults work:

- Host: `http://localhost:8080`
- Network: `development`
- Chain: `0`

The deploy script will:

- Deploy your Pact module
- Generate a JSON config from the Pact source

5. Start the frontend

```bash
cd ../frontend
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Frontend walkthrough

- The homepage lists contract functions and their inputs
- For write functions, any required capabilities will be attached automatically based on the generated config
- Update the `account` field when calling functions that require an account

If you redeploy the contract, the config is regenerated and copied again; just refresh the page.

---

## Contracts tooling details

Inside `contracts/package.json` you have:

- `start-chain`: starts a local devnet via Docker
- `dev-account`: generates keys, creates an alias, and funds it using `@kadena/kadena-cli`
- `deploy`: runs `ts-node deploy.ts` to deploy Pact and generate/copy the config JSON
- `stop-chain`: stops and resets the devnet container and volume

Key scripts:

- `start-devnet.sh` uses `docker run` to start `kadena/devnet` on port 8080
- `dev-account.sh` runs `npx kadena ...` commands to create and fund an account
- `deploy.ts` signs and submits the deploy, then runs `script.ts` to generate a config JSON and writes it to the frontend
- `script.ts` parses your Pact file to detect functions, args, and required capabilities

---

## Required dependencies (complete list)

- Global/system

  - Docker (required): `docker --version`
  - Node.js 18+ and npm: `node -v`, `npm -v`

- contracts (installed via `npm install`)

  - `@kadena/client`
  - `@kadena/kadena-cli`
  - `inquirer`
  - `yargs`
  - `@types/inquirer`, `@types/yargs`, `@types/js-yaml`
  - Dev: `ts-node` (install with `npm install -D ts-node` if missing)

- frontend (installed via `npm install`)
  - `next`, `react`, `react-dom`, `typescript`
  - `@types/react`, `@types/node`
  - `dotenv`, `eslint` and related configs

---

## Typical development loop

```bash
# Terminal A: run the devnet
cd contracts && npm run start-chain

# Terminal B: deploy after changes to your pact
cd contracts && npm run deploy -- -f ./helloWorld.pact

# Terminal C: run the UI
cd frontend && npm run dev
```

- Edit your Pact in `contracts/helloWorld.pact`
- Redeploy to regenerate the `contractConfig.json`
- Refresh the UI to see updated functions/caps

---

## Troubleshooting

- Docker not running or port in use

  - Ensure Docker is running and `http://localhost:8080` is free
  - Stop/reset with `npm run stop-chain` in `contracts`

- Missing `ts-node` when deploying

  - Install locally in `contracts`: `npm install -D ts-node`

- Frontend can’t find `contractConfig.json`

  - Re-run deploy from `contracts`: `npm run deploy -- -f ./helloWorld.pact`
  - Confirm the file exists at `frontend/src/utils/contractConfig.json`

- Account/capability errors
  - Ensure you ran `npm run dev-account` first
  - Set the correct account in the UI for write functions requiring ownership

---

Happy building! 🚀
