import { env } from '@/utils/env';
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
  (implements ${env.RWADEFAULT_NAMESPACE}.real-world-asset-v1)
  (implements ${env.RWADEFAULT_NAMESPACE}.agent-role-v1)
  (implements ${env.RWADEFAULT_NAMESPACE}.identity-registry-v1)
  (implements ${env.RWADEFAULT_NAMESPACE}.compliance-compatible-v1)

  (use fungible-v2 [account-details])
  (use ${env.RWADEFAULT_NAMESPACE}.compliance-compatible-v1 [compliance-parameters-input compliance-info])

  (defconst TOKEN-ID:string "${namespace}.${contractName}" "Token ID")
  (defconst VERSION:string "0.0")
  (defconst MINIMUM-PRECISION:integer 0 "Minimum allowed precision for token transactions")

  (defconst EMPTY-ACCOUNT:string "" "Empty account for minting and burning")
  (defconst DEFAULT-ROW:string "" "Used for tables with one row")
  (defconst ZERO-DECIMAL:decimal 0.0 "Used when zero amount is compared")
  (defconst ZERO-INTEGER:integer 0 "Used when zero amount is compared")

  (defconst OWNER:string "owner")

  (defconst AGENT-ADMIN:string "agent-admin")
  (defconst FREEZER:string "freezer")
  (defconst TRANSFER-MANAGER:string "transfer-manager")

  (defconst AGENT-ROLES:[string]
    [AGENT-ADMIN FREEZER TRANSFER-MANAGER] )

  (defschema token-info
    @doc "Saves token metadata information"
    name:string
    symbol:string
    kadenaID:string
    decimals:integer
    compliance:[module{${env.RWADEFAULT_NAMESPACE}.compliance-v1}]
    paused:bool
    supply:decimal
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
    (cond ((= OWNER role)
        (enforce-agent OWNER role))
      (enforce-agent (read-string "agent") role)
    )
  )

  (defcap DEBIT (sender:string)
    @doc "Capability for managing debiting operations"
    (enforce (!= sender EMPTY-ACCOUNT) "ACC-PRT-003"))

  (defcap CREDIT (receiver:string)
    @doc "Capability for managing crediting operations"
    (enforce (!= receiver EMPTY-ACCOUNT) "ACC-PRT-003"))

  (defun TRANSFER-mgr:decimal
    ( managed:decimal
      requested:decimal
    )
    @doc "Ensures that the sum of transfer amounts in the requested transaction \\
    \\ does not exceed the managed amount."
    (let ((newbal (- managed requested)))
      (enforce (>= newbal ZERO-DECIMAL)
        (format "TRF-MGR-001: {}" [managed]))
      newbal)
  )

  (defcap TRANSFER:bool
    ( sender:string
      receiver:string
      amount:decimal
    )
    @doc "Transfers tokens between two accounts. The transfer is valid if any   \\ 
    \\ of the following conditions apply:                                        \\ 
    \\ 1. The sender signs the \`TRANSFER\` capability.                            \\ 
    \\ 2. An agent with the \`transfer-manager\` role signs the \`mint\` function    \\ 
    \\    with the \`ONLY-AGENT\` capability.                                      \\
    \\ 3. An agent with the \`transfer-manager\` role signs the \`burn\` function    \\ 
    \\    with the \`ONLY-AGENT\` capability.                                      \\
    \\ 4. An agent with the \`transfer-manager\` role signs the \`forced-transfer\`  \\
    \\    function with the \`ONLY-AGENT\` capability."
    @managed amount TRANSFER-mgr
    (enforce-unit amount)
    (enforce (> amount ZERO-DECIMAL) "TRF-AMT-002")
    (enforce (!= sender receiver) "TRF-ACC-001")
    (enforce-one "TRF-CAP-001" [
      (enforce-guard (at 'guard (read investors sender)))
      (enforce (try false (require-capability (MINT))) "TRF-MINT-001")
      (enforce (try false (require-capability (BURN))) "TRF-BURN-001")
      (enforce (try false (require-capability (FORCED-TRANSFER))) "TRF-FRC-001")
      ])
    (if (!= sender EMPTY-ACCOUNT)
      (compose-capability (DEBIT sender))
      true
    )
    (if (!= receiver EMPTY-ACCOUNT)
      (compose-capability (CREDIT receiver))
      true
    )    
  )

  (defcap UPDATED-TOKEN-INFORMATION:bool (new-name:string new-symbol:string new-decimals:integer new-version:string new-kadenaID:string)
    @doc "Event emitted when token information is updated."
    @event
    true
  )

  (defcap IDENTITY-REGISTRY-ADDED:bool (identity-registry:module{${env.RWADEFAULT_NAMESPACE}.identity-registry-v1})
    @doc "Event emitted when an identity registry is added."
    @event
    true
  )

  (defcap COMPLIANCE-UPDATED:bool (compliance:[module{${env.RWADEFAULT_NAMESPACE}.compliance-v1}])
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
    "Address Frozen"
  )

  (defcap TOKENS-FROZEN:string (investor-address:string amount:decimal)
    @doc "Event emitted when tokens are frozen."
    @event
    "Tokens Frozen"
  )

  (defcap TOKENS-UNFROZEN:string (investor-address:string amount:decimal)
    @doc "Event emitted when tokens are unfrozen."
    @event
    "Tokens Unfrozen"
  )

  (defcap PAUSED:string ()
    @doc "Event emitted when the contract is paused."
    @event
    "Paused"
  )

  (defcap UNPAUSED:string ()
    @doc "Event emitted when the contract is unpaused."
    @event
    "Unpaused"
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
    @doc "Capability to guard functions for burn operations"
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
    @doc " For accounting via events. \\
         \\ sender = {account: '', previous: 0.0, current: 0.0} for mint \\
         \\ receiver = {account: '', previous: 0.0, current: 0.0} for burn"
    @event
    true
  )

  (defun init (name:string symbol:string decimals:integer kadenaID:string compliance:[module{${env.RWADEFAULT_NAMESPACE}.compliance-v1}] paused:bool owner-guard:guard)
    @doc "Initiates token with supplied informations and owner guard"
    (with-capability (GOV)
      (let ((default-compliance-parameters:object{compliance-parameters-input} 
         { "max-balance-per-investor": -1.0
          ,"supply-limit": -1.0
          ,"max-investors": -1
          }))
      (insert token DEFAULT-ROW {
          "name": name,
          "symbol":symbol,
          "kadenaID":kadenaID,
          "compliance":compliance,
          "decimals":decimals,
          "paused":false,
          "supply": ZERO-DECIMAL
        })
      (insert agents OWNER {
        "roles": [OWNER],
        "guard": owner-guard,
        "active": true
      })
      (insert compliance-parameters DEFAULT-ROW
        (+ {"investor-count": 0 } default-compliance-parameters))
      (emit-event (UPDATED-TOKEN-INFORMATION name symbol MINIMUM-PRECISION VERSION kadenaID ))
      (emit-event (COMPLIANCE-UPDATED compliance))
      (emit-event (COMPLIANCE-PARAMETERS default-compliance-parameters)) 
    )
    )
  )

  (defun contains-identity:bool (investor-address:string)
    @doc "Checks if an address is registered in the Identity Registry."
    (with-default-read identities investor-address
      { "active": false }
      { "active":= active }
      active
    )
  )

  (defun enforce-contains-identity:bool (account:string)
    @doc "Enforces that an address is registered in the Identity Registry."
    (let ((r (contains-identity account)))
      (enforce r "IDR-001"))
  )

  (defun enforce-agent:bool (agent:string role:string)
    @doc "Enforces that agent has the valid role for the transaction."
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
    (enforce (<= (length roles) (length AGENT-ROLES)) "ROL-003")
    (map (lambda (role:string)
      (enforce (contains role AGENT-ROLES)
        (format "ROL-002: {}" [role]))
    ) roles)
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
    (with-read token DEFAULT-ROW {"paused" := paused } paused)
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
      (if frozen ZERO-DECIMAL amount-frozen)
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

  (defun only-owner-or-agent-admin:bool ()
    @doc "Ensures that the caller is either the owner or an agent with the \`agent-admin\` \\ 
    \\ role. Requires either OWNER or AGENT-ADMIN role. Installs \`(ONLY-AGENT OWNER)\` to  \\
    \\ prevent the function from failing when caller is the AGENT-ADMIN."
    (install-capability (ONLY-AGENT OWNER))
    (install-capability (ONLY-AGENT AGENT-ADMIN))
    (enforce-one "ROL-001" [
      (only-agent OWNER)
      (only-agent AGENT-ADMIN)
    ])
  )

  ;
  ;; fungible-v2 implementation
  ;
  (defun credit:object{account-balance-change}
    ( account:string
      amount:decimal
    )
    @doc "Credits the requested account. If the account balance is zero, increments \\
    \\ the investor count. Protected by the \`CREDIT\` capability."
    (require-capability (CREDIT account))
    (with-default-read investors account
      { "balance": ZERO-DECIMAL }
      { "balance":= balance}
      (update investors account
      { "balance" : (+ balance amount)})
      (if (= balance ZERO-DECIMAL)
          (with-capability (INTERNAL)
            (add-investor-count)
          )
          "Account already exists"
      )
      {'account: account, 'previous: balance, 'current: (+ balance amount)}
    )
  )

  (defun debit:object{account-balance-change}
    ( account:string
      amount:decimal
    )
    @doc "Debits the requested account by a specified amount. If the account balance \\ 
    \\ becomes zero after the debit, it decrements the \`investor-count\`. Protected by \\
    \\ the \`DEBIT\` capability. "
    (require-capability (DEBIT account))
    (with-read investors account
      { "balance" := balance }
      (enforce (>= (- balance amount) ZERO-DECIMAL) "ACC-AMT-001")
      (update investors account
        { "balance" : (- balance amount) })
      (if (= (- balance amount) ZERO-DECIMAL)
          (with-capability (INTERNAL)
            (remove-investor-count)
          )
          "Account already exists"
      )
      {'account: account, 'previous: balance, 'current: (- balance amount)}
    )    
  )

  ;; internal functions

  (defun mint-internal:bool (to:string amount:decimal)
    @doc "Mint tokens from an investor's address according to create rules in compliance"
    (require-capability (MINT))
    (enforce-contains-identity to)
    (with-read token DEFAULT-ROW {
      "compliance":= compliance-l:[module{${env.RWADEFAULT_NAMESPACE}.compliance-v1}]
      }
      (map (lambda (compliance:module{${env.RWADEFAULT_NAMESPACE}.compliance-v1})
         (compliance::created TOKEN-ID to amount)
        ) compliance-l
      )
    )
    (with-capability (TRANSFER EMPTY-ACCOUNT to amount)
      (let
        (
          (sender:object{account-balance-change} 
            {'account: EMPTY-ACCOUNT, 'previous: ZERO-DECIMAL, 'current: ZERO-DECIMAL} )
          (receiver:object{account-balance-change} 
            (credit to amount))
        )
        (emit-event (RECONCILE amount sender receiver)) 
      )
      (with-capability (UPDATE-SUPPLY)
        (update-supply amount)
      )
    )
  )

  (defun burn-internal:bool (investor-address:string amount:decimal)
    @doc "Burn tokens from an investor's address according to destroy rules in compliance"
    (require-capability (BURN))
    (with-read token DEFAULT-ROW {
      "compliance":=compliance-l
      }
      (map (lambda (compliance:module{${env.RWADEFAULT_NAMESPACE}.compliance-v1})
          (compliance::destroyed TOKEN-ID investor-address amount)
        ) compliance-l
      )
    )
    (with-capability (TRANSFER investor-address EMPTY-ACCOUNT amount)
      (let
        (
          (sender:object{account-balance-change} 
            (debit investor-address amount))
          (receiver:object{account-balance-change}
            {'account: EMPTY-ACCOUNT, 'previous: ZERO-DECIMAL, 'current: ZERO-DECIMAL})
        )
        (emit-event (RECONCILE amount sender receiver))
      )
      (with-capability (UPDATE-SUPPLY)
        (update-supply (- amount))
      )
    )
  )

  (defun transfer-internal:string
    ( sender:string
      receiver:string
      amount:decimal
    )
    @doc "Transfer AMOUNT of token from sender to receiver. Validates can-transfer rules in compliance"
    (require-capability (TRANSFER sender receiver amount))
    (enforce-unfrozen sender)
    (enforce-unfrozen-amount sender amount)
    (enforce-contains-identity receiver)
    (with-read token DEFAULT-ROW {
       "compliance":= compliance-l
      ,"paused":=paused
      }
      (enforce (= paused false) "TRF-PAUSE-001")
      (map
        (lambda (compliance:module{${env.RWADEFAULT_NAMESPACE}.compliance-v1})
          (compliance::can-transfer TOKEN-ID sender receiver amount)
        ) compliance-l
      )
      (let
        ( (sender-obj (debit sender amount))
          (receiver-obj (credit receiver amount)) )
        (emit-event (RECONCILE amount sender-obj receiver-obj))
        (map
          (lambda (compliance:module{${env.RWADEFAULT_NAMESPACE}.compliance-v1})
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
    (emit-event (ADDRESS-FROZEN investor-address freeze))
    "Address Frozen"
  )

  (defun freeze-partial-tokens-internal:string (investor-address:string amount:decimal)
    @doc "Internal function to update the partial freeze."
    (require-capability (INTERNAL))
    (enforce (> amount ZERO-DECIMAL) "FRZ-AMT-004")
    (enforce-unit amount)
    (with-read investors investor-address {
      "balance":= balance,
      "frozen":= frozen,
      "amount-frozen":= amount-frozen
    }
      (enforce (not frozen) "ACC-FRZ-001")
      (enforce (>= balance (+ amount-frozen amount)) "FRZ-AMT-002")
      (update investors investor-address {"amount-frozen": (+ amount-frozen amount)})
      (emit-event (TOKENS-FROZEN investor-address  (+ amount-frozen amount)))
    )
    "Partial Tokens Frozen"
  )

  (defun unfreeze-partial-tokens-internal:string (investor-address:string amount:decimal)
    @doc "Internal function to update the partial freeze."
    (require-capability (INTERNAL))
    (enforce (> amount ZERO-DECIMAL) "FRZ-AMT-004")
    (enforce-unit amount)
    (with-read investors investor-address {
      "balance":= balance,
      "frozen":= frozen,
      "amount-frozen":= amount-frozen
    }
      (enforce (not frozen) "ACC-FRZ-001")
      (enforce (<= amount amount-frozen) "FRZ-AMT-003")
      (update investors investor-address {"amount-frozen": (- amount-frozen amount)})
      (emit-event (TOKENS-FROZEN investor-address (- amount-frozen amount)))
    )
    "Partial Tokens Unfrozen"
  )

  (defun register-identity-internal:bool (investor-address:string investor-guard:guard investor-identity:string country:integer)
    @doc "Register an identity contract corresponding to an investor address.                               \\
    \\ Requires that the investor doesn't have an identity contract already registered.                    \\
    \\ Only a wallet set as agent of the smart contract can call this function.                        \\
    \\ Emits an \`IDENTITY-REGISTERED\` event."
    (require-capability (INTERNAL))
    (is-principal investor-address)
    (write identities investor-address { "kadenaID":investor-identity, "country":country, "active":true })
    (with-default-read investors investor-address
      { "balance": -1.0 }
      { "balance":=balance }
      (if (= balance -1.0)
        (create-account investor-address investor-guard)
        "Account already exists"
      )
    )
    (emit-event (IDENTITY-REGISTERED investor-address investor-guard investor-identity))
  )

  ;; freeze operations (pause, unpause, set-address-frozen, freeze-partial-tokens, unfreeze-partial-tokens)

  (defun pause:string ()
    @doc "Pause the contract."
    (with-read token DEFAULT-ROW {
      "paused":= paused
      }
     (enforce (= paused false) "PAU-001")
     (only-agent FREEZER)
     (update token DEFAULT-ROW {"paused": true}))
     (emit-event (PAUSED))
     "Paused"
  )

  (defun unpause:string ()
    @doc "Unpause the contract."
    (with-read token DEFAULT-ROW {
      "paused":= paused
      }
      (enforce (= paused true) "PAU-002")
      (only-agent FREEZER)
      (update token DEFAULT-ROW {"paused": false}))
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
    (only-agent FREEZER)
    (with-capability (INTERNAL)
      (unfreeze-partial-tokens-internal investor-address amount)
    ) 
  )

  ;; identity operations (register-identity, delete-identity)
  (defun register-identity:bool (investor-address:string investor-guard:guard investor-identity:string country:integer)
    @doc "Register an investor address.                                                          \\
    \\ Requires that the investor doesn't have an identity contract already registered.           \\
    \\ Only a wallet set as agent of the smart contract can call this function.                   \\
    \\ Emits an \`IDENTITY-REGISTERED\` event."
    (only-owner-or-agent-admin)
    (with-capability (INTERNAL)
      (register-identity-internal investor-address investor-guard investor-identity country)
    )
  )

  (defun delete-identity:bool (investor-address:string)
    @doc "Removes an investor from the identity registry.                                        \\
    \\ Requires that the investor have an identity contract already deployed that will be deleted.\\
    \\ Only a wallet set as agent of the smart contract can call this function.                   \\
    \\ Emits an \`IDENTITY-REMOVED\` event."
    (only-owner-or-agent-admin)
    (with-default-read investors investor-address
      { "balance": -1.0 }
      { "balance":=balance }
      (enforce (<= balance ZERO-DECIMAL) "IDR-002")
    )
    (update identities investor-address { "active":false })
    (emit-event (IDENTITY-REMOVED investor-address (at 'kadenaID (read identities investor-address))))
  )

  ;; transfer operations (mint, burn, transfer, forced-transfer)
  (defun mint:bool (to:string amount:decimal)
    @doc "Mints amount of token to an investor's address"
    (only-agent TRANSFER-MANAGER)
    (with-capability (MINT)
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
  )

  ;; Getters

  (defun kadenaID:string ()
    @doc "Return the kadena ID."
    (with-read token DEFAULT-ROW {"kadenaID" := id } id)
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
    (with-read token DEFAULT-ROW {
      "decimals":= decimals
      } decimals
    )
  )

  (defun name:string ()
    @doc "Return the name of the token."
    (with-read token DEFAULT-ROW {"name" := name } name)
  )


  (defun symbol:string ()
    @doc "Return the symbol of the token."
    (with-read token DEFAULT-ROW {"symbol" := symbol } symbol)
  )


  (defun get-owner-guard:guard ()
    @doc "Return the owner guard of the token"
    (with-read agents OWNER {
      "guard":= owner-guard
      } owner-guard)
  )


  ;; Setters
  (defun set-name:string (name:string)
    @doc "Set the name of the token."
    (only-agent OWNER)
    (with-read token DEFAULT-ROW {
      "symbol":= symbol,
      "version":= version,
      "kadenaID":= kadenaID
      }
      (update token DEFAULT-ROW {"name": name}
      (emit-event (UPDATED-TOKEN-INFORMATION name symbol MINIMUM-PRECISION VERSION kadenaID ))
      )
    )
  )

  (defun set-symbol:string (symbol:string)
    @doc "Set the symbol of the token."
    (only-agent OWNER)
    (with-read token DEFAULT-ROW {
      "name":= name,
      "version":= version,
      "kadenaID":= kadenaID
      }
        (update token DEFAULT-ROW {"symbol": symbol}
        (emit-event (UPDATED-TOKEN-INFORMATION name symbol MINIMUM-PRECISION VERSION kadenaID ))
      )
    )
  )

  (defun set-kadenaID:string (kadenaID:string)
    @doc "Set the kadenaID of the token."
    (only-agent OWNER)
    (with-read token DEFAULT-ROW {
      "name":= name,
      "version":= version,
      "symbol":= symbol
      }
      (update token DEFAULT-ROW {"kadenaID": kadenaID}
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
      {"account" : account, "balance" : balance, "guard" : guard})
  )

  (defun recovery-address:bool (lost-wallet:string new-wallet:string investor-kadenaID:string)
    @doc "Recover tokens from a lost wallet to a new wallet."
    (only-agent AGENT-ADMIN)
    (emit-event (RECOVERY-SUCCESS lost-wallet new-wallet investor-kadenaID))
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
      "balance" : ZERO-DECIMAL,
      "guard" : guard,
      "frozen" : false,
      "amount-frozen": ZERO-DECIMAL
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
    (only-agent OWNER)
    (with-read agents OWNER {
      "guard":= old-owner-guard
      }
      (update agents OWNER {
        "roles": [OWNER],
        "guard": new-owner-guard,
        "active":true
      })
      (emit-event (OWNERSHIP-TRANSFERRED old-owner-guard new-owner-guard))
    )
  )

  (defun get-compliance-parameters:object{compliance-parameters-input}()
    @doc "Retrieves compliance parameters."
    (with-read compliance-parameters DEFAULT-ROW
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

  (defun compliance:[module{${env.RWADEFAULT_NAMESPACE}.compliance-v1}] ()
    @doc "Retrieves the list of compliance contracts in action."
    (with-read token DEFAULT-ROW {"compliance" := compliance } compliance)
  )

  (defun max-balance-per-investor:decimal ()
    @doc "Retrieves compliance parameter, max-balance-per-investor. \\
    \\ Used in max-balance-compliance. "
    (with-read compliance-parameters DEFAULT-ROW {
      "max-balance-per-investor":= max-balance-per-investor
      } max-balance-per-investor)
  )

  (defun supply-limit:decimal ()
    @doc "Retrieves compliance parameter, supply-limit. \\
    \\ Used in supply-limit-compliance. "
    (with-read compliance-parameters DEFAULT-ROW {
      "supply-limit":= supply-limit
    } supply-limit)
  )

  (defun max-investors:integer ()
    @doc "Retrieves compliance parameter, max-investors.\\
    \\ Used in max-investors-compliance. "
    (with-read compliance-parameters DEFAULT-ROW {
      "max-investors":= max-investors
    } max-investors)
  )

  (defun investor-count:integer ()
    @doc "Current count of investors"
    (with-read compliance-parameters DEFAULT-ROW {
        "investor-count":= ct
      } ct)
  )

  (defun supply:decimal ()
    @doc "Current token supply"
    (with-default-read token DEFAULT-ROW
    { 'supply : ZERO-DECIMAL }
    { 'supply := s }
    s)
  )

  (defun set-max-balance-per-investor:bool (max-balance-per-investor:decimal)
    @doc "Updates the compliance parameter, max balance per investor"
    (with-read compliance-parameters DEFAULT-ROW
      { "supply-limit":= supply-limit,
        "max-investors":= max-investors
      }
      (set-compliance-parameters 
        { "max-balance-per-investor": max-balance-per-investor,
          "supply-limit": supply-limit,
          "max-investors": max-investors
        }
      )
    )
  )

  (defun set-supply-limit:bool (supply-limit:decimal)
    @doc "Updates the compliance parameter, supply limit"
    (with-read compliance-parameters DEFAULT-ROW
      { "max-balance-per-investor":= max-balance-per-investor,
        "max-investors":= max-investors
      }
      (set-compliance-parameters 
        { "max-balance-per-investor": max-balance-per-investor,
          "supply-limit": supply-limit,
          "max-investors": max-investors
        }
      )
    )
  )

  (defun set-max-investors:bool (max-investors:integer)
    @doc "Updates the compliance parameter, max investors"
    (with-read compliance-parameters DEFAULT-ROW
      { "max-balance-per-investor":= max-balance-per-investor,
        "supply-limit":= supply-limit
      }
      (set-compliance-parameters 
        { "max-balance-per-investor": max-balance-per-investor,
          "supply-limit": supply-limit,
          "max-investors": max-investors
        }
      )
    )
  )

  (defun set-compliance-parameters:bool (compliance-params:object{compliance-parameters-input})
    @doc "Updates the compliance parameter, supply limit. The input is read from the \\
    \\ data field, \`compliance-parameters\`. "
    (only-owner-or-agent-admin)
    (validate-compliance-parameters compliance-params)
    (update compliance-parameters DEFAULT-ROW
      compliance-params
    )
    (emit-event (COMPLIANCE-PARAMETERS compliance-params))
  )

  (defun validate-compliance-parameters:bool (compliance-params:object{compliance-parameters-input})
    (enforce (or 
      (= -1.0 (at 'max-balance-per-investor compliance-params)) 
      (>= (at 'max-balance-per-investor compliance-params) ZERO-DECIMAL)) 
      "CMPL-MBPI-001")
    (enforce (or 
      (= -1.0 (at 'supply-limit compliance-params)) 
      (>= (at 'supply-limit compliance-params) ZERO-DECIMAL)) "CMPL-SL-001")
    (enforce (or 
      (= -1 (at 'max-investors compliance-params)) 
      (>= (at 'max-investors compliance-params) ZERO-INTEGER)) "CMPL-MI-001")
  )
  
  (defun set-compliance:string (compliance:[module{${env.RWADEFAULT_NAMESPACE}.compliance-v1}])
    @doc "Set the compliance contract."
    (only-agent OWNER)
    (update token DEFAULT-ROW {"compliance": compliance})
    (emit-event (COMPLIANCE-UPDATED compliance))
  )

  (defun update-supply:bool (amount:decimal)
    @doc "Updates total supply at mint or burn"
    (require-capability (UPDATE-SUPPLY))
    (with-default-read token DEFAULT-ROW
      { 'supply: ZERO-DECIMAL }
      { 'supply := s }
      (let ((new-supply (+ s amount)))
        (enforce (>= new-supply ZERO-DECIMAL) "SUP-001")
        (update token DEFAULT-ROW {'supply: new-supply })
        (emit-event (SUPPLY new-supply))))
  )

  (defun add-investor-count:string ()
    @doc "Increments investor count if an account of balance 0.0 is credited"
    (require-capability (INTERNAL))
    (with-read compliance-parameters DEFAULT-ROW {
      "investor-count":= ct
    }
      (update compliance-parameters DEFAULT-ROW {
        "investor-count": (+ 1 ct)
      })
    )
  )

  (defun remove-investor-count:string ()
    @doc "Decrements investor count if an account is debited to balance of 0.0"
    (require-capability (INTERNAL))
    (with-read compliance-parameters DEFAULT-ROW {
      "investor-count":= ct
      }
      (enforce (>= (- ct 1) 0) "CMPL-MI-004")
      (update compliance-parameters DEFAULT-ROW {
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
        (with-capability (TRANSFER EMPTY-ACCOUNT (at idx to-list) (at idx amounts))
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
      (with-capability (TRANSFER (at idx investor-addresses) EMPTY-ACCOUNT (at idx amounts))
        (burn-internal (at idx investor-addresses) (at idx amounts))
      )
      ) (enumerate 0 (- (length investor-addresses) 1)) ) true
    )
  )

  (defun batch-register-identity:[bool] (investor-addresses:[string] investor-guards:[guard] identities:[string] countries:[integer])
    @doc "Allows batch registration of identities.                                                     \\
    \\ Requires that none of the investors has an identity contract already registered.                   \\
    \\ Only a wallet set as agent of the smart contract can call this function.                       \\
    \\ Emits \`IDENTITY-REGISTERED\` events for each investor address in the batch."
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
    (only-agent OWNER)
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
    (only-agent OWNER)
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
    @doc "Updates the roles assigned to an agent. Ensures that the caller is either the contract \\
    \\ owner or an agent with the \`agent-admin\` role. Emits the \`AGENT-ROLES-UPDATED\` event."
    (only-owner-or-agent-admin)
    (verify-agent-roles roles)
    (update agents agent
      { 'roles: roles }
    )
    (emit-event (AGENT-ROLES-UPDATED agent roles))
  )

  (defun get-agent-roles:[string] (agent:string)
    @doc "Return agent roles"
    (with-read agents agent
      { 'roles:= roles, 'active:= active }
      (enforce active "ROL-STS-002")
      roles
    )
  )

  (defun transfer-create:string
    ( sender:string
      receiver:string
      receiver-guard:guard
      amount:decimal
    )
    (enforce false "GEN-IMPL-001")
  )

  (defpact transfer-crosschain:string
    ( sender:string
      receiver:string
      receiver-guard:guard
      target-chain:string
      amount:decimal
    )
    (step (enforce false "GEN-IMPL-001") )
  )

  (defun is-verified:bool (investor-address:string)
    (enforce false "GEN-IMPL-001")
  )

  (defun investor-identity:string (investor-address:string)
    (enforce false "GEN-IMPL-001")
  )

  (defun investor-country:integer (investor-address:string)
    (enforce false "GEN-IMPL-001")
    1
  )

  (defun issuers-registry:string ()
   (enforce false "GEN-IMPL-001")
  )

  (defun topics-registry:string ()
    (enforce false "GEN-IMPL-001")
  )

  (defun set-identity-registry:string (identity-registry:module {${env.RWADEFAULT_NAMESPACE}.identity-registry-v1})
    (enforce false "GEN-IMPL-001")
  )

  (defun identity-registry:module{${env.RWADEFAULT_NAMESPACE}.identity-registry-v1} ()
    (enforce false "GEN-IMPL-001")
  )

  (defun rotate:string (account:string new-guard:guard)
    (enforce false "GEN-IMPL-001")
  )

  (defun set-claim-topics-registry:bool (claim-topics-registry:string)
    (enforce false "GEN-IMPL-001")
  )

  (defun set-trusted-issuers-registry:bool (trusted-issuers-registry:string)
    (enforce false "GEN-IMPL-001")
  )

  (defun update-country:bool (investor-address:string country:integer)
    (enforce false "GEN-IMPL-001")
  )

  (defun update-identity:bool (investor-address:string investor-identity:string)
    (enforce false "GEN-IMPL-001")
  )

  (defun only-owner:bool (role:string)
    (enforce false "GEN-IMPL-001")
  )

  (defcap CLAIM-TOPICS-REGISTRY-SET:bool (claim-topics-registry:string)
    @event
    (enforce false "GEN-IMPL-001")
  )

  (defcap TRUSTED-ISSUERS-REGISTRY-SET:bool (trusted-issuers-registry:string)
    @event
    (enforce false "GEN-IMPL-001")
  )

  (defcap IDENTITY-UPDATED:bool (old-identity:string new-identity:string)
    @event
    (enforce false "GEN-IMPL-001")
  )

  (defcap COUNTRY-UPDATED:bool (investor-address:string country:integer)
    @event
    (enforce false "GEN-IMPL-001")
  )

  (defcap ONLY-OWNER:bool (role:string)
    @managed
    (enforce false "GEN-IMPL-001")
  )
)

(create-table token)
(create-table investors)
(create-table compliance-parameters)
(create-table agents)
(create-table identities)

(${env.RWADEFAULT_NAMESPACE}.token-mapper.add-token-ref TOKEN-ID ${namespace}.${contractName})

(${namespace}.${contractName}.init "${contractName}" "MVP" 0 "kadenaID" [] false (keyset-ref-guard "${namespace}.admin-keyset"))
`;
