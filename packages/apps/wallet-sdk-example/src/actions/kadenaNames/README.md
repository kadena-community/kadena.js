# Kadena Names Interaction Module - Advanced Examples

This module demonstrates advanced Kadena Names interactions with the Kadena
blockchain. The functions provided here are **independent of the Wallet SDK**
and are designed purely for **demonstration purposes**. They showcase how to
implement more complex functionalities using `@kadena/client` to interact with
Kadena's Chainweb.

Below is an overview of the functions and their purpose:

---

## Installation

You can install `@kadena/client` using your preferred package manager:

### Using npm

```bash
npm install @kadena/client
```

### Using yarn

```bash
yarn add @kadena/client
```

### Using pnpm

```bash
pnpm add @kadena/client
```

---

### How to Import

To use the Kadena client library, you can import it as shown below (or use other
imports provided by @kadena/client):

```bash
import { Pact } from '@kadena/client';
```

You can then use Pact.builder to create transactions, interact with modules, and
execute commands.

---

## Functions Overview

### **1. `fetchSaleState`**

- **Purpose:** Fetches the sale state of a specific Kadena Name.
- **Inputs:**
  - `name` - The name being queried.
  - `networkId` - The network ID (e.g., `testnet04`, `mainnet01`).
- **Outputs:**
  - `SaleState` - Indicates whether the name is sellable and the associated
    price.
- **Details:** Uses the Kadena blockchain to call the `get-sale-state` function
  in the namespace module, returning the sale status of a given name.

---

### **2. `fetchNameInfo`**

- **Purpose:** Retrieves detailed information about a Kadena Name.
- **Inputs:**
  - `name` - The name being queried.
  - `networkId` - The network ID (e.g., `testnet04`, `mainnet01`).
  - `owner` - The owner's Kadena account.
- **Outputs:**
  - `NameInfo` - Includes availability, sale status, price, market price, and
    expiry details.
- **Details:** Combines data from the Kadena blockchain (`get-name-info` and
  `get-sale-state`) to present comprehensive name details. Expiry dates are also
  validated for availability status.

---

### **3. `fetchPriceByPeriod`**

- **Purpose:** Fetches the registration price for a specific period.
- **Inputs:**
  - `period` - The registration period (e.g., `oneYear`, `threeYears`).
  - `networkId` - The network ID.
  - `owner` - The owner's Kadena account.
- **Outputs:**
  - `number` - The price of registering a Kadena Name for the given period.
- **Details:** Calls the `get-price` function on the blockchain, passing the
  period as an argument.

---

### **4. `createRegisterNameTransaction`**

- **Purpose:** Creates an unsigned transaction to register a Kadena Name.
- **Inputs:**
  - `owner` - The owner's Kadena account.
  - `address` - The address to register the name to.
  - `name` - The name to register.
  - `days` - The duration of the registration.
  - `price` - The price of registration.
  - `networkId` - The network ID.
  - `account` - The sender's account.
- **Outputs:**
  - `IUnsignedCommand` - An unsigned transaction that can be signed and
    submitted.
- **Details:** Builds a transaction that registers a name using Kadena's
  `register` function and adds the necessary capabilities for gas and payment.

---

### **5. `executeCreateRegisterNameTransaction`**

- **Purpose:** Executes the Kadena Name registration process by fetching
  necessary data and creating a transaction.
- **Inputs:**
  - `owner` - The owner's Kadena account.
  - `address` - The address to register the name to.
  - `name` - The name to register.
  - `registrationPeriod` - The desired registration period.
  - `networkId` - The network ID.
  - `account` - The sender's account.
- **Outputs:**
  - `IUnsignedCommand | null` - The generated transaction or null if an error
    occurs.
- **Details:** Combines the logic of `fetchNameInfo`, `fetchPriceByPeriod`, and
  `createRegisterNameTransaction` to streamline the registration process.

---

## Interaction Details

These actions communicate directly with Kadena's Chainweb using the
`@kadena/client` library. The host configuration is defined in the `hostfile`
module:

- **`getClient`**: Generates or retrieves a cached Kadena client for a given
  `networkId`.
- **`getChainIdByNetwork`**: Dynamically determines the appropriate chain ID
  based on the network.
- **`defaultChainwebHostGenerator`**: Constructs the URL for Kadena's Pact API
  endpoints.

---

## Note

These functions are standalone implementations for interacting with Kadena Names
on the Kadena. They are **not part of the Wallet SDK** and are provided to
demonstrate how to handle more advanced features and transactions, such as:

- Fetching state and metadata.
- Handling gas and signing capabilities.
- Constructing and executing custom transactions.

For production use or integration into larger systems, consider combining these
functionalities with Kadena's Wallet SDK or your custom client setup for
enhanced usability.
