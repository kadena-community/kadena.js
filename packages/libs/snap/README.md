# Kadena Snap

This documentation covers the RPC methods provided by the Kadena Snap, allowing interaction with the Kadena blockchain via MetaMask. The Kadena Snap provides methods for checking connection status, managing accounts, interacting with networks, and signing transactions.

<!-- markdownlint-disable MD033 -->
<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>
<!-- markdownlint-enable MD033 -->

---


## Table of Contents

1. [Testing](#testing)
2. [Type Definitions](#type-definitions)
3. [Available RPC Methods](#available-rpc-methods)
   - [kda_checkConnection](#kda_checkconnection)
   - [kda_addAccount](#kda_addaccount)
   - [kda_addHardwareAccount](#kda_addhardwareaccount)
   - [kda_deleteAccount](#kda_deleteaccount)
   - [kda_deleteHardwareAccount](#kda_deletehardwareaccount)
   - [kda_getAccounts](#kda_getaccounts)
   - [kda_getHardwareAccounts](#kda_gethardwareaccounts)
   - [kda_getNetworks](#kda_getnetworks)
   - [kda_storeNetwork](#kda_storenetwork)
   - [kda_deleteNetwork](#kda_deletenetwork)
   - [kda_getActiveNetwork](#kda_getactivenetwork)
   - [kda_setActiveNetwork](#kda_setactivenetwork)
   - [kda_setAccountName](#kda_setaccountname)
   - [kda_setHardwareAccountName](#kda_sethardwareaccountname)
   - [kda_signTransaction](#kda_signtransaction)
4. [Example Usage in a DApp](#example-usage-in-a-dapp)

---

## Testing

The Kadena Snap project includes several tests that cover the majority of its
functions. To test the snap, navigate to this directory and run yarn test. This
command will use
[`@metamask/snaps-jest`](https://github.com/MetaMask/snaps/tree/main/packages/snaps-jest)
to execute the tests found in src/index.test.ts.

---
## Type Definitions

Below are the type definitions used in the Kadena Snap RPC calls. These types help ensure type safety and clarity when working with the RPC methods.

```typescript
type CheckConnectionResponse = boolean;

type SnapAccount = {
  id: string;
  address: string;
  publicKey: string;
  index: number;
  name: string;
};

type CreateAccountResponse = SnapAccount;

type GetAccountsResponse = SnapAccount[];

type DeleteAccountParams = {
  id: string;
};

type DeleteHardwareAccountParams = {
  id: string;
};

type SnapNetwork = {
  name: string;
  networkId: string;
  blockExplorerTransaction: string;
  blockExplorerAddress: string;
  blockExplorerAddressTransactions: string;
  isTestnet: boolean;
  nodeUrl: string;
  transactionListUrl: string;
  transactionListTtl: number;
  buyPageUrl: string;
};

type GetNetworksResponse = SnapNetwork[];

type StoreNetworkParams = {
  network: SnapNetwork;
};

type DeleteNetworkParams = {
  networkId: string;
};

type GetActiveNetworkResponse = string;

type SetActiveNetworkParams = {
  networkId: string;
};

type SetAccountNameParams = {
  id: string;
  name: string;
};

type SetHardwareAccountNameParams = {
  id: string;
  name: string;
};

type SignTransactionParams = {
  id: string;
  transaction: string;
};

type SignTransactionResponse = string;
```

---

## Available RPC Methods

### kda_checkConnection

**Description**: Checks if the Kadena Snap is connected.

**Request Example**:

```javascript
const isConnected = await window.ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: defaultSnapOrigin,
    request: { method: 'kda_checkConnection' },
  },
});
```

**Response**: `CheckConnectionResponse`

---

### kda_addAccount

**Description**: Derives a new account from the Kadena Snap.

**Request Example**:

```javascript
const account = await window.ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: defaultSnapOrigin,
    request: { method: 'kda_addAccount' },
  },
});
```

**Response**: `SnapAccount`

---

### kda_addHardwareAccount

**Description**: Adds a new hardware account from the Kadena Ledger App. NOTE: The Snap doesn't currently support signing with these hardware accounts.

**Request Example**:

```javascript
const account = await window.ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: defaultSnapOrigin,
    request: {
      method: 'kda_addHardwareAccount',
      params: {
        index: 0,
        address: '<address>',
        publicKey: '<publicKey>',
      },
    },
  },
});
```

**Response**: `SnapAccount`

---

### kda_deleteAccount

**Description**: Deletes an account by its ID on Kadena Snap.

**Request Example**:

```javascript
await window.ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: defaultSnapOrigin,
    request: {
      method: 'kda_deleteAccount',
      params: { id: '<id>' },
    },
  },
});
```

**Response**: None

---

### kda_deleteHardwareAccount

**Description**: Deletes a hardware account by its ID on Kadena Snap.

**Request Example**:

```javascript
await window.ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: defaultSnapOrigin,
    request: {
      method: 'kda_deleteHardwareAccount',
      params: { id: '<id>' },
    },
  },
});
```

**Response**: None

---

### kda_getAccounts

**Description**: Retrieves all accounts from the Kadena Snap.

**Request Example**:

```javascript
const accounts = await window.ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: defaultSnapOrigin,
    request: { method: 'kda_getAccounts' },
  },
});
```

**Response**: `SnapAccount[]`

---

### kda_getHardwareAccounts

**Description**: Retrieves all hardware accounts from the Kadena Snap. NOTE: The Snap doesn't currently support signing with these hardware accounts.

**Request Example**:

```javascript
const hardwareAccounts = await window.ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: defaultSnapOrigin,
    request: { method: 'kda_getHardwareAccounts' },
  },
});
```

**Response**: `SnapAccount[]`

---

### kda_getNetworks

**Description**: Retrieves all networks from the Kadena Snap.

**Request Example**:

```javascript
const networks = await window.ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: defaultSnapOrigin,
    request: { method: 'kda_getNetworks' },
  },
});
```

**Response**: `SnapNetwork[]`

---

### kda_storeNetwork

**Description**: Adds a network to the Kadena Snap.

**Request Example**:

```javascript
await window.ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: defaultSnapOrigin,
    request: {
      method: 'kda_storeNetwork',
      params: {
        network: {
          name: 'New Network',
          chainId: 1,
          networkId: 'new-network-id',
          nodeUrl: 'https://new-network-node.url',
          blockExplorerTransaction: 'https://explorer.url/tx/{txId}',
          blockExplorerAddress: 'https://explorer.url/address/{address}',
          isTestnet: true,
        },
      },
    },
  },
});
```

**Response**: `SnapNetwork`

---

### kda_deleteNetwork

**Description**: Deletes a network from the Kadena Snap.

**Request Example**:

```javascript
await window.ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: defaultSnapOrigin,
    request: {
      method: 'kda_deleteNetwork',
      params: { networkId: '<networkId>' },
    },
  },
});
```

**Response**: None

---

### kda_getActiveNetwork

**Description**: Retrieves the active network from the Kadena Snap.

**Request Example**:

```javascript
const activeNetwork = await window.ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: defaultSnapOrigin,
    request: { method: 'kda_getActiveNetwork' },
  },
});
```

**Response**: `GetActiveNetworkResponse`

---

### kda_setActiveNetwork

**Description**: Sets the active network in the Kadena Snap.

**Request Example**:

```javascript
await window.ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: defaultSnapOrigin,
    request: {
      method: 'kda_setActiveNetwork',
      params: { networkId: '<networkId>' },
    },
  },
});
```

**Response**: None

---

### kda_setAccountName

**Description**: Updates the name (or alias) of an account in the Kadena Snap.

**Request Example**:

```javascript
await window.ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: defaultSnapOrigin,
    request: {
      method: 'kda_setAccountName',
      params: {
        id: '<id>',
        name: 'New Account Name',
      },
    },
  },
});
```

**Response**: None

---

### kda_setHardwareAccountName

**Description**: Updates the name (or alias) of a hardware account in the Kadena Snap. 

**Request Example**:

```javascript
await window.ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: defaultSnapOrigin,
    request: {
      method: 'kda_setHardwareAccountName',
      params: {
        id: '<id>',
        name: 'New Hardware Account Name',
      },
    },
  },
});
```

**Response**: None

---

### kda_signTransaction

**Description**: Signs a transaction using the Kadena Snap.

**Request Example**:

```javascript
const signature = await window.ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: defaultSnapOrigin,
    request: {
      method: 'kda_signTransaction',
      params: {
        id: '<id>',
        transaction: '<Transaction Payload>',
      },
    },
  },
});
```

**Response**: `SignTransactionResponse`

---

## Example Usage in a DApp

To leverage these RPC methods in a React application, you can implement a custom hook, such as `useKadenaSnap`. This hook provides an interface for using the RPC methods within the React component lifecycle.

```typescript
import { useState } from 'react';
import { SnapAccount, SnapNetwork } from '../types';
import { defaultSnapOrigin } from '../config/snap';

export default function useKadenaSnap() {
  const [connected, setConnected] = useState<boolean>(false);

  const checkConnection = async (): Promise<boolean> => {
    try {
      const isConnected = await window.ethereum.request<boolean>({
        method: 'wallet_invokeSnap',
        params: {
          snapId: defaultSnapOrigin,
          request: { method: 'kda_checkConnection' },
        },
      });
      setConnected(isConnected !== undefined && isConnected !== null);
      return isConnected ?? false;
    } catch (error) {
      console.error('Error checking connection:', error);
      return false;
    }
  };

  const addAccount = async (): Promise<SnapAccount> => {
    try {
      const response = await window.ethereum.request<SnapAccount>({
        method: 'wallet_invokeSnap',
        params: {
          snapId: defaultSnapOrigin,
          request: { method: 'kda_addAccount' },
        },
      });

      if (
        !response ||
        !response.address ||
        !response.publicKey ||
        typeof response.index !== 'number' ||
        !response.name
      ) {
        throw new Error('Account creation failed: Missing essential data');
      }

      return response as SnapAccount;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  };

  const getAccounts = async (): Promise<SnapAccount[]> => {
    try {
      const accounts = await window.ethereum.request<
        (SnapAccount | undefined)[]
      >({
        method: 'wallet_invokeSnap',
        params: {
          snapId: defaultSnapOrigin,
          request: { method: 'kda_getAccounts' },
        },
      });

      if (!accounts) {
        throw new Error('No accounts returned from Kadena snap');
      }

      return accounts.filter(
        (account): account is SnapAccount => account !== undefined,
      );
    } catch (error) {
      console.error('Error getting accounts:', error);
      return [];
    }
  };

  const getNetworks = async (): Promise<SnapNetwork[]> => {
    try {
      const networks = await window.ethereum.request<
        (SnapNetwork | undefined)[]
      >({
        method: 'wallet_invokeSnap',
        params: {
          snapId: defaultSnapOrigin,
          request: { method: 'kda_getNetworks' },
        },
      });

      return (networks ?? []).filter(
        (network): network is SnapNetwork => !!network,
      );
    } catch (error) {
      console.error('Error getting networks:', error);
      return [];
    }
  };

  const addNetwork = async (
    network: Partial<SnapNetwork>,
  ): Promise<Partial<SnapNetwork>> => {
    try {
      const newNetwork = await window.ethereum.request<SnapNetwork>({
        method: 'wallet_invokeSnap',
        params: {
          snapId: defaultSnapOrigin,
          request: {
            method: 'kda_storeNetwork',
            params: {
              network: {
                name: network.name!,
                chainId: network.chainId!,
                networkId: network.networkId!,
                nodeUrl: network.nodeUrl!,
                blockExplorerTransaction: network.blockExplorerTransaction!,
                blockExplorerAddress: network.blockExplorerAddress!,
                blockExplorerAddressTransactions:
                  network.blockExplorerAddressTransactions!,
                isTestnet: network.isTestnet!,
                transactionListUrl: network.transactionListUrl!,
                transactionListTtl: network.transactionListTtl!,
                buyPageUrl: network.buyPageUrl!,
              },
            },
          },
        },
      });

      if (!newNetwork) {
        throw new Error('Failed to add network: No network returned');
      }

      return newNetwork;
    } catch (error) {
      console.error('Error adding network:', error);
      throw error;
    }
  };

  const deleteNetwork = async (networkId: string): Promise<void> => {
    try {
      await window.ethereum.request<void>({
        method: 'wallet_invokeSnap',
        params: {
          snapId: defaultSnapOrigin,
          request: {
            method: 'kda_deleteNetwork',
            params: { networkId },
          },
        },
      });
    } catch (error) {
      console.error('Error deleting network:', error);
      throw error;
    }
  };

  const signMessage = async (
    id: string,
    transaction: string,
  ): Promise<string> => {
    try {
      const signature = await window.ethereum.request<string | undefined>({
        method: 'wallet_invokeSnap',
        params: {
          snapId: defaultSnapOrigin,
          request: {
            method: 'kda_signTransaction',
            params: { id, transaction },
          },
        },
      });
      if (!signature) {
        throw new Error('Signing failed');
      }
      return signature.toString().replace('0x', '');
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw error;
    }
  };

  return {
    connected,
    checkConnection,
    addAccount,
    getAccounts,
    getNetworks,
    addNetwork,
    deleteNetwork,
    signMessage,
  };
}
```
