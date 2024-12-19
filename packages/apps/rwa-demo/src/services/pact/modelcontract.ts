import type { IAddContractProps } from '../createContract';

export const getContract = ({ contractName, namespace }: IAddContractProps) => `
(namespace "${namespace}")

(module ${contractName} GOV
  "${contractName} contract descriptions"

  (defconst GOV-KEYSET:string "${namespace}.admin-keyset")
  (defcap GOV () (enforce-keyset GOV-KEYSET))

  (implements fungible-v2)
  (implements RWA.real-world-asset-v1)
  (implements RWA.agent-role-v1)
  (implements RWA.identity-registry-v1)
  (implements RWA.identity-registry-storage-v1)
  (implements RWA.compliance-compatible-v1)

  (use fungible-v2 [account-details])
  (use RWA.burn-wallet)

;; acts like a tokenStorage.sol
  (defschema token-info
    name:string
    symbol:string
    decimals:integer
    kadenaID:string
    version:string
    compliance:[module{RWA.compliance-v1}]
    paused:bool
    supply:decimal
    owner-guard:guard
  )

  (defschema user-info
    account:string
    balance:decimal
    guard:guard
    frozen:bool
    amount-frozen:decimal
  )

  (defschema agent-schema
    roles:[string]
    guard:guard
    active:bool
  )

  (defschema identity-schema
    kadenaID:string
    country:integer
    active:bool
  )

  (defschema compliance-info-schema
    max-balance-per-investor:decimal
    supply-limit:decimal
    max-investors:integer
    investor-count:integer
  )

  (defschema compliance-input
    max-balance-per-investor:decimal
    supply-limit:decimal
    max-investors:integer
  )

  (deftable token:{token-info})
  (deftable users:{user-info})
  (deftable compliance-parameters:{compliance-info-schema})

  ;; agent management
  (deftable agents:{agent-schema})

  ;;identity management
  (deftable identities:{identity-schema})

  ;; defconsts

  (defconst MINIMUM-PRECISION 0
    "Minimum allowed precision for coin transactions")

  (defconst TOKEN-ID "${namespace}.${contractName}")

  (defconst AGENT-ADMIN:string 'agent-admin )
  (defconst SUPPLY-MODIFIER:string 'supply-modifier )
  (defconst FREEZER:string 'freezer )
  (defconst TRANSFER-MANAGER 'transfer-manager )
  (defconst RECOVERY:string 'recovery )
  (defconst COMPLIANCE:string 'compliance )
  (defconst WHITELIST-MANAGER:string 'whitelist-manager )

  (defconst AGENT-ROLES:[string] [
    AGENT-ADMIN
    SUPPLY-MODIFIER
    FREEZER
    TRANSFER-MANAGER
    RECOVERY
    COMPLIANCE
    WHITELIST-MANAGER
  ])

  ;; owner roles - NOT USED
  (defconst OWNER-ADMIN:string 'owner-admin )
  (defconst REGISTRY-ADDRESS-SETTER:string 'registry-address-setter )
  (defconst COMPLIANCE-SETTER:string 'compliance-setter )
  (defconst COMPLIANCE-MANAGER:string 'compliance-manager )
  (defconst CLAIM-REGISTRY-MANAGER:string 'claim-registry-manager )
  (defconst ISSUERS-REGISTRY-MANAGER:string 'issuers-registry-manager )
  (defconst TOKEN-INFO-MANAGER:string 'token-info-manager )

  (defconst OWNER-ROLES:[string] [
    OWNER-ADMIN
    REGISTRY-ADDRESS-SETTER
    COMPLIANCE-SETTER
    COMPLIANCE-MANAGER
    CLAIM-REGISTRY-MANAGER
    ISSUERS-REGISTRY-MANAGER
    TOKEN-INFO-MANAGER
  ])

  (defschema schema-set-compliance-parameters
    supply-limit:decimal
    max-investors:integer
    max-balance-per-investor:decimal
  )

  (defcap SET-COMPLIANCE-PARAMETERS:bool (compliance:object{schema-set-compliance-parameters})
    @doc "Event emitted when a compliance parameters is updated."
    @event
    true
  )

  ;; compliance-compatible functions

  (defun set-max-balance-per-investor (max-balance-per-investor:decimal)
    (only-agent COMPLIANCE)
    (update compliance-parameters "" {
      "max-balance-per-investor": max-balance-per-investor
      }
    )
  )

  (defun set-supply-limit (supply-limit:decimal)
    (only-agent COMPLIANCE)
    (update compliance-parameters "" {
      "supply-limit": supply-limit
      }
    )
  )

  (defun set-max-investors (max-investors:decimal)
    (only-agent COMPLIANCE)
    (update compliance-parameters "" {
      "max-investors": max-investors
      }
    )
  )

  (defun set-compliance-parameters ()
    (only-agent COMPLIANCE)
    (let ((compliance-params:object{compliance-input} (read-msg 'compliance-parameters )))
      (update compliance-parameters ""
        compliance-params
      )
      (emit-event (SET-COMPLIANCE-PARAMETERS compliance-params))
    )
  )

  (defun max-balance-per-investor:decimal ()
    (with-read compliance-parameters "" {
      "max-balance-per-investor":= max-balance-per-investor
    } max-balance-per-investor)
  )

  (defun supply-limit:decimal ()
    (with-read compliance-parameters "" {
      "supply-limit":= supply-limit
    } supply-limit)
  )

  (defun max-investors:integer ()
    (with-read compliance-parameters "" {
      "max-investors":= max-investors
    } max-investors)
  )

  (defun investor-count:integer ()
    (with-read compliance-parameters "" {
        "investor-count":= ct
      } ct)
  )

  (defun add-investor-count:string ()
    (with-read compliance-parameters "" {
      "investor-count":= ct
    }
      (update compliance-parameters "" {
        "investor-count": (+ 1 ct)
      })
    )
  )

  ;; @events

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

  (defcap COMPLIANCE-ADDED:bool (compliance:module{RWA.compliance-v1})
    @doc "Event emitted when a compliance contract is added."
    @event
    true
  )

  (defcap RECOVERY-SUCCESS:bool (lost-wallet:string new-wallet:string investor-kadenaID:string)
    @doc "Event emitted when a recovery process is successful."
    @event
    true
  )

  (defcap ADDRESS-FROZEN:string (user-address:string is-frozen:bool)
    @doc "Event emitted when an address is frozen."
    @event
    true
  )

  (defcap TOKENS-FROZEN:string (user-address:string amount:decimal)
    @doc "Event emitted when tokens are frozen."
    @event
    true
  )

  (defcap TOKENS-UNFROZEN:string (user-address:string amount:decimal)
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

  (defcap AGENT-ROLES-UPDATED:bool (user-address:string roles:[string])
    @doc "Event emitted when agent role is updated"
    @event
    true
  )

  ;; grant caps

  (defcap INTERNAL:bool () true)
  (defcap MINT:bool () true)
  (defcap BURN:bool () true)
  (defcap FORCED-TRANSFER:bool () true )
  (defcap UPDATE-SUPPLY:bool () true )

  ;; agent caps

  (defcap ONLY-AGENT:bool (role:string)
    @doc "Capability that can be required to validate if an address is an agent"
    @managed
    (with-read agents (read-string 'agent) {
      "guard":= guard,
      "roles":= roles
      }
      (contains role roles)
      (enforce-guard guard)
    )
  )

  (defcap ONLY-OWNER:bool (role:string)
    @doc "Capability that can be required to validate if an address is an agent"
    @managed
    (with-read token "" {"owner-guard":=guard}
      (enforce-guard guard)
    )
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

  (defcap SUPPLY (supply:decimal)
    @event
    supply
  )

  (defcap CLAIM-TOPICS-REGISTRY-SET:bool (claim-topics-registry:string)
    @doc "This event is emitted when the Claim Topics Registry has been set for the Identity Registry. \
    \ The event is emitted by the IdentityRegistry constructor.                                          \
    \ \`claim-topics-registry\` is the address of the Claim Topics Registry contract."
    @event
    true
  )

  (defcap TRUSTED-ISSUERS-REGISTRY-SET:bool (trusted-issuers-registry:string)
    @doc "This event is emitted when the Trusted Issuers Registry has been set for the Identity Registry. \
    \ The event is emitted by the IdentityRegistry constructor.                                          \
    \ \`trusted-issuers-registry\` is the address of the Trusted Issuers Registry contract."
    @event
    true
  )

  (defcap IDENTITY-REGISTERED:bool (investor-address:string investor-guard:guard identity:string)
    @doc "This event is emitted when an Identity is registered into the Identity Registry.             \
    \ The event is emitted by the 'register-identity' function.                                        \
    \ \`investor-address\` is the address of the investor's wallet.                                       \
    \ \`identity\` is the address of the Identity smart contract (kadenaID)."
    @event
    true
  )

  (defcap IDENTITY-REMOVED:bool (investor-address:string identity:string)
    @doc "This event is emitted when an Identity is removed from the Identity Registry.               \
    \ The event is emitted by the 'delete-identity' function.                                          \
    \ \`investor-address\` is the address of the investor's wallet.                                       \
    \ \`identity\` is the address of the Identity smart contract (kadenaID)."
    @event
    true
  )

  (defcap IDENTITY-UPDATED:bool (old-identity:string new-identity:string)
    @doc "This event is emitted when an Identity has been updated.                                      \
    \ The event is emitted by the 'update-identity' function.                                          \
    \ \`old-identity\` is the old Identity contract's address to update.                                  \
    \ \`new-identity\` is the new Identity contract's address."
    @event
    true
  )

  (defcap COUNTRY-UPDATED:bool (investor-address:string country:integer)
    @doc "This event is emitted when an Identity's country has been updated.                           \
    \ The event is emitted by the 'update-country' function.                                           \
    \ \`investor-address\` is the address on which the country has been updated.                         \
    \ \`country\` is the numeric code (ISO 3166-1) of the new country."
    @event
    true
  )

  (defcap IDENTITY-STORED:bool (investor-address:string identity:string)
    @doc "This event is emitted when an Identity is registered into the storage contract.           \
    \ The event is emitted by the 'register-identity' function.                                      \
    \ \`investor-address\` is the address of the investor's wallet.                                     \
    \ \`identity\` is the address of the Identity smart contract (kadenaID)."
    @event
  true)

  (defcap IDENTITY-UNSTORED:bool (investor-address:string identity:string)
    @doc "This event is emitted when an Identity is removed from the storage contract.              \
    \ The event is emitted by the 'delete-identity' function.                                        \
    \ \`investor-address\` is the address of the investor's wallet.                                     \
    \ \`identity\` is the address of the Identity smart contract (kadenaID)."
    @event
  true)

  (defcap IDENTITY-MODIFIED:bool (oldIdentity:string newIdentity:string)
    @doc "This event is emitted when an Identity has been updated.                                  \
    \ The event is emitted by the 'update-identity' function.                                        \
    \ \`oldIdentity\` is the old Identity contract's address to update.                                \
    \ \`newIdentity\` is the new Identity contract's address."
    @event
  true)

  (defcap COUNTRY-MODIFIED:bool (investor-address:string country:integer)
    @doc "This event is emitted when an Identity's country has been updated.        \
    \ The event is emitted by the 'update-country' function.                        \
    \ \`investor-address\` is the address on which the country has been updated.      \
    \ \`country\` is the numeric code (ISO 3166-1) of the new country."
    @event
  true)

  (defun init (name:string symbol:string decimals:integer kadenaID:string version:string compliances:[module{RWA.compliance-v1}] paused:bool owner-guard:guard)
    @doc "Initiates token with supplied informations and owner guard"
    (with-capability (GOV)
      (insert token "" {
        "name": name,
        "symbol":symbol,
        "kadenaID":kadenaID,
        "version":version,
        "compliance":compliances,
        "paused":false,
        "decimals": decimals,
        "supply": 0.0,
        "owner-guard": owner-guard
      })
      (insert compliance-parameters ""
        {
          "max-balance-per-investor": -1.0
         ,"supply-limit": -1.0
         ,"max-investors": -1
         ,"investor-count": 0
        }
      )
    )

    (emit-event (UPDATED-TOKEN-INFORMATION name symbol 0 version kadenaID ))
  )

  ;; Getters

  (defun kadenaID:string ()
    @doc "Return the kadena ID."
    (with-read token "" {"kadenaID" := id } id)
  )

  (defun version:string ()
    @doc "Return the version of the contract."
    (with-read token "" {"version" := version } version)
  )

  (defun identity-registry:module{RWA.identity-registry-v1} ()
    @doc "Return the associated identity registry."
    (with-read token "" {"identity-registry" := identity-registry } identity-registry)
  )

  (defun compliance:[module{RWA.compliance-v1}] ()
    @doc "Return the compliance contract."
    (with-read token "" {"compliance" := compliance } compliance)
  )

  (defun paused:bool ()
    @doc "Check if the contract is paused."
    (with-read token "" {"paused" := paused } paused)
  )

  (defun address-frozen:bool (user-address:string)
    @doc "Check if a user address is frozen."
    (with-read users user-address {
      "frozen" := frozen
      }
      frozen
  ))

  (defun get-frozen-tokens:decimal (user-address:string)
    @doc "Return the number of frozen tokens for a user."
    (with-read users user-address {
      "frozen" := frozen,
      "amount-frozen":= amount-frozen,
      "balance":= balance
      }
      (if frozen 0.0 amount-frozen)
  ))

  ;; Setters
  (defun set-name:string (name:string)
    @doc "Set the name of the token."
    (with-read token "" {
      "symbol":= symbol,
      "version":= version,
      "kadenaID":= kadenaID
      }
      (only-owner)
      (write token "" {"name": name}
      (emit-event (UPDATED-TOKEN-INFORMATION name symbol 0.0 version kadenaID ))
      )
    )
  )

  (defun set-symbol:string (symbol:string)
    @doc "Set the name of the token."
    (with-read token "" {
      "name":= name,
      "version":= version,
      "kadenaID":= kadenaID
      }
        (only-owner)
        (write token "" {"symbol": symbol}
        (emit-event (UPDATED-TOKEN-INFORMATION name symbol 0.0 version kadenaID ))
        )
    )
  )

  (defun set-kadenaID:string (kadenaID:string)
    @doc "Set the name of the token."
    (with-read token "" {
      "name":= name,
      "version":= version,
      "symbol":= symbol
      }
      (only-owner)
      (write token "" {"kadenaID": kadenaID}
      (emit-event (UPDATED-TOKEN-INFORMATION name symbol 0.0 version kadenaID ))
      )
    )
  )

  (defun pause:string ()
    @doc "Pause the contract."
    (with-read token "" {
      "paused":= paused
      }
     (only-agent FREEZER)
     (enforce (= paused false) "Contract is paused")
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
      (enforce (= paused true) "Contract is unpaused")
      (update token "" {"paused": false}))
      (emit-event (UNPAUSED))
      "Paused"
  )


  (defun set-address-frozen:string (user-address:string freeze:bool)
    @doc "Freeze or unfreeze a user's address."
    (with-capability (INTERNAL)
      (only-agent FREEZER)
      (set-address-frozen-internal user-address freeze)
    )
  )

  (defun freeze-partial-tokens:string (user-address:string amount:decimal)
    @doc "Freeze a specific amount of a user's tokens."
   (only-agent FREEZER)
   (with-capability (INTERNAL)
    (freeze-partial-tokens-internal user-address amount)
   )
  )

  (defun unfreeze-partial-tokens:string (user-address:string amount:decimal)
    @doc "Unfreeze a specific amount of a user's tokens."
    (with-capability (INTERNAL)
      (only-agent FREEZER)
      (with-read users user-address {
        "frozen":= frozen,
        "amount-frozen":= amount-frozen
      }
      (unfreeze-partial-tokens-internal user-address amount)
    ) )
  )

  (defun set-compliance:string (compliance:[module{RWA.compliance-v1}])
    @doc "Set the compliance contract."
    ;;call bind-token
    (only-owner "")
    (update token "" {"compliance": compliance})
    (emit-event (COMPLIANCE-ADDED compliance))
  )

  ;; Transfer actions

  (defun forced-transfer:bool (from:string to:string amount:decimal)
    @doc "Force transfer tokens from one address to another."
    (with-capability (FORCED-TRANSFER)
      (with-capability (TRANSFER from to amount)
        (only-agent TRANSFER-MANAGER)
        (transfer-internal from to amount)
    ))
    true
  )

  (defun mint :string (to:string amount:decimal)
    @doc "Mints amount of token to a user's address"
    (enforce-unit amount)
    (with-capability (MINT)
      (only-agent SUPPLY-MODIFIER)
      (mint-internal to amount)
    )
  )

  (defun burn:bool (user-address:string amount:decimal)
    @doc "Burn tokens from a user's address according to destroy rules in compliance"
    (enforce-unit amount)
    (with-read token "" {
      "compliance":=compliance-l
      }
      (only-agent SUPPLY-MODIFIER)
      (burn-internal user-address amount)
    )
  )

  (defun enforce-contains-identity (account:string)
    (let ((r (contains-identity account)))
      (enforce r "Address is not registered"))
  )

  (defun recovery-address:bool (lost-wallet:string new-wallet:string investor-kadenaID:string)
    @doc "Recover tokens from a lost wallet to a new wallet."
    (only-agent AGENT-ADMIN)
    (emit-event (RECOVERY-SUCCESS lost-wallet new-wallet investor-kadenaID))
    false
  )

  ;; Batch functions
  (defun batch-transfer:bool (from:string to-list:[string] amounts:[decimal])
    @doc "Perform batch transfer of tokens."
    (map (lambda (idx:integer)
      (with-capability (TRANSFER from (at idx to-list) (at idx amounts))
        (enforce-unfrozen from)
        (transfer-internal from (at idx to-list) (at idx amounts))
      )
    ) (enumerate 0 (- (length to-list) 1))
    ) true
  )

  (defun batch-forced-transfer:bool (from-list:[string] to-list:[string] amounts:[decimal])
    @doc "Perform batch forced transfer of tokens."
      (only-agent TRANSFER-MANAGER)
      (with-capability (FORCED-TRANSFER)
        (map (lambda (idx:integer)
          (with-capability (TRANSFER (at idx from-list) (at idx to-list) (at idx amounts))

            (transfer-internal (at idx from-list) (at idx to-list) (at idx amounts))
          )
        )
        ) (enumerate 0 (- (length from-list) 1)) ) true
  )

  (defun batch-mint:bool (to-list:[string] amounts:[decimal])
    @doc "Mint tokens to multiple addresses."
    (only-agent SUPPLY-MODIFIER)
    (with-capability (MINT)
      (map (lambda (idx:integer)
        (with-capability (TRANSFER (zero-address) (at idx to-list) (at idx amounts))
          (mint-internal (at idx to-list) (at idx amounts))
        )
        ) (enumerate 0 (- (length to-list) 1))) true
    )
  )

  (defun batch-burn:bool (user-addresses:[string] amounts:[decimal])
    @doc "Burn tokens from multiple addresses."
    (only-agent SUPPLY-MODIFIER)
    (with-capability (BURN)
      (map (lambda (idx:integer)
      (with-capability (TRANSFER (at idx user-addresses) (zero-address) (at idx amounts))
        (burn-internal (at idx user-addresses) (at idx amounts))
      )
      ) (enumerate 0 (- (length user-addresses) 1)) ) true
    )
  )

  (defun batch-register-identity:bool (user-addresses:[string] user-guards:[guard] identities:[string] countries:[integer])
    @doc "Allows batch registration of identities.                                                     \
    \ Requires that none of the users has an identity contract already registered.                   \
    \ Only a wallet set as agent of the smart contract can call this function.                       \
    \ Emits \`IDENTITY-REGISTERED\` events for each user address in the batch."
    (only-agent WHITELIST-MANAGER)
    (map (lambda (idx:integer)
      (register-identity-internal (at idx user-addresses) (at idx user-guards) (at idx identities) (at idx countries))
    ) (enumerate 0 (- (length user-addresses) 1)) ) true
  )

  (defun batch-set-address-frozen:bool (user-addresses:[string] freeze:[bool])
    @doc "Freeze or unfreeze multiple addresses."
    (only-agent FREEZER)
    (map (lambda (idx:integer)
    (set-address-frozen-internal (at idx user-addresses) freeze)
    ) (enumerate 0 (- (length user-addresses) 1)) ) true
  )

  (defun batch-freeze-partial-tokens-internal:bool (user-addresses:[string] amounts:[decimal] )
    @doc "Freeze a portion of tokens for multiple addresses."
    (only-agent FREEZER)
    (map (lambda (idx:integer)
    (with-capability (TRANSFER (at idx user-addresses) (zero-address) (at idx amounts))
      (freeze-partial-tokens-internal (at idx user-addresses) (at idx amounts))
    )
    ) (enumerate 0 (- (length user-addresses) 1)) ) true
  )

  (defun batch-freeze-partial-tokens:bool (user-addresses:[string] amounts:[decimal] )
    @doc "Unfreeze a portion of tokens for multiple addresses."
    (only-agent FREEZER)
    (map (lambda (idx:integer)
    (with-capability (TRANSFER (at idx user-addresses) (zero-address) (at idx amounts))
      (freeze-partial-tokens-internal (at idx user-addresses) (at idx amounts))
    )
    ) (enumerate 0 (- (length user-addresses) 1)) ) true
  )

  (defun batch-unfreeze-partial-tokens:bool (user-addresses:[string] amounts:[decimal] )
    @doc "Unfreeze a portion of tokens for multiple addresses."
    (only-agent FREEZER)
    (map (lambda (idx:integer)
    (with-capability (TRANSFER (at idx user-addresses) (zero-address) (at idx amounts))
      (unfreeze-partial-tokens-internal (at idx user-addresses) (at idx amounts))
    )
    ) (enumerate 0 (- (length user-addresses) 1)) ) true
  )

  ;; internal functions

  (defun mint-internal (to:string amount:decimal)
    (with-read token "" {
      "compliance":= compliance-l:[module{RWA.compliance-v1}]
      }
      (map (lambda (compliance:module{RWA.compliance-v1})
         (compliance::created TOKEN-ID to amount)
        ) compliance-l
      )
      (enforce-contains-identity to)
      (with-capability (TRANSFER (zero-address) to amount)
        (credit to amount)
        (with-capability (UPDATE-SUPPLY)
          (update-supply amount)
        )
      )
      "Token Minted"
    )
  )

  (defun burn-internal:bool (user-address:string amount:decimal)
    @doc "Burn tokens from a user's address according to destroy rules in compliance"
    (with-read token "" {
      "compliance":=compliance-l
      }
      (with-read token "" {
        "compliance":=compliance-l
        }
        (map (lambda (compliance:module{RWA.compliance-v1})
            (compliance::destroyed TOKEN-ID user-address amount)
          ) compliance-l
        )
        (with-capability (TRANSFER user-address (zero-address) amount)
          (debit user-address amount)
          (credit (zero-address) (zero-guard) amount)
          (with-capability (UPDATE-SUPPLY)
            (update-supply (- amount))
          )
        )
      )
    )
  )

  (defun transfer-internal:string
    ( sender:string
      receiver:string
      amount:decimal
    )
    @doc "Transfer AMOUNT of token from sender to receiver"
    (enforce-unit amount)
    (debit sender amount)
    (credit receiver amount)
    (with-read token "" {
       "compliance":= compliance-l
      ,"paused":=paused
      }
      (enforce (= paused false) "Contract is paused")
      (map
        (lambda (compliance:module{RWA.compliance-v1})
          (compliance::can-transfer TOKEN-ID sender receiver amount)
          (compliance::transferred TOKEN-ID sender receiver amount)
          ) compliance-l
      )
    )
    ""
  )

  (defun set-address-frozen-internal:string (user-address:string freeze:bool)
    @doc "Freeze or unfreeze a user's address."
      (require-capability (INTERNAL))
      (update users user-address {"frozen": freeze})
      (emit-event (ADDRESS-FROZEN user-address freeze) )
    ""
  )

  (defun freeze-partial-tokens-internal:string (user-address:string amount:decimal)
    (with-read users user-address {
      "balance":= balance,
      "frozen":= frozen,
      "amount-frozen":= amount-frozen
    }
    (require-capability (INTERNAL))
      (enforce (not frozen) "Account is frozen")
      (enforce (>= balance (+ amount-frozen amount)) "frozen amount exceeds balance")
      (update users user-address {"amount-frozen": (+ amount-frozen amount)})
      (emit-event (TOKENS-FROZEN user-address  (+ amount-frozen amount)))
      ""
    )
  )

  (defun unfreeze-partial-tokens-internal:string (user-address:string amount:decimal)
    (with-read users user-address {
      "balance":= balance,
      "frozen":= frozen,
      "amount-frozen":= amount-frozen
    }
    (require-capability (INTERNAL))
      (enforce (not frozen) "Account is frozen")
      (enforce (<= amount amount-frozen) "amount exceeds frozen balance")
      (update users user-address {"amount-frozen": (- amount-frozen amount)})
      (emit-event (TOKENS-FROZEN user-address (- amount-frozen amount)))
      ""
    )
  )

;; fungible-v2 implementation

  ; ----------------------------------------------------------------------
  ; Caps

  (defcap DEBIT (sender:string)
    @doc "Capability for managing debiting operations"
    (enforce (!= sender "") "invalid sender"))

  (defcap CREDIT (receiver:string)
    @doc "Capability for managing crediting operations"
    (enforce (!= receiver "") "invalid receiver"))

  (defcap TRANSFER:bool
    ( sender:string
      receiver:string
      amount:decimal
    )
    @managed amount TRANSFER-mgr

    (if (try false (enforce-guard (at 'guard (read users sender))))
      true ;; user signed for the transaction
      ;;else
      (if (try false (require-capability (MINT)))
        ;; mint is in action
        true
        ;;else
        (if (try false (require-capability (BURN)))
          ;;burn is in action
          true
          ;; else
          (if (try false (require-capability (FORCED-TRANSFER)))
          ;; forced-transfer is in action
          ;; else fail
          true
          (enforce false "TRANSFER failed")
        )
        )
      )
    )

    (enforce (!= sender "") "valid sender")
    (enforce (!= sender receiver) "same sender and receiver")
    (compose-capability (DEBIT sender))
    (compose-capability (CREDIT receiver))
    (enforce-unit amount)
    (enforce (> amount 0.0) "Positive amount")
    ""
  )

  (defun TRANSFER-mgr:decimal
    ( managed:decimal
      requested:decimal
    )

    (let ((newbal (- managed requested)))
      (enforce (>= newbal 0.0)
        (format "TRANSFER exceeded for balance {}" [managed]))
      newbal)
  )

  ; ----------------------------------------------------------------------
  ; Functionality

  (defun credit:string
    ( account:string
      amount:decimal
    )
    (require-capability (CREDIT account))
    (with-default-read users account
      {"balance": -1.0}
      { "balance" := balance}
      (if (= balance -1.0)
        (update users account
          { "balance" : amount})
        (update users account
          { "balance" : (+ balance amount)})
      )
      (if (= account (zero-address))
        "Credit to Zero Address"
        (if (= balance -1.0)
          (add-investor-count)
          "Credit successful"
        )
      )
    )
  )

  (defun debit:string
    ( account:string
      amount:decimal
    )
    (require-capability (DEBIT account))
    (with-read users account
      { "balance" := balance }
      (enforce (<= amount balance) "Insufficient funds")
      (update users account
        { "balance" : (- balance amount) }
        ))
  )

  (defun enforce-unfrozen-amount:bool
    ( account:string
      amount:decimal
    )
    (with-read users account
      { "frozen" := frozen,
        "amount-frozen" := amount-frozen,
        "balance" := balance
      }
      (enforce (not frozen) "Account is frozen")
      (enforce (>= (- balance amount-frozen) amount) "Insufficient funds")
    )
  )


  (defun transfer:string
    ( sender:string
      receiver:string
      amount:decimal
    )
    @doc "Transfer AMOUNT of token from sender to receiver"
    (enforce-unfrozen sender)
    (enforce-unfrozen-amount sender amount)
    (enforce-contains-identity receiver)
    (with-capability (TRANSFER sender receiver amount)
      (transfer-internal sender receiver amount)
    )
  )

  (defun enforce-unfrozen (sender:string)
    @doc "Fail if sender is frozen"
    (let ((frozen:bool (address-frozen sender)))
      (enforce (not frozen) "frozen sender")
    )
  )

  (defun transfer-create:string
    ( sender:string
      receiver:string
      receiver-guard:guard
      amount:decimal
    )
    @doc"" ""
  )

  (defpact transfer-crosschain:string
    ( sender:string
      receiver:string
      receiver-guard:guard
      target-chain:string
      amount:decimal
    )
    @doc ""
    (step "" )
  )

  (defun get-balance:decimal
    ( account:string )
    (with-read users account {
      "balance" := balance
      }
      balance
    )
  )

  (defun details:object{account-details}
    ( account: string )
    (with-read users account {
      "balance" := balance,
      "guard" := guard
      }
      {"balance" : balance, "guard" : guard, "account" : account})
  )

  (defun precision:integer ()
    MINIMUM-PRECISION
  )

  (defun enforce-unit:bool (amount:decimal)
    @doc "Enforce minimum precision allowed for coin transactions"

    (enforce
      (= (floor amount MINIMUM-PRECISION)
        amount)
      (format "Amount violates minimum precision: {}" [amount]))
  )

  (defun create-account:string
    ( account:string
      guard:guard
    )
    @doc " Create ACCOUNT with 0.0 balance, with GUARD controlling access."
    (enforce-contains-identity account)
    (validate-principal guard account)
    (insert users account {
      "balance" : -1.0,
      "guard" : guard,
      "frozen" : false,
      "account": account,
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
            (enforce false "Single-key account protocol violation")
            (enforce false
              (format "Reserved protocol guard violation: {}" [r]))
            )))))

  (defun check-reserved:string (account:string)
    " Checks ACCOUNT for reserved name and returns type if \
    \ found or empty string. Reserved names start with a \
    \ single char and colon, e.g. 'c:foo', which would return 'c' as type."
    (let ((pfx (take 2 account)))
      (if (= ":" (take -1 pfx)) (take 1 pfx) "")))

  (defun transfer-ownership:bool (new-owner-guard:guard)
    @doc "transfer ownership of the contract"
    (with-capability (ONLY-OWNER "")
      (with-read token "" {
        "owner-guard":= old-owner-guard
        }
        (update token "" {
          "owner-guard": new-owner-guard
        })
        (emit-event (OWNERSHIP-TRANSFERRED old-owner-guard new-owner-guard))
      )
    )
  )

  (defun add-agent:bool (agent:string guard:guard)
    @doc "Add a new agent."
    ;; re-activate an agent if already exists
    (validate-principal guard agent)
    (verify-agent-roles (read-msg 'roles))
    (with-default-read agents agent {
      "guard": guard
      } {
      "guard":= g
      }
    (with-capability (ONLY-OWNER "")
      (write agents agent {
        "roles": (read-msg 'roles),
        "guard": g,
        "active":true })
      (emit-event (AGENT-ADDED agent))
    )
  ))

  (defun remove-agent:bool (agent:string)
    @doc "Remove an agent."
    (with-capability (ONLY-OWNER "")
      (update agents agent { "active":false })
      (emit-event (AGENT-REMOVED agent))
    )
  )

  (defun is-agent:bool (agent:string)
    @doc "Check if an address is an agent."
    (with-default-read agents agent
      { 'active: false }
      { 'active := active }
      active
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

  (defun get-owner-guard:guard ()
    (with-read token "" {
      "owner-guard":= owner-guard
      } owner-guard)
  )

  (defun update-agent-roles:bool (agent:string roles:[string])
    @doc "Update agent roles"
    (install-capability (ONLY-OWNER ""))
    (install-capability (ONLY-AGENT AGENT-ADMIN))
    (if (try false (only-owner ""))
      true
      (only-agent AGENT-ADMIN))
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

  (defun verify-agent-roles (roles:[string])
    (if (= (length roles) 0)
      true
    (map (lambda (idx:integer)
      (contains (at idx roles) AGENT-ROLES)
      )
    (enumerate 0 (- (length roles) 1)))
  ))

  (defun register-identity:bool (user-address:string user-guard:guard identity:string country:integer)
    @doc "Register an identity contract corresponding to a user address.                               \
    \ Requires that the user doesn't have an identity contract already registered.                    \
    \ Only a wallet set as agent of the smart contract can call this function.                        \
    \ Emits an \`IDENTITY-REGISTERED\` event."
    (only-agent WHITELIST-MANAGER)
    (register-identity-internal user-address user-guard identity country)
  )

  (defun register-identity-internal:bool (user-address:string user-guard:guard identity:string country:integer)
    @doc "Register an identity contract corresponding to a user address.                               \
    \ Requires that the user doesn't have an identity contract already registered.                    \
    \ Only a wallet set as agent of the smart contract can call this function.                        \
    \ Emits an \`IDENTITY-REGISTERED\` event."
    (is-principal user-address)
    (write identities user-address { "kadenaID":identity, "country":country, "active":true })
    (with-default-read users user-address
      { "balance": -2.0 }
      { "balance":=balance }
      (if (= balance -2.0)
        (create-account user-address user-guard)
        ""
      )
    )
    (emit-event (IDENTITY-REGISTERED user-address user-guard identity))
  )


  (defun delete-identity:bool (user-address:string)
    @doc "Removes a user from the identity registry.                                                    \
    \ Requires that the user have an identity contract already deployed that will be deleted.         \
    \ Only a wallet set as agent of the smart contract can call this function.                        \
    \ Emits an \`IDENTITY-REMOVED\` event."
    (only-agent WHITELIST-MANAGER)
    (update identities user-address { "active":false })
    (emit-event (IDENTITY-REMOVED user-address (at 'kadenaID (read identities user-address))))
  )

  (defun set-claim-topics-registry:bool (claim-topics-registry:string)
    @doc "Replace the actual claimTopicsRegistry contract with a new one.                              \
    \ Only the wallet set as owner of the smart contract can call this function.                       \
    \ Emits a \`CLAIM-TOPICS-REGISTRY-SET\` event."
    true ; TODO: Implement this function
  )

  (defun set-trusted-issuers-registry:bool (trusted-issuers-registry:string)
    @doc "Replace the actual Trusted Issuers Registry contract with a new one.                           \
    \ Only the wallet set as owner of the smart contract can call this function.                      \
    \ Emits a \`TRUSTED-ISSUERS-REGISTRY-SET\` event."
    true ; TODO: Implement this function
  )

  (defun update-country:bool (user-address:string country:integer)
    @doc "Updates the country corresponding to a user address.                                         \
    \ Requires that the user have an identity contract already deployed that will be replaced.        \
    \ Only a wallet set as agent of the smart contract can call this function.                        \
    \ Emits a \`COUNTRY-UPDATED\` event."
    true ; TODO: Implement this function
  )

  (defun update-identity:bool (user-address:string identity:string)
    @doc "Updates an identity contract corresponding to a user address.                               \
    \ Requires that the user address should be the owner of the identity contract.                    \
    \ Requires that the user should have an identity contract already deployed that will be replaced.\
    \ Only a wallet set as agent of the smart contract can call this function.                        \
    \ Emits an \`IDENTITY-UPDATED\` event."
    true ; TODO: Implement this function
  )

  (defun contains-identity:bool (user-address:string)
    @doc "Checks whether a wallet has its Identity registered or not in the Identity Registry.           \
    \ Returns 'true' if the address is contained in the Identity Registry, 'false' if not."
    (with-default-read identities user-address
      { "active": false }
      { "active":= active }
      active)
  )

  (defun is-verified:bool (user-address:string)
    @doc "Checks whether an identity contract corresponding to the provided user address has the required \
    \ claims or not, based on the data fetched from the trusted issuers registry and the claim topics registry. \
    \ Returns 'true' if the address is verified, 'false' if not."
    true ; TODO: Implement this function
  )

  (defun user-identity:string (user-address:string)
    @doc "Returns the kadenaID of an investor for a given user address."
    "" ; TODO: Implement this function
  )

  (defun investor-country:integer (user-address:string)
    @doc "Returns the country code of an investor for a given user address."
    1 ; TODO: Implement this function
  )

  (defun issuers-registry:string ()
    @doc "Returns the Trusted Issuers Registry linked to the current Identity Registry."
    "" ; TODO: Implement this function
  )

  (defun topics-registry:string ()
    @doc "Returns the Claim Topics Registry linked to the current Identity Registry."
    "" ; TODO: Implement this function
  )

  (defun update-supply:bool (amount:decimal)
    (require-capability (UPDATE-SUPPLY))
    (with-default-read token ""
      { 'supply: 0.0 }
      { 'supply := s }
      (let ((new-supply (+ s amount)))
      (update token "" {'supply: new-supply })
      (emit-event (SUPPLY new-supply))))
  )

  (defun supply:decimal ()
    (with-default-read token ""
    { 'supply : 0.0 }
    { 'supply := s }
    s)
  )

  ;;unused
  (defun set-identity-registry:string (identity-registry:module{RWA.identity-registry-v1})
    @doc ""
    ""
  )

  (defun rotate:string
    ( account:string
      new-guard:guard
    )
    @doc ""
    ""
  )
)

;; token
(create-table token)
(create-table users)
(create-table compliance-parameters)

;; agents
(create-table agents)

;; investors
(create-table identities)


  ; (defcap WHEN-NOT-PAUSED ()
  ;   @doc "check if token is not paused"
  ; )
  ;
  ; (defcap WHEN-PAUSED ()
  ;   @doc "check if token is paused"
  ; )
;; doesn't have erc-20's approve feature
;; implemented partial functions
;; changing the way agents were used using data field
;; set roles in agent
;; wanted to review frontend and see if certain features were possible with graphql (still exploring but want to sit with Travis?)
(RWA.token-mapper.add-token-ref TOKEN-ID ${namespace}.${contractName})



(${namespace}.${contractName}.init "${contractName}" "MVP" 0 "kadenaID" "0.0" [RWA.max-balance-compliance RWA.supply-limit-compliance] false (keyset-ref-guard "${namespace}.admin-keyset"))
`;
