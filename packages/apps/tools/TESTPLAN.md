# Test Scenarios

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to outline the test scenarios for the Tools Website following the Scrum framework.

### 1.2 Scope
This document covers high-level test scenarios for Tools Website and is intended to guide the creation of detailed test cases.

## 2. User Stories and Acceptance Criteria

- Home page
  - All elements are correctly displayed on the home page and users can interact with them
- Faucet
  - Users can create new accounts by adding one or multiple public keys and fund 100 coins on all chains on any chain on Testnet.
  - Users can fund existing accounts with 100 coins on any chain on Testnet.
- Transactions
  - Users can track a cross chain transfer by providing a valid request key and see transfer info on the page.

## 3. Test Scenarios

### 3.1 [Home Page/All elements are visible]

#### Scenario 1: On first page load the user can see all elements: Header placed at the top of the page, Side-menu that is initially opened with all available menu options, Right Drawer that is initially closed and opens on clicking the icon, and the main info content is displayed on the page
- **Objective:** To check if a user can see all the elements on the home page and interact with them
- **Preconditions:** Page is loaded at root level without any path-names (e.q. faucet/new)
- **Inputs:** /
- **Expected Outcome:** Main content of the page is loaded correctly with all elements, the user can open/close accordion, click on links and is redirected to the correct location. The main layout elements are present as well: Header has the menu items, theme toggle and network select dropdown; Sidemenu is opened and has all visible options, the user can open and close it, when link icon is clicked the links are visible as menu items; Right drawer is closed and can be opened by clicking on the info icon.


### 3.2 [Faucet / Create and fund new accounts]

#### Scenario 1: Create single key k:account and successfully fund 100 coins
- **Objective:** User can create an account with a valid public key and fund 100 coins to it.
- **Preconditions:** User has a public key already created.
- **Inputs:** User enters a valid key and adds to the list on clicking '+' next to the input.
- **Expected Outcome:** The user enters a valid public key and the account name input is automatically filled with a k:account. The user clicks on the button and after a successful creation and funding, sees a notification that the transfer was successful to the given account.

#### Scenario 2: Get error on entering invalid public key (length validation - 64 characters)
- **Objective:** User cannot create an account with an invalid public key (any key with length different than 64 characters) and fund 100 coins to it.
- **Preconditions:** /
- **Inputs:** User enters an invalid key and adds to the list on clicking '+' next to the input.
- **Expected Outcome:** The user enters an invalid public key and the input shows error status. If the user clicks on the submit button sees a error text to provide valid public key(s) and cannot fund the given account.

#### Scenario 3: Create multi key w:account and successfully fund 100 coins
- **Objective:** User can create an account with multiple valid public keys and fund 100 coins to it.
- **Preconditions:** User has two or more public keys already created.
- **Inputs:** User enters valid keys and adds them to the list on clicking '+' next to the input.
- **Expected Outcome:** The user enters multiple valid public keys and the account name input is automatically filled with a w:account. The user clicks on the button and after a successful creation and funding, sees a notification that the transfer was successful to the given account.

#### Scenario 4: Show error when trying to fund same account on same chain in less than 30 minutes
- **Objective:** User sees error when trying to fund 100 coins to same account on same chain on Testnet.
- **Preconditions:** User has a public key already created.
- **Inputs:** User enters a valid key and adds to the list on clicking '+' next to the input.
- **Expected Outcome:** The user enters a valid public key and the account name input is automatically filled with a k:account. The user clicks on the button and if less than 30 minutes from last funding are passed there's an error displayed.


### 3.3 [Faucet / Fund existing accounts]

#### Scenario 1: Successfully fund 100 coins to an existing account
- **Objective:** User can fund 100 coins to an existing account.
- **Preconditions:** User has an account already created (on the selected chain).
- **Inputs:** User enters a valid account name.
- **Expected Outcome:** The user enters a valid account name. The user clicks on the submit button and after a successful funding, sees a notification that the transfer was successful to the given account.

