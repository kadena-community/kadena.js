<<<<<<< HEAD
# Marmalade Marketplace

Marmalade Marketplace is a showcase app for @kadena/client-utils

<!-- markdownlint-disable MD033 -->
<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>
<!-- markdownlint-enable MD033 -->

## Getting Started

This guide will help you set up your local development environment and get your project up and running.

### Prerequisites

- Node.js and `pnpm` installed on your machine
- A Firebase project set up
- A Firestore database created in your Firebase project
- Graph project set up and running (if working with devnet)

### Setup

Follow these steps to set up your local development environment:

1. **Clone the Repository**

```bash
git clone https://github.com/kadena-community/kadena.js.git
cd kadena.js
```

2. **Install Dependencies**

```bash
pnpm install
```

3. **Build Dependencies**

```bash
pnpm build
```

4. **Navigate to Marmalade Marketplace**

```bash
cd packages/apps/marmalade-marketplace
```

5. **Create Your Firebase Database**

- Go to the Firebase Console.
- Create a new project (or use an existing one).
- Create a Firestore database in your project.
- Generate a service account key and download the JSON file.

6. **Add Environment Variables**

Create a .env file in the root of the project from .env.example file and modify the following environment variables:

```bash
NEXT_PUBLIC_FB_APIKEY="your-api-key"
NEXT_PUBLIC_FB_DBURL="your-database-url"
NEXT_PUBLIC_FB_PROJECTID="your-project-id"
NEXT_PUBLIC_FB_APPID="your-app-id"
```

7. **Set Up Firebase Indexes**

Make sure you have [`firebase` CLI](https://www.npmjs.com/package/firebase-tools) installed.

First, log in to your Firebase account locally:

```bash
firebase login
```

And if this is your first time setting up, run the following command to link your Firebase project:

```bash
firebase init
```

Then, run the following command to deploy Firestore indexes:

```bash
firebase deploy --only firestore:indexes
```

This command will ensure that your Firestore indexes are configured correctly.

8. **Set Up and Run Graph Project (If Working with devnet)**

If you are working with `devnet`, make sure your local graph project is all set up and running.

[Instructions](../graph/README.md)

### Running the Project

Once you have completed the setup steps, you can start your local development server:

```bash
pnpm dev
```

### Indexer

There are three environment variables to control the indexer job:

```bash
# what chains to index
NEXT_PUBLIC_CHAIN_IDS="0,1"

# what events to index
NEXT_PUBLIC_EVENTS="marmalade-v2.ledger.OFFER,marmalade-v2.ledger.SALE,..."

# this one is optional and used if you don't need to index whole blockchain
NEXT_PUBLIC_START_BLOCK=800
```

To start the indexer cron job, run the following command in a new terminal:

```bash
pnpm start:cron
```

This will emulate vercel cron job. It will read from the `vercel.json` file and execute all cron jobs defined on a schedule.

Note: If you get `permissions denied` while running the cron job, make sure that you allowed access to your firestore database

=======
>>>>>>> 30217ff8ec9c62a179b77a6afde2fdbb740a97e3

