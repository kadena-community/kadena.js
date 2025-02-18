import type { IAddContractProps } from '../createContract';

export const getContract = ({ contractName, namespace }: IAddContractProps) => `
(namespace "${namespace}")

(module ${contractName} GOV
  "\`${contractName}\` an example real-world asset (RWA) token, which extends fungible-v2        \
  \ and provides mint, burn, forced-transfer, freezing of entire contract or investors.  \
  \ The example also implements agent-role, and identity registry features, but does not \
  \ implement the identity verification. "

  (defconst GOV-KEYSET:string "${namespace}.admin-keyset")

  (defcap GOV () (enforce-keyset GOV-KEYSET))

  (implements fungible-v2)
  (implements RWA.real-world-asset-v1)
  (implements RWA.agent-role-v1)
  (implements RWA.identity-registry-v1)
  (implements RWA.compliance-compatible-v1)

  (use fungible-v2 [account-details])
  (use RWA.compliance-compatible-v1 [compliance-parameters-input compliance-info])
  (use RWA.burn-wallet)

  (defconst TOKEN-ID:string "${namespace}.${contractName}" "Token ID")
  (defconst VERSION:string "0.0")
  (defconst MINIMUM-PRECISION:integer 0 "Minimum allowed precision for token transactions")

  (defconst AGENT-ADMIN:string "agent-admin")
  (defconst FREEZER:string "freezer")
  (defconst TRANSFER-MANAGER "transfer-manager")

  (defconst AGENT-ROLES:[string]
    [AGENT-ADMIN FREEZER TRANSFER-MANAGER] )

  (defschema token-info
    @doc "Saves token metadata information"
    name:string
    symbol:string
    kadenaID:string
    decimals:integer
    compliance:[module{RWA.compliance-v1}]
    paused:bool
    supply:decimal
    owner-guard:guard
  )

  (defschema account-balance-change
    @doc "For use in RECONCILE events"
    account:string
    previous:decimal
    current:decimal
  )

  (defschema investor-info
    @doc "Investor information"
    account:string
    balance:decimal
    guard:guard
    frozen:bool
    amount-frozen:decimal
  )

  (defschema agent-schema
    @doc "Agent information"
    roles:[string]
    guard:guard
    active:bool
  )

  (defschema identity-schema
    @doc "Investor identity information"
    kadenaID:string
    country:integer
    active:bool
  )

  (deftable token:{token-info})
  (deftable investors:{investor-info})
  (deftable agents:{agent-schema})
  (deftable identities:{identity-schema})
  (deftable compliance-parameters:{compliance-info})

  ; ----------------------------------------------------------------------
  ; Caps

  (defcap ONLY-AGENT:bool (role:string)
    @doc "Capability that can be required to validate if an address is an agent with required role"
    @managed
    (enforce-agent (read-string "agent") role)
  )

  (defcap ONLY-OWNER:bool (role:string)
    @doc "Capability that can be required to validate if an address is an agent"
    @managed
    (with-read token "" {"owner-guard":=guard}
      (enforce-guard guard)
    )
  )

  (defcap DEBIT (sender:string)
    @doc "Capability for managing debiting operations"
    (enforce (!= sender "") "ACC-PRT-003"))

  (defcap CREDIT (receiver:string)
    @doc "Capability for managing crediting operations"
    (enforce (!= receiver "") "ACC-PRT-003"))

  (defun TRANSFER-mgr:decimal
    ( managed:decimal
      requested:decimal
    )
    @doc "Ensures that the sum of transfer amounts in the requested transaction \
    \ does not exceed the managed amount."
    (let ((newbal (- managed requested)))
      (enforce (>= newbal 0.0)
        (format "TRF-MGR-001: {}" [managed]))
      newbal)
  )

  (defcap TRANSFER:bool
    ( sender:string
      receiver:string
      amount:decimal
    )
    @doc "Transfers tokens between two accounts. Ensures both accounts are compliant and unfrozen."
    @managed amount TRANSFER-mgr
    (enforce-unit amount)
    (enforce (> amount 0.0) "TRF-AMT-002")
    (enforce-one "TRF-CAP-001" [
      (enforce-guard (at 'guard (read investors sender)))
      (enforce  (try false (require-capability (MINT))) "TRF-MINT-001")
      (enforce  (try false (require-capability (BURN))) "TRF-BURN-001")
      (enforce  (try false (require-capability (FORCED-TRANSFER))) "TRF-FRC-001")
      ])
    (enforce (!= sender "") "ACC-PRT-003")
    (enforce (!= sender receiver) "TRF-ACC-001")
    (compose-capability (DEBIT sender))
    (compose-capability (CREDIT receiver))
  )

  (defcap UPDATED-TOKEN-INFORMATION:bool (new-name:string new-symbol:string new-decimals:integer new-version:string new-kadenaID:string)
    @doc "Event emitted when token information is updated."
    @event
    true
  )

  (defcap IDENTITY-REGISTRY-ADDED:bool (identity-registry:module{RWA.identity-registry-v1})
    @doc "Event emitted when an identity registry is added."
    @event
    true
  )

  (defcap COMPLIANCE-UPDATED:bool (compliance:[module{RWA.compliance-v1}])
    @doc "Event emitted when a compliance is updated"
    @event
    true
  )

  (defcap COMPLIANCE-PARAMETERS:bool (compliance:object{compliance-parameters-input})
    @doc "Event emitted when a compliance parameters is updated."
    @event
    true
  )

  (defcap RECOVERY-SUCCESS:bool (lost-wallet:string new-wallet:string investor-kadenaID:string)
    @doc "Event emitted when a recovery process is successful."
    @event
    true
  )

  (defcap ADDRESS-FROZEN:string (investor-address:string is-frozen:bool)
    @doc "Event emitted when an address is frozen."
    @event
    true
  )

  (defcap TOKENS-FROZEN:string (investor-address:string amount:decimal)
    @doc "Event emitted when tokens are frozen."
    @event
    true
  )

  (defcap TOKENS-UNFROZEN:string (investor-address:string amount:decimal)
    @doc "Event emitted when tokens are unfrozen."
    @event
    true
  )

  (defcap PAUSED:string ()
    @doc "Event emitted when the contract is paused."
    @event
    true
  )

  (defcap UNPAUSED:string ()
    @doc "Event emitted when the contract is unpaused."
    @event
    true
  )

  (defcap AGENT-ROLES-UPDATED:bool (investor-address:string roles:[string])
    @doc "Event emitted when agent role is updated"
    @event
    true
  )

  (defcap OWNERSHIP-TRANSFERRED:bool (old-owner-guard:guard new-owner-guard:guard )
    @doc "Event emitted when ownership of the contract is transferred"
    @event
    true
  )

  (defcap AGENT-ADDED:bool (agent:string)
    @doc "Event emitted when an agent is added."
    @event
    true
  )

  (defcap AGENT-REMOVED:bool (agent:string)
    @doc "Event emitted when an agent is removed."
    @event
    true
  )

  (defcap SUPPLY:decimal (supply:decimal)
    @doc "Event emitted when supply is changed."
    @event
    supply
  )

  (defcap IDENTITY-REGISTERED:bool (investor-address:string investor-guard:guard investor-identity:string)
    @doc "Event emitted when identity is added"
    @event
    true
  )

  (defcap IDENTITY-REMOVED:bool (investor-address:string investor-identity:string)
    @doc "Event emitted when identity is removed"
    @event
    true
  )

  ;; grant caps

  (defcap INTERNAL:bool ()
    @doc "Capability to guard functions for internal operations"
    true
  )

  (defcap MINT:bool ()
    @doc "Capability to guard functions for mint operations"
    true
  )

  (defcap BURN:bool ()
    @doc "Capability to guard functions for mint operations"
    true
  )

  (defcap FORCED-TRANSFER:bool ()
    @doc "Capability to guard functions for forced-transfer operations"
    true
  )

  (defcap UPDATE-SUPPLY:bool ()
    @doc "Capability to guard functions for update-supply operations"
    true
  )

  (defcap RECONCILE:bool
    ( amount:decimal
      sender:object{account-balance-change}
      receiver:object{account-balance-change}
    )
    @doc " For accounting via events. \
         \ sender = {account: '', previous: 0.0, current: 0.0} for mint \
         \ receiver = {account: '', previous: 0.0, current: 0.0} for burn"
    @event
    true
  )

  (defun init (name:string symbol:string decimals:integer kadenaID:string compliances:[module{RWA.compliance-v1}] paused:bool owner-guard:guard)
    @doc "Initiates token with supplied informations and owner guard"
    (with-capability (GOV)
      (let ((default-compliance-parameters:object{compliance-parameters-input} 
         { "max-balance-per-investor": -1.0
          ,"supply-limit": -1.0
          ,"max-investors": -1
          }))
      (insert token "" {
          "name": name,
          "symbol":symbol,
          "kadenaID":kadenaID,
          "compliance":compliances,
          "decimals":decimals,
          "paused":false,
          "supply": 0.0,
          "owner-guard": owner-guard
        })
      (insert compliance-parameters ""
        (+ {"investor-count": 0 } default-compliance-parameters))
      (emit-event (UPDATED-TOKEN-INFORMATION name symbol MINIMUM-PRECISION VERSION kadenaID ))
      (emit-event (COMPLIANCE-UPDATED compliances))
      (emit-event (COMPLIANCE-PARAMETERS default-compliance-parameters)) 
    )
    )
  )

  (defun contains-identity:bool (investor-address:string)
    @doc "Checks whether a wallet has its Identity registered or not in the Identity Registry.           \
    \ Returns 'true' if the address is contained in the Identity Registry, 'false' if not."
    (with-default-read identities investor-address
      { "active": false }
      { "active":= active }
      active
    )
  )

  (defun enforce-contains-identity:bool (account:string)
    @doc "Enforce that the provided account has an identity registered in the system."
    (let ((r (contains-identity account)))
      (enforce r "IDR-001"))
  )

  (defun enforce-agent:bool (agent:string role:string)
    @doc "Checks that agent has the valid role for the transaction"
    (with-read agents agent {
      "guard":= guard,
      "roles":= roles,
      "active":= active
      }
      (enforce active "ROL-STS-002")
      (enforce (contains role roles) "ROL-STS-003")
      (enforce-guard guard)
    )
  )

  (defun verify-agent-roles:bool (roles:[string])
    @doc "Verify that all roles in the provided list exist in the predefined agent roles."
    (if (= (length roles) 0)
      true
      (map (lambda (role:string)
        (enforce (contains role AGENT-ROLES)
          (format "ROL-002: {}" [role]))
      ) roles)
    )
    true
  )

  (defun enforce-unit:bool (amount:decimal)
    @doc "Enforce minimum precision allowed for coin transactions"
    (enforce
      (= (floor amount MINIMUM-PRECISION)
        amount)
      (format "AMT-001: {}" [amount]))
  )

  (defun enforce-unfrozen (sender:string)
    @doc "Fail if sender is frozen"
    (let ((frozen:bool (address-frozen sender)))
      (enforce (not frozen) "ACC-FRZ-001")
    )
  )

  (defun paused:bool ()
    @doc "Check if the contract is paused."
    (with-read token "" {"paused" := paused } paused)
  )

  (defun address-frozen:bool (investor-address:string)
    @doc "Check if an investor address is frozen."
    (with-read investors investor-address {
      "frozen" := frozen
      }
      frozen
  ))

  (defun get-frozen-tokens:decimal (investor-address:string)
    @doc "Return the number of frozen tokens for an investor."
    (with-read investors investor-address {
      "frozen" := frozen,
      "amount-frozen":= amount-frozen,
      "balance":= balance
      }
      (if frozen 0.0 amount-frozen)
    )
  )

  (defun enforce-unfrozen-amount:bool
    ( account:string
      amount:decimal
    )
    (with-read investors account
      { "frozen" := frozen,
        "amount-frozen" := amount-frozen,
        "balance" := balance
      }
      (enforce (not frozen) "ACC-FRZ-001")
      (enforce (>= (- balance amount-frozen) amount) "ACC-AMT-001")
    )
  )

  (defun only-agent:bool (role:string)
    @doc "Verifies that the agent is signing for the capability"
    (with-capability (ONLY-AGENT role)
      true
    )
  )

  (defun only-owner:bool (role:string)
    @doc "Verifies that the owner is signing for the capability"
    (with-capability (ONLY-OWNER role)
      true
    )
  )

  (defun only-owner-or-agent-admin:bool ()
    @doc "Ensures that the caller is either the owner or an agent with the \`agent-admin\` role. \
    \ This function installs both the \`ONLY-OWNER\` and \`ONLY-AGENT\` capabilities, enforcing at least one of them."
    (install-capability (ONLY-OWNER ""))
    (install-capability (ONLY-AGENT AGENT-ADMIN))
    (enforce-one "ROL-001" [
      (only-owner "")
      (only-agent AGENT-ADMIN)
    ])
    true
  )

  ;
  ;; fungible-v2 implementation
  ;
  (defun credit:object{account-balance-change}
    ( account:string
      amount:decimal
    )
    @doc "Credits the requested account. If the account balance is zero, increments \
    \ the investor count. Protected by the \`CREDIT\` capability."
    (require-capability (CREDIT account))
    (with-default-read investors account
      { "balance": 0.0 }
      { "balance":= balance}
      (if (= account (zero-address))
        "Credit to Zero Address"
        (update investors account
          { "balance" : (+ balance amount)})
      )
      (if (and (= balance 0.0) (!= account (zero-address)))
        (with-capability (INTERNAL)
          (add-investor-count)
        )
        "already existing investor"
      )
      {'account: account, 'previous: balance, 'current: (+ balance amount)}
  ))

  (defun debit:object{account-balance-change}
    ( account:string
      amount:decimal
    )
    @doc "Debits the requested account by a specified amount. If the account balance becomes zero after the debit, \
       \ it decrements the investor count. Protected by the \`DEBIT\` capability."
    (require-capability (DEBIT account))
    (with-read investors account
      { "balance" := balance }
      (enforce (<= amount balance) "ACC-AMT-001")
      (if (= account (zero-address))
        "Debit to Zero Address"
        (if (= (- balance amount) 0.0)
          (with-capability (INTERNAL)
            (remove-investor-count)
          )
          "already existing investor"
        )
      )
      (update investors account
        { "balance" : (- balance amount) }
      )
     {'account: account, 'previous: balance, 'current: (- balance amount)}
  ))

  ;; internal functions

  (defun mint-internal:bool (to:string amount:decimal)
    @doc "Mint tokens from an investor's address according to create rules in compliance"
    (with-read token "" {
      "compliance":= compliance-l:[module{RWA.compliance-v1}]
      }
      (map (lambda (compliance:module{RWA.compliance-v1})
         (compliance::created TOKEN-ID to amount)
        ) compliance-l
      )
      (enforce-contains-identity to)
      (with-capability (TRANSFER (zero-address) to amount)
        (let
          (
            (receiver (credit to amount))
            (sender:object{account-balance-change}
              {'account: "", 'previous: 0.0, 'current: 0.0})
          )
          (emit-event (RECONCILE amount sender receiver))
        )
        (with-capability (UPDATE-SUPPLY)
          (update-supply amount)
        )
      )
    )
    true
  )

  (defun burn-internal:bool (investor-address:string amount:decimal)
    @doc "Burn tokens from an investor's address according to destroy rules in compliance"
    (with-read token "" {
      "compliance":=compliance-l
      }
      (with-read token "" {
        "compliance":=compliance-l
        }
        (map (lambda (compliance:module{RWA.compliance-v1})
            (compliance::destroyed TOKEN-ID investor-address amount)
          ) compliance-l
        )
        (with-capability (TRANSFER investor-address (zero-address) amount)
          (let
              (
                (sender (debit investor-address amount))
                (receiver:object{account-balance-change}
                  {'account: "", 'previous: 0.0, 'current: 0.0})
              )
            (emit-event (RECONCILE amount sender receiver))
          )
          (credit (zero-address) amount)
          (with-capability (UPDATE-SUPPLY)
            (update-supply (- amount))
          )
        )
      )
    )
    true
  )

  (defun transfer-internal:string
    ( sender:string
      receiver:string
      amount:decimal
    )
    @doc "Transfer AMOUNT of token from sender to receiver. Validates can-transfer rules in compliance"
    (enforce-unit amount)
    (enforce-unfrozen sender)
    (enforce-unfrozen-amount sender amount)
    (enforce-contains-identity receiver)
    (with-read token "" {
       "compliance":= compliance-l
      ,"paused":=paused
      }
      (enforce (= paused false) "TRF-PAUSE-001")
      (map
        (lambda (compliance:module{RWA.compliance-v1})
          (compliance::can-transfer TOKEN-ID sender receiver amount)
        ) compliance-l
      )
      (let
        ( (sender-obj (debit sender amount))
          (receiver-obj (credit receiver amount)) )
        (emit-event (RECONCILE amount sender-obj receiver-obj))
        (map
          (lambda (compliance:module{RWA.compliance-v1})
            (compliance::transferred TOKEN-ID sender receiver amount)
          ) compliance-l
        )
      )
    )
    "Transfer successful"
  )

  (defun set-address-frozen-internal:string (investor-address:string freeze:bool)
    @doc "Internal function to update the freeze state."
    (require-capability (INTERNAL))
    (update investors investor-address {"frozen": freeze})
    (emit-event (ADDRESS-FROZEN investor-address freeze) )
    "Address Frozen"
  )

  (defun freeze-partial-tokens-internal:string (investor-address:string amount:decimal)
    @doc "Internal function to update the partial freeze."
    (require-capability (INTERNAL))
    (enforce (> amount 0.0) "FRZ-AMT-004")
    (with-read investors investor-address {
      "balance":= balance,
      "frozen":= frozen,
      "amount-frozen":= amount-frozen
    }
      (enforce (not frozen) "ACC-FRZ-001")
      (enforce (>= balance (+ amount-frozen amount)) "FRZ-AMT-002")
      (update investors investor-address {"amount-frozen": (+ amount-frozen amount)})
      (emit-event (TOKENS-FROZEN investor-address  (+ amount-frozen amount)))
      "Partial tokens frozen"
    )
  )

  (defun unfreeze-partial-tokens-internal:string (investor-address:string amount:decimal)
    @doc "Internal function to update the partial freeze."
    (require-capability (INTERNAL))
    (enforce (> amount 0.0) "FRZ-AMT-004")
    (with-read investors investor-address {
      "balance":= balance,
      "frozen":= frozen,
      "amount-frozen":= amount-frozen
    }
      (enforce (not frozen) "ACC-FRZ-001")
      (enforce (<= amount amount-frozen) "FRZ-AMT-003")
      (update investors investor-address {"amount-frozen": (- amount-frozen amount)})
      (emit-event (TOKENS-FROZEN investor-address (- amount-frozen amount)))
      "Partial tokens unfrozen"
    )
  )

  (defun register-identity-internal:bool (investor-address:string investor-guard:guard investor-identity:string country:integer)
    @doc "Register an identity contract corresponding to an investor address.                               \
    \ Requires that the investor doesn't have an identity contract already registered.                    \
    \ Only a wallet set as agent of the smart contract can call this function.                        \
    \ Emits an \`IDENTITY-REGISTERED\` event."
    (require-capability (INTERNAL))
    (is-principal investor-address)
    (write identities investor-address { "kadenaID":investor-identity, "country":country, "active":true })
    (with-default-read investors investor-address
      { "balance": -1.0 }
      { "balance":=balance }
      (if (= balance -1.0)
        (create-account investor-address investor-guard)
        ""
      )
    )
    (emit-event (IDENTITY-REGISTERED investor-address investor-guard investor-identity))
  )

  ;; freeze operations (pause, unpause, set-address-frozen, freeze-partial-tokens, unfreeze-partial-tokens)

  (defun pause:string ()
    @doc "Pause the contract."
    (with-read token "" {
      "paused":= paused
      }
     (only-agent FREEZER)
     (enforce (= paused false) "PAU-001")
     (update token "" {"paused": true}))
     (emit-event (PAUSED))
     "Paused"
  )

  (defun unpause:string ()
    @doc "Unpause the contract."
    (with-read token "" {
      "paused":= paused
      }
      (only-agent FREEZER)
      (enforce (= paused true) "PAU-002")
      (update token "" {"paused": false}))
      (emit-event (UNPAUSED))
      "Unpaused"
  )

  (defun set-address-frozen:string (investor-address:string freeze:bool)
    @doc "Freeze or unfreeze an investor's address."
    (only-agent FREEZER)
    (with-capability (INTERNAL)
      (set-address-frozen-internal investor-address freeze)
    )
  )

  (defun freeze-partial-tokens:string (investor-address:string amount:decimal)
    @doc "Freeze an amount of an investor's tokens."
   (only-agent FREEZER)
   (with-capability (INTERNAL)
    (freeze-partial-tokens-internal investor-address amount)
   )
  )

  (defun unfreeze-partial-tokens:string (investor-address:string amount:decimal)
    @doc "Unfreeze an amount of an investor's tokens."
    (with-capability (INTERNAL)
      (only-agent FREEZER)
      (unfreeze-partial-tokens-internal investor-address amount)
    ) 
  )

  ;; identity operations (register-identity, delete-identity)
  (defun register-identity:bool (investor-address:string investor-guard:guard investor-identity:string country:integer)
    @doc "Register an investor address.                                                          \
    \ Requires that the investor doesn't have an identity contract already registered.           \
    \ Only a wallet set as agent of the smart contract can call this function.                   \
    \ Emits an \`IDENTITY-REGISTERED\` event."
    (only-owner-or-agent-admin)
    (with-capability (INTERNAL)
      (register-identity-internal investor-address investor-guard investor-identity country)
    )
  )

  (defun delete-identity:bool (investor-address:string)
    @doc "Removes an investor from the identity registry.                                        \
    \ Requires that the investor have an identity contract already deployed that will be deleted.\
    \ Only a wallet set as agent of the smart contract can call this function.                   \
    \ Emits an \`IDENTITY-REMOVED\` event."
    (only-owner-or-agent-admin)
    (with-default-read investors investor-address
      { "balance": -1.0 }
      { "balance":=balance }
      (enforce (<= balance 0.0) "IDR-002")
    )
    (update identities investor-address { "active":false })
    (emit-event (IDENTITY-REMOVED investor-address (at 'kadenaID (read identities investor-address))))
  )

  ;; transfer operations (mint, burn, transfer, forced-transfer)
  (defun mint:bool (to:string amount:decimal)
    @doc "Mints amount of token to an investor's address"
    (enforce-unit amount)
    (with-capability (MINT)
      (only-agent TRANSFER-MANAGER)
      (mint-internal to amount)
    )
  )

  (defun burn:bool (investor-address:string amount:decimal)
    @doc "Burn tokens from an investor's address according to destroy rules in compliance"
    (only-agent TRANSFER-MANAGER)
    (with-capability (BURN)
      (burn-internal investor-address amount)
    )
  )

  (defun transfer:string
    ( sender:string
      receiver:string
      amount:decimal
    )
    @doc "Transfer AMOUNT of token from sender to receiver"
    (with-capability (TRANSFER sender receiver amount)
      (transfer-internal sender receiver amount)
    )
  )

  (defun forced-transfer:bool (from:string to:string amount:decimal)
    @doc "Force transfer tokens from one address to another."
    (only-agent TRANSFER-MANAGER)
    (with-capability (FORCED-TRANSFER)
      (with-capability (TRANSFER from to amount)
        (transfer-internal from to amount)
    ))
    true
  )

  ;; Getters

  (defun kadenaID:string ()
    @doc "Return the kadena ID."
    (with-read token "" {"kadenaID" := id } id)
  )

  (defun version:string ()
    @doc "Return the version of the contract."
    VERSION
  )

  (defun precision:integer ()
    @doc "Return the precision of the contract."
    MINIMUM-PRECISION
  )

  (defun decimals:integer ()
    @doc "Return the decimals of the contract."
    (with-read token "" {
      "decimals":= decimals
      } decimals
    )
  )

  (defun name:string ()
    @doc "Return the name of the token."
    (with-read token "" {"name" := name } name)
  )


  (defun symbol:string ()
    @doc "Return the symbol of the token."
    (with-read token "" {"symbol" := symbol } symbol)
  )


  (defun get-owner-guard:guard ()
    @doc "Return the owner guard of the token"
    (with-read token "" {
      "owner-guard":= owner-guard
      } owner-guard)
  )


  ;; Setters
  (defun set-name:string (name:string)
    @doc "Set the name of the token."
    (only-owner "")
    (with-read token "" {
      "symbol":= symbol,
      "version":= version,
      "kadenaID":= kadenaID
      }
      (write token "" {"name": name}
      (emit-event (UPDATED-TOKEN-INFORMATION name symbol MINIMUM-PRECISION VERSION kadenaID ))
      )
    )
  )

  (defun set-symbol:string (symbol:string)
    @doc "Set the symbol of the token."
    (only-owner "")
    (with-read token "" {
      "name":= name,
      "version":= version,
      "kadenaID":= kadenaID
      }
        (write token "" {"symbol": symbol}
        (emit-event (UPDATED-TOKEN-INFORMATION name symbol MINIMUM-PRECISION VERSION kadenaID ))
      )
    )
  )

  (defun set-kadenaID:string (kadenaID:string)
    @doc "Set the kadenaID of the token."
    (only-owner "")
    (with-read token "" {
      "name":= name,
      "version":= version,
      "symbol":= symbol
      }
      (write token "" {"kadenaID": kadenaID}
      (emit-event (UPDATED-TOKEN-INFORMATION name symbol MINIMUM-PRECISION VERSION kadenaID ))
      )
    )
  )

  (defun get-balance:decimal ( account:string )
    @doc "Retrieves the investor balance"
    (with-read investors account {
      "balance" := balance
      }
      balance
    )
  )

  (defun details:object{account-details} ( account: string )
    @doc "Retrieves the investor balance and the guard"
    (with-read investors account {
      "balance" := balance,
      "guard" := guard
      }
      {"balance" : balance, "guard" : guard, "account" : account})
  )

  (defun recovery-address:bool (lost-wallet:string new-wallet:string investor-kadenaID:string)
    @doc "Recover tokens from a lost wallet to a new wallet."
    (only-agent AGENT-ADMIN)
    (emit-event (RECOVERY-SUCCESS lost-wallet new-wallet investor-kadenaID))
    false
  )

  (defun create-account:string
    ( account:string
      guard:guard
    )
    @doc "Create ACCOUNT with 0.0 balance. Only principal accounts are accepted."
    (require-capability (INTERNAL))
    (enforce-contains-identity account)
    (validate-principal guard account)
    (insert investors account {
      "account": account,
      "balance" : 0.0,
      "guard" : guard,
      "frozen" : false,
      "amount-frozen": 0.0
      }
    )
  )

  (defun enforce-reserved:bool (account:string guard:guard)
    @doc "Enforce reserved account name protocols."
    (if (validate-principal guard account)
      true
      (let ((r (check-reserved account)))
        (if (= r "")
          true
          (if (= r "k")
            (enforce false "PRT-ACC-001")
            (enforce false
              (format "PRT-ACC-002: {}" [r]))
            )))))

  (defun check-reserved:string (account:string)
    " Checks ACCOUNT for reserved name and returns type if \
    \ found or empty string. Reserved names start with a \
    \ single char and colon, e.g. 'c:foo', which would return 'c' as type."
    (let ((pfx (take 2 account)))
      (if (= ":" (take -1 pfx)) (take 1 pfx) "")))

  (defun transfer-ownership:bool (new-owner-guard:guard)
    @doc "Transfers ownership of the contract to a new owner-guard. Note: GOV-KEYSET also has to be modified."
    (only-owner "")
    (with-read token "" {
      "owner-guard":= old-owner-guard
      }
      (update token "" {
        "owner-guard": new-owner-guard
      })
      (emit-event (OWNERSHIP-TRANSFERRED old-owner-guard new-owner-guard))
    )
  )

  (defun get-compliance-parameters:object{compliance-parameters-input}()
    @doc "Retrieves compliance parameters."
    (with-read compliance-parameters ""
      { "max-balance-per-investor":= max-balance-per-investor,
        "supply-limit":= supply-limit,
        "max-investors":= max-investors
      }
      { "max-balance-per-investor": max-balance-per-investor,
        "supply-limit": supply-limit,
        "max-investors": max-investors
      }
    )
  )

  (defun compliance:[module{RWA.compliance-v1}] ()
    @doc "Retrieves the list of compliance contracts in action."
    (with-read token "" {"compliance" := compliance } compliance)
  )

  (defun max-balance-per-investor:decimal ()
    @doc "Retrieves compliance parameter, max-balance-per-investor. \
    \ Used in max-balance-compliance. "
    (with-read compliance-parameters "" {
      "max-balance-per-investor":= max-balance-per-investor
      } max-balance-per-investor)
  )

  (defun supply-limit:decimal ()
    @doc "Retrieves compliance parameter, supply-limit. \
    \ Used in supply-limit-compliance. "
    (with-read compliance-parameters "" {
      "supply-limit":= supply-limit
    } supply-limit)
  )

  (defun max-investors:integer ()
    @doc "Retrieves compliance parameter, max-investors.\
    \ Used in max-investors-compliance. "
    (with-read compliance-parameters "" {
      "max-investors":= max-investors
    } max-investors)
  )

  (defun investor-count:integer ()
    @doc "Current count of investors"
    (with-read compliance-parameters "" {
        "investor-count":= ct
      } ct)
  )

  (defun supply:decimal ()
    @doc "Current token supply"
    (with-default-read token ""
    { 'supply : 0.0 }
    { 'supply := s }
    s)
  )

  (defun set-max-balance-per-investor (max-balance-per-investor:decimal)
    @doc "Updates the compliance parameter, max balance per investor"
    (only-owner-or-agent-admin)
    (with-read compliance-parameters ""
      { "supply-limit":= supply-limit,
        "max-investors":= max-investors
      }
      (update compliance-parameters "" {
        "max-balance-per-investor": max-balance-per-investor
        }
      )
    (emit-event (COMPLIANCE-PARAMETERS
      { "supply-limit": supply-limit,
        "max-investors": max-investors,
        "max-balance-per-investor": max-balance-per-investor
      })))
  )

  (defun set-supply-limit (supply-limit:decimal)
    @doc "Updates the compliance parameter, supply limit"
    (only-owner-or-agent-admin)
    (with-read compliance-parameters ""
      { "max-balance-per-investor":= max-balance-per-investor,
        "max-investors":= max-investors
      }
    (update compliance-parameters "" {
      "supply-limit": supply-limit
      }
    )
    (emit-event (COMPLIANCE-PARAMETERS
      { "supply-limit": supply-limit,
        "max-investors": max-investors,
        "max-balance-per-investor": max-balance-per-investor
      })))
  )

  (defun set-max-investors (max-investors:decimal)
    @doc "Updates the compliance parameter, max investors"
    (only-owner-or-agent-admin)
    (with-read compliance-parameters ""
      { "max-balance-per-investor":= max-balance-per-investor,
        "supply-limit":= supply-limit
      }
    (update compliance-parameters "" {
      "max-investors": max-investors
      }
    )
    (emit-event (COMPLIANCE-PARAMETERS
      { "supply-limit": supply-limit,
        "max-investors": max-investors,
        "max-balance-per-investor": max-balance-per-investor
      })))
  )

  (defun set-compliance-parameters ()
    @doc "Updates the compliance parameter, supply limit. The input is read from the \
    \ data field, \`compliance-parameters\`. "
    (only-owner-or-agent-admin)
    (let ((compliance-params:object{compliance-parameters-input} (read-msg 'compliance-parameters )))
      (update compliance-parameters ""
        compliance-params
      )
      (emit-event (COMPLIANCE-PARAMETERS compliance-params))
    )
  )

  (defun set-compliance:string (compliance:[module{RWA.compliance-v1}])
    @doc "Set the compliance contract."
    (only-owner "")
    (update token "" {"compliance": compliance})
    (emit-event (COMPLIANCE-UPDATED compliance))
  )

  (defun update-supply:bool (amount:decimal)
    @doc "Updates total supply at mint or burn"
    ;; positive check? 
    (require-capability (UPDATE-SUPPLY))
    (with-default-read token ""
      { 'supply: 0.0 }
      { 'supply := s }
      (let ((new-supply (+ s amount)))
      (update token "" {'supply: new-supply })
      (emit-event (SUPPLY new-supply))))
  )

  (defun add-investor-count:string ()
    @doc "Increments investor count if an account of balance 0.0 is credited"
    (require-capability (INTERNAL))
    (with-read compliance-parameters "" {
      "investor-count":= ct
    }
      (update compliance-parameters "" {
        "investor-count": (+ 1 ct)
      })
    )
  )

  (defun remove-investor-count:string ()
    @doc "Decrements investor count if an account is debited to balance of 0.0"
    (require-capability (INTERNAL))
    (with-read compliance-parameters "" {
      "investor-count":= ct
      }
      (enforce (>= (- ct 1) 0) "CMPL-MI-003")
      (update compliance-parameters "" {
        "investor-count": (- ct 1)
      })
    )
  )

  ;; Batch functions
  (defun batch-transfer:[string] (from:string to-list:[string] amounts:[decimal])
    @doc "Perform batch transfer of tokens."
    (map (lambda (idx:integer)
      (with-capability (TRANSFER from (at idx to-list) (at idx amounts))
        (transfer-internal from (at idx to-list) (at idx amounts))
      )
    ) (enumerate 0 (- (length to-list) 1))
    )
  )

  (defun batch-forced-transfer:[string] (from-list:[string] to-list:[string] amounts:[decimal])
    @doc "Perform batch forced transfer of tokens."
      (only-agent TRANSFER-MANAGER)
      (with-capability (FORCED-TRANSFER)
        (map (lambda (idx:integer)
          (with-capability (TRANSFER (at idx from-list) (at idx to-list) (at idx amounts))
            (transfer-internal (at idx from-list) (at idx to-list) (at idx amounts))
          )
        ) (enumerate 0 (- (length from-list) 1))
      )
    )
  )

  (defun batch-mint:[bool] (to-list:[string] amounts:[decimal])
    @doc "Mint tokens to multiple addresses."
    (only-agent TRANSFER-MANAGER)
    (with-capability (MINT)
      (map (lambda (idx:integer)
        (with-capability (TRANSFER (zero-address) (at idx to-list) (at idx amounts))
          (mint-internal (at idx to-list) (at idx amounts))
        )
        ) (enumerate 0 (- (length to-list) 1)))
    )
  )

  (defun batch-burn:[bool] (investor-addresses:[string] amounts:[decimal])
    @doc "Burn tokens from multiple addresses."
    (only-agent TRANSFER-MANAGER)
    (with-capability (BURN)
      (map (lambda (idx:integer)
      (with-capability (TRANSFER (at idx investor-addresses) (zero-address) (at idx amounts))
        (burn-internal (at idx investor-addresses) (at idx amounts))
      )
      ) (enumerate 0 (- (length investor-addresses) 1)) ) true
    )
  )

  (defun batch-register-identity:[bool] (investor-addresses:[string] investor-guards:[guard] identities:[string] countries:[integer])
    @doc "Allows batch registration of identities.                                                     \
    \ Requires that none of the investors has an identity contract already registered.                   \
    \ Only a wallet set as agent of the smart contract can call this function.                       \
    \ Emits \`IDENTITY-REGISTERED\` events for each investor address in the batch."
    (only-owner-or-agent-admin)
    (map (lambda (idx:integer)
      (with-capability (INTERNAL)
        (register-identity-internal (at idx investor-addresses) (at idx investor-guards) (at idx identities) (at idx countries))
      )
    ) (enumerate 0 (- (length investor-addresses) 1)) )
  )

  (defun batch-set-address-frozen:[string] (investor-addresses:[string] freeze:[bool])
    @doc "Freeze or unfreeze multiple addresses."
    (only-agent FREEZER)
    (map (lambda (idx:integer)
      (with-capability (INTERNAL)
        (set-address-frozen-internal (at idx investor-addresses) (at idx freeze))
      )
     )(enumerate 0 (- (length investor-addresses) 1))
    )
  )

  (defun batch-freeze-partial-tokens:[string] (investor-addresses:[string] amounts:[decimal] )
    @doc "Freeze amount of tokens for multiple addresses."
    (only-agent FREEZER)
    (map (lambda (idx:integer)
      (with-capability (INTERNAL)
        (freeze-partial-tokens-internal (at idx investor-addresses) (at idx amounts))
      ) ) (enumerate 0 (- (length investor-addresses) 1))
    )
  )

  (defun batch-unfreeze-partial-tokens:[string] (investor-addresses:[string] amounts:[decimal] )
    @doc "Unfreeze amount of tokens for multiple addresses."
    (only-agent FREEZER)
    (map (lambda (idx:integer)
      (with-capability (INTERNAL)
          (unfreeze-partial-tokens-internal (at idx investor-addresses) (at idx amounts))
      ) ) (enumerate 0 (- (length investor-addresses) 1))
    )
  )

  (defun add-agent:bool (agent:string guard:guard)
    @doc "Add a new agent. Re-activate an agent if already exists"
    (validate-principal guard agent)
    (verify-agent-roles (read-msg "roles"))
    (only-owner "")
    (with-default-read agents agent {
        "guard": guard,
        "active": false
        } {
        "guard":= g,
        "active":= active
        }
        (enforce (!= active true) "ROL-STS-001")
      (write agents agent {
        "roles": (read-msg "roles"),
        "guard": g,
        "active":true
      })
      (emit-event (AGENT-ADDED agent))
    )
  )

  (defun remove-agent:bool (agent:string)
    @doc "Remove an agent."
    (only-owner "")
    (update agents agent { 
      "roles": [],
      "active":false
      })
    (emit-event (AGENT-REMOVED agent))
  )

  (defun is-agent:bool (agent:string)
    @doc "Returns if an agent is registered and active"
    (with-read agents agent {
      "active":= active
      }
    active
    )
  )

  (defun update-agent-roles:bool (agent:string roles:[string])
    @doc "Updates the roles assigned to an agent. Ensures that the caller is either the contract \
    \ owner or an agent with the \`agent-admin\` role. Emits the \`AGENT-ROLES-UPDATED\` event."
    (only-owner-or-agent-admin)
    (verify-agent-roles roles)
    (update agents agent
      { 'roles: roles }
    )
    (emit-event (AGENT-ROLES-UPDATED agent roles))
    true
  )

  (defun get-agent-roles:[string] (agent:string)
    @doc "Return agent roles"
    (with-read agents agent
      { 'roles:= roles }
      roles
    )
  )

  (defun transfer-create:string
    ( sender:string
      receiver:string
      receiver-guard:guard
      amount:decimal
    )
    @doc "unused"
    (enforce false "GEN-IMPL-001")
  )

  (defpact transfer-crosschain:string
    ( sender:string
      receiver:string
      receiver-guard:guard
      target-chain:string
      amount:decimal
    )
    @doc "unused"
    (step (enforce false "GEN-IMPL-001") )
  )


  (defun is-verified:bool (investor-address:string)
    @doc "unused"
    (enforce false "GEN-IMPL-001")
  )

  (defun investor-identity:string (investor-address:string)
    @doc "unused"
    (enforce false "GEN-IMPL-001")
  )

  (defun investor-country:integer (investor-address:string)
    @doc "unused"
    (enforce false "GEN-IMPL-001")
    1
  )

  (defun issuers-registry:string ()
    @doc "unused"
   (enforce false "GEN-IMPL-001")
  )

  (defun topics-registry:string ()
    @doc "unused"
    (enforce false "GEN-IMPL-001")
  )

  (defun set-identity-registry:string (identity-registry:module {RWA.identity-registry-v1})
    @doc "unused"
    (enforce false "GEN-IMPL-001")
  )

  (defun identity-registry:module{RWA.identity-registry-v1} ()
    @doc "unused"
    (enforce false "GEN-IMPL-001")
  )

  (defun rotate:string
    ( account:string
      new-guard:guard
    )
    @doc "unused"
    (enforce false "GEN-IMPL-001")
  )

  (defun set-claim-topics-registry:bool (claim-topics-registry:string)
    @doc "unused"
    (enforce false "GEN-IMPL-001")
  )

  (defun set-trusted-issuers-registry:bool (trusted-issuers-registry:string)
    @doc "unused"
    (enforce false "GEN-IMPL-001")
  )

  (defun update-country:bool (investor-address:string country:integer)
    @doc "unused"
    (enforce false "GEN-IMPL-001")
  )

  (defun update-identity:bool (investor-address:string investor-identity:string)
    @doc "unused"
    (enforce false "GEN-IMPL-001")
  )

  (defcap CLAIM-TOPICS-REGISTRY-SET:bool (claim-topics-registry:string)
    @doc "unused"
    @event
    (enforce false "GEN-IMPL-001")
  )

  (defcap TRUSTED-ISSUERS-REGISTRY-SET:bool (trusted-issuers-registry:string)
    @doc "unused"
    @event
    (enforce false "GEN-IMPL-001")
  )

  (defcap IDENTITY-UPDATED:bool (old-identity:string new-identity:string)
    @doc "unused"
    @event
    (enforce false "GEN-IMPL-001")
  )

  (defcap COUNTRY-UPDATED:bool (investor-address:string country:integer)
    @doc "unused"
    @event
    (enforce false "GEN-IMPL-001")
  )
)

(create-table token)
(create-table investors)
(create-table compliance-parameters)
(create-table agents)
(create-table identities)

(RWA.token-mapper.add-token-ref TOKEN-ID ${namespace}.${contractName})


(${namespace}.${contractName}.init "${contractName}" "MVP" 0 "kadenaID" [] false (keyset-ref-guard "${namespace}.admin-keyset"))
`;