#### Scenario 2: Get error on entering invalid account name (length validation)
- **Objective:** User cannot fund 100 coins to an invalid account name.
- **Preconditions:** User has an account already created (on the selected chain).
- **Inputs:** User enters an invalid account name.
- **Expected Outcome:** The user enters an invalid account name (less than 3 or more than 256 characters) and the input shows error status. The submit button is disabled at this point.


### 3.4 [Transactions / Track & Trace]

#### Scenario 1: Get info on completed cross chain transfer
- **Objective:** User can get info that the cross chain transfer is complete.
- **Preconditions:** User has a valid request key already created in a specific wallet (like Chainweaver).
- **Inputs:** User enters a valid request key.
- **Expected Outcome:** The user enters a valid request key. The user clicks on the search button and sees information that the cross chain transfer was successful to the given account. On the main panel card with sender and receiver are displayed with info on the accounts and chain, as well as a progress bar with all steps completed.

#### Scenario 2: Get info on an incomplete cross chain transfer
- **Objective:** User can get info that the cross chain transfer is not complete.
- **Preconditions:** User has a valid request key already created in a specific wallet (like Chainweaver).
- **Inputs:** User enters a valid request key.
- **Expected Outcome:** The user enters a valid request key. The user clicks on the search button and sees information that the cross chain transfer was incomplete and funds were not send from sender account to receiver account on different chains. On the main panel card with sender and receiver are displayed with info on the accounts and chain, as well as a progress bar with last two steps not complete. Also, the user will see a 'Finish transaction' link that will redirect to the Cross Chain Transfer Finisher page with the request key prefilled in the input.

#### Scenario 3: Get error on entering invalid request key
- **Objective:** User cannot get info on the cross chain transfer.
- **Preconditions:** User has some request key already created in a specific wallet (like Chainweaver).
- **Inputs:** User enters an invalid request key.
- **Expected Outcome:** The user enters an invalid request key (non-existent) and the input shows error status. There is no info on the transfer on the main panel.

### 3.5 [Transactions / Cross Chain Transfer Finisher]

#### Scenario 1: Successfully finish an incomplete cross chain transfer
- **Objective:** User can finish an incomplete cross chain transfer successfully.
- **Preconditions:** User has a valid request key already created in a specific wallet (like Chainweaver). The transfer is incomplete since the receiving account does not have nay funds on the target chain.
- **Inputs:** User enters a valid request key.
- **Expected Outcome:** The user enters a valid request key and sees information on the cross chain transfer (sender, receiver, gas station account and network data). The user clicks on 'Finish transaction' button and sees information (a notification at the top of the screen) that the cross chain transfer was successful to the given account.

#### Scenario 2: Get error on entering invalid request key
- **Objective:** User cannot get info on the cross chain transfer.
- **Preconditions:** User has some request key already created in a specific wallet (like Chainweaver).
- **Inputs:** User enters an invalid request key.
- **Expected Outcome:** The user enters an invalid request key (non-existent) and the input shows error status. There is no info on the transfer on the main panel.

#### Scenario 3: Get error on an already completed cross chain transfer
- **Objective:** User can get info that the cross chain transfer is completed.
- **Preconditions:** User has a valid request key already created in a specific wallet (like Chainweaver).
- **Inputs:** User enters a valid request key.
- **Expected Outcome:** The user enters a valid request key and sees information on the cross chain transfer (sender, receiver, gas station account and network data). The user clicks on 'Finish transaction' button and sees information (a notification at the top of the screen) that the cross chain transfer has already been completed.


## 4. Test Data

3.2 [Faucet / Create and fund new accounts]
 - Scenario 1: any valid public key
 - Scenario 2: any invalid public key
 - Scenario 3: two or more valid public keys

3.3 [Faucet / Fund existing accounts]
- Scenario 1: valid account name created on the specific chain
- Scenario 2: any invalid account name

3.4 [Transactions / Track & Trace]
- Scenario 1: any valid request key
- Scenario 2: any valid request key
- Scenario 3: any invalid request key

3.4 [Transactions / Cross Chain Transfer Finisher]
- Scenario 1: any valid request key
- Scenario 2: any invalid request key
- Scenario 3: any valid request key


## 5. Dependencies

Identify any dependencies or external factors that may impact the execution of test scenarios.


