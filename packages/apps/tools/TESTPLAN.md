# Test Scenarios

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to outline the test scenarios for the Tools Website following the Scrum framework.

### 1.2 Scope
This document covers high-level test scenarios for Tools Website and is intended to guide the creation of detailed test cases.

## 2. User Stories and Acceptance Criteria

List the relevant user stories and their acceptance criteria that will be used to derive test scenarios.
- Home page
  - All elements are correctly displayed on the home page and users can interact with them
- Faucet
  - Users can create new accounts by adding one or multiple public keys and fund 100 coins on all chains on any chain on Testnet.
  - Users can fund existing accounts with 100 coins on any chain on Testnet.

## 3. Test Scenarios

### 3.1 [Home Page/All elements are visible]

#### Scenario 1: On first page load the user can see all elements: Header placed at the top of the page, Side-menu that is initially opened with all available menu options, Right Drawer that is initially closed and opens on clicking the icon, and the main info content on the 
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

#### Scenario 2: Get error on entering invalid public key (length validation)
- **Objective:** User cannot create an account with an invalid public key and fund 100 coins to it.
- **Preconditions:** /
- **Inputs:** User enters an invalid key and adds to the list on clicking '+' next to the input.
- **Expected Outcome:** The user enters an invalid public key and the input shows error status. If the user clicks on the submit button sees a error text to provide valid public key(s) and cannot fund the given account.

#### Scenario 3: Create multi key w:account and successfully fund 100 coins
- **Objective:** User can create an account with multiple valid public keys and fund 100 coins to it.
- **Preconditions:** User has two or more public keys already created.
- **Inputs:** User enters valid keys and adds them to the list on clicking '+' next to the input.
- **Expected Outcome:** The user enters multiple valid public keys and the account name input is automatically filled with a w:account. The user clicks on the button and after a successful creation and funding, sees a notification that the transfer was successful to the given account.

#### Scenario 4: Get notification when error happens during transfer
- **Objective:** User gets notification with error status that includes the error message if the transfer is unsuccessful.
- **Preconditions:** User has one or more public keys already created.
- **Inputs:** User enters (one or more) public key(s) and adds to the list on clicking '+' next to the input. The account name is auto generated. The user selects a chain.
- **Expected Outcome:** The user enters (one or more) public key(s) and selects chain to which an account will be created and funds will be added. An error happens and the user sees a notification displaying the error message.


### 3.3 [Faucet / Fund existing accounts]

#### Scenario 1: Successfully fund 100 coins to an existing account
- **Objective:** User can fund 100 coins to an existing account.
- **Preconditions:** User has an account already created.
- **Inputs:** User enters a valid account name.
- **Expected Outcome:** The user enters a valid account name. The user clicks on the submit button and after a successful funding, sees a notification that the transfer was successful to the given account.

#### Scenario 2: Get error on entering invalid account name (length validation)
- **Objective:** User cannot fund 100 coins to an invalid account name.
- **Preconditions:** User has an account already created.
- **Inputs:** User enters an invalid account name.
- **Expected Outcome:** The user enters an invalid account name and the input shows error status. The submit button is disabled at this point.

#### Scenario 4: Get notification when error happens during transfer
- **Objective:** User gets notification with error status that includes the error message if the transfer is unsuccessful.
- **Preconditions:** User has an account already created.
- **Inputs:** User enters (one or more) public key(s) and adds to the list on clicking '+' next to the input. The account name is auto generated. The user selects a chain.
- **Expected Outcome:** The user enters an account name. The user clicks on the submit button. An error happens and the user sees a notification displaying the error message.


## 4. Test Data

Specify the test data required for each scenario, including both valid and invalid inputs.

## 5. Dependencies

Identify any dependencies or external factors that may impact the execution of test scenarios.


