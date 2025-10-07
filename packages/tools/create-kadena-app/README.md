# Kadena dApp Template – Local Link Guide

This repository contains a CLI plus a ready-to-use `template/` (contracts + frontend).
Follow these steps to download the repo and link it locally so you can use the CLI.

---

## Prerequisites

- Node.js 18+ and npm
- Git

Optional:

- Docker (needed later to run the devnet inside the template)

---

## 1) Clone and install

```bash
git clone <this-repo-url> kadena-trial
cd kadena-trial
npm install
```

---

## 2) Build the CLI

```bash
npm run build
```

This compiles the CLI to `dist/` and copies `template/` alongside it.

---

## 3) Link globally

```bash
npm link
```

This makes the `create-kadena` command available on your system.

Verify:

```bash
create-kadena --help
```

---

## 4) Scaffold a new project (using the linked CLI)

```bash
mkdir my-kadena-app && cd my-kadena-app
create-kadena
```

The CLI will scaffold a new project using the bundled `template/`.
After creation, follow the new project’s README for setup and commands.

---

## Alternative: Use the template directly (without the CLI)

You can also work straight from the `template/` folder in this repo:

- Read `template/README.md` first
- Then follow the quick start there to:
  - Install `contracts` and `frontend` dependencies
  - Start the devnet
  - Create a dev account
  - Deploy the contract
  - Run the Next.js UI

---

## Unlink (optional)

If you want to remove the globally linked CLI:

```bash
npm unlink -g create-kadena
```

---

Need help? See `template/README.md` for end-to-end usage of the contracts and frontend.
