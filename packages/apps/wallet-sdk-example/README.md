# Wallet SDK Example App

The Wallet SDK Example App is a comprehensive showcase of the features and
capabilities of the 
[Kadena Wallet SDK](https://github.com/kadena-community/kadena.js/blob/main/packages/libs/wallet-sdk).
This app is designed to provide developers with an interactive platform to
explore, understand, and experiment with every function of the SDK.

## **Features**

- **Function Demonstrations**: Every function of the Wallet SDK is demonstrated,
  including examples of:

  - Transaction creation.
  - Account querying.
  - Transfers
  - Cross-chain transfers.
  - Gas estimation.
  - Human Readible Name Resolving

- **Live Code Execution**: Each function displays:
  - The code being executed.
  - The real-time response from the Kadena network.
  - The real-time response from the Kadena Graph
- **Code Highlighter**: Interactive code snippets are highlighted for better
  understanding.
- **Step-by-Step Guidance**: Navigate the app to learn how to implement each
  feature of the Wallet SDK.

---

## **Getting Started**

### **Prerequisites**

Ensure you have the following installed:

- **Node.js** (v16 or later)
- **Yarn** or **npm**
- A modern browser (Chrome, Firefox, etc.)

### **Installation**

1. Clone the repository:

   ```bash
   git clone https://github.com/kadena-community/kadena.js.git
   cd kadena.js/packages/apps/wallet-sdk-example
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm run dev
   ```

4. Open the app in your browser:
   ```bash
   http://localhost:3000
   ```

---

## **Usage**

1. Launch the app in your browser.
2. Explore the features:
   - Select a option from the navigation menu.
   - View the code example and corresponding response.
   - Modify inputs (where applicable) to test custom scenarios.
3. Use the app as a guide to integrate Wallet SDK functions into your own
   projects.

---

## **Technical Details**

This app is built using:

- **React** for the UI.
- **TypeScript** for type safety.
- **Vite** for fast builds and development.
- **Kadena Wallet SDK** for blockchain interactions.

---

## **Development**

To extend or modify or play with the app:

1. Open the project in your favorite IDE.
2. Navigate to the `src` folder to explore the codebase:
   - `components/`: Reusable React components.
   - `pages/`: Main pages showcasing the SDK functions.
   - `utils/`: Utility functions for interacting with the SDK.
3. Add new features or update existing examples as needed.

---

## **Contributing**

Contributions are welcome! If you'd like to improve the app or add new features,
please:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push your changes and create a pull request.

---

## **License**

This project is licensed under the BSD 3-Clause License. See the
[LICENSE](https://github.com/kadena-community/kadena.js/LICENSE) file for
details.

---

## **Resources**

- [Kadena Wallet SDK Documentation](https://github.com/kadena-community/kadena.js/tree/feat/wallet-sdk-interface/packages/libs/wallet-sdk/README.md)
- [Kadena Official Documentation](https://docs.kadena.io/)
- [Kadena GitHub Repository](https://github.com/kadena-io/)

---

Happy coding! 🎉
