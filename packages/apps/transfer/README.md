# Kadena Transfer App

This repository contains the source code and documentation for the Kadena Transfer App, a decentralized application (dApp) built on the Kadena blockchain platform. The Kadena Transfer App allows users to transfer digital assets securely and efficiently using smart contracts on the Kadena blockchain.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install and run the Kadena Transfer App locally, follow these steps:

1. Clone the repository: [https://github.com/kadena-community/kadena.js](https://github.com/kadena-community/kadena.js)

2. Navigate to the `kadena-transfer/packages/apps/transfer` directory:

```bash
cd kadena.js/kadena-transfer/packages/apps/transfer
```

3. Install rush globally:

Note: On Windows, run in PowerShell as Administrator and restart the terminal after installation.

```bash
npm install --global @microsoft/rush
```

4. Install the dependencies:

```bash
rush install
```

5. Build the app and its dependencies:

```bash
rush build -t @kadena/transfer
```

6. Start the app:

```bash
rushx dev
```

The Kadena Transfer App will be accessible at [http://localhost:3000](http://localhost:3000) in your web browser.

## Usage

The project provides a set of functionalities that enable users to interact with a blockchain network. The main features of the project include:

1. **Keypair Generation**: The project allows users to generate a keypair consisting of a public key and a private key using the SHA256 algorithm. This feature is useful for cryptographic operations and identity management within the blockchain network.

2. **Account Balance Checking**: Users can check the balance of their blockchain account. By providing their account address, the project retrieves and displays the current balance associated with that account. This feature allows users to monitor their account's financial status.

3. **Coin Transfer**: The project facilitates the transfer of coins between different accounts within the blockchain network. Users can initiate a transfer by specifying the recipient's account address and the amount of coins to be transferred. This feature ensures secure and efficient transfer of digital assets.

4. **Module Explorer**: The project includes a module explorer that provides visibility into the blockchain network. Users can explore and examine all the blocks and transactions recorded on the blockchain. This feature enables users to gain insights into the network's activities and verify the integrity of the blockchain.

5. **Create New Account**: This functionality allows users to create a new account within the blockchain network and add coins to it. Users can generate a new keypair (public and private key) that will serve as the account's identity. The generated account can then receive coins from other accounts or through mining. This feature enables users to establish new accounts and initialize them with a certain amount of coins, which can be used for various purposes within the blockchain network.

6. **Existing Account**: With this feature, users can add additional coins to an existing account within the blockchain network. By specifying the recipient's account address and the amount of coins to be added, the system will update the account's balance accordingly. This feature allows users to top-up their existing accounts, increase their holdings, or perform any necessary adjustments to the coin balance of a specific account. It provides flexibility in managing the coin distribution across accounts and supports the seamless flow of digital assets within the blockchain ecosystem.

Together, these features empower users to interact with the blockchain network, manage their identities, monitor account balances, transfer digital assets, and explore the blockchain's data.

## Contributing

Contributions to the Kadena Transfer App are welcome! If you find a bug, have a feature request, or want to contribute code, please follow these steps:

1. [Report the issue or feature request](https://github.com/kadena-community/kadena.js/issues/new/choose)

2. Fork the repository.

3. Create a new branch for your feature or bug fix:

```bash
git checkout -b feat/your-feature-name
```

or

```bash
git checkout -b fix/your-bug-fix
```

4. Make the necessary changes and commit them.

5. Push your branch to your forked repository.

6. Create a pull request against the `kadena-community/kadena.js` repository, explaining the purpose of your changes.

7. Wait for a review and address any feedback given.

Thank you for contributing to the Kadena Transfer App!

## License

The Kadena Transfer App is licensed under the [MIT License](https://github.com/kadena-community/kadena.js/blob/kadena-transfer/packages/apps/transfer/LICENSE). Please refer to the `LICENSE` file for more information.
