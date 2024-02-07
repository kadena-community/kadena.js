(namespace (read-string 'ns))

(module policy-manager GOVERNANCE

  (defconst ADMIN-KS:string "marmalade-v2.marmalade-contract-admin")

  (defcap GOVERNANCE ()
    (enforce-guard ADMIN-KS))

  (use kip.token-policy-v2 [token-info])
  (use util.fungible-util)
  (use ledger-v1)

  (defun init:bool(ledger:module{ledger-v1})
    @doc "Must be initiated with ledger implementation"
    (with-capability (GOVERNANCE)
      (insert ledgers "" {
        "ledger-impl": ledger
      })
    )
    true
  )

  (defschema quote-schema
    @doc "Quote spec of the sale"
    token-id:string
    amount:decimal
    seller:string
    timeout:integer
    fungible:module{fungible-v2}
    seller-fungible-account:object{fungible-account}
    sale-price:decimal
    sale-type:string
  )

  (defschema quote-spec
    fungible:module{fungible-v2}
    seller-fungible-account:object{fungible-account}
    sale-price:decimal
    sale-type:string
  )

  (defschema fungible-account
    @doc "account and guard information of a fungible"
    account:string
    guard:guard
  )

  (defschema marketplace-fee-spec
    @doc "Marketplace fee data to include in payload"
    mk-account:string
    mk-fee-percentage:decimal
  )

  (defcap QUOTE:bool
    ( sale-id:string
      token-id:string
      spec:object{quote-spec}
    )
    @event
    true
  )

  (deftable quotes:{quote-schema})

  (defconst QUOTE-MSG-KEY:string "quote"
    @doc "Payload field for quote spec")

  (defconst BUYER-FUNGIBLE-ACCOUNT-MSG-KEY:string "buyer_fungible_account"
    @doc "Payload field for buyer's fungible account")

  (defconst UPDATED-PRICE-KEY:string "updated_price"
    @doc "Payload field for updated price")

  (defconst MARKETPLACE-FEE-KEY "marketplace_fee"
    @doc "Payload field for marketplace fee spec")

  (defcap ESCROW (sale-id:string)
    @doc "Capability to be used as escrow's capability guard"
    true
  )

  ;;
  ;; policy-manager-v1 caps to be able to validate access to quote-manager & policy operations.
  ;;
  (defcap INIT-CALL:bool (id:string precision:integer uri:string policy:module{kip.token-policy-v2})
    true
  )

  (defcap TRANSFER-CALL:bool (id:string sender:string receiver:string amount:decimal policy:module{kip.token-policy-v2})
    true
  )

  (defcap MINT-CALL:bool (id:string account:string amount:decimal policy:module{kip.token-policy-v2})
    true
  )

  (defcap BURN-CALL:bool (id:string account:string amount:decimal policy:module{kip.token-policy-v2})
    true
  )

  (defcap OFFER-CALL:bool (id:string seller:string amount:decimal sale-id:string timeout:integer policy:module{kip.token-policy-v2})
    true
  )

  (defcap WITHDRAW-CALL:bool (id:string seller:string amount:decimal sale-id:string timeout:integer policy:module{kip.token-policy-v2})
    true
  )

  (defcap BUY-CALL:bool (id:string seller:string buyer:string amount:decimal sale-id:string policy:module{kip.token-policy-v2})
    true
  )

  (defcap SALE-GUARD-CALL:bool (sale-id:string price:decimal)
    true
  )

  (defcap FUNGIBLE-TRANSFER-CALL:bool (id:string)
    true
  )


  (defcap UPDATE-QUOTE-PRICE:bool (token-id:string sale-id:string sale-type:string updated-price:decimal)
    @doc "Enforces sale-guard on update-quote-price"
    (enforce (> updated-price 0.0) "QUOTE price must be positive")
    (compose-capability (SALE-GUARD-CALL sale-id updated-price))
    (let ((sale-contract:module{sale-v2} (retrieve-sale sale-type)))
      (sale-contract::enforce-quote-update sale-id updated-price))
  )

  (defun get-escrow-account:object{fungible-account} (sale-id:string)
    { 'account: (create-principal (create-capability-guard (ESCROW sale-id)))
    , 'guard: (create-capability-guard (ESCROW sale-id))
    })

  ; Saves reference to ledger
  (defschema ledger
    ledger-impl:module{ledger-v1}
  )

  (deftable ledgers:{ledger}
    @doc "Singleton table for ledger reference storage")

  ;; Saves Sale Logic
  (defschema sale-contract
    sale-contract:module{sale-v2}
  )

  (deftable sale-whitelist:{sale-contract})

  (defcap SALE-WHITELIST:bool(sale-contract-key:string)
    @event
    (enforce-guard ADMIN-KS)
  )

  (defun add-sale-whitelist:bool (sale-contract:module{sale-v2})
    @doc "Adds quote-guard to quote-guard-whitelist list"
    (let ((sale-key (format "{}" [sale-contract])))
      (with-capability (SALE-WHITELIST sale-key)
        (insert sale-whitelist sale-key
          { 'sale-contract: sale-contract }
    )))
    true
  )

  ; Saves Concrete policy information
  (defschema concrete-policy
    policy:module{kip.token-policy-v2}
  )

  (deftable concrete-policies:{concrete-policy})

  (defcap CONCRETE-POLICY:bool (policy-field:string policy:module{kip.token-policy-v2})
    @event
    (enforce-guard ADMIN-KS))

  (defconst NON_FUNGIBLE_POLICY:string 'non-fungible-policy )
  (defconst ROYALTY_POLICY:string 'royalty-policy )
  (defconst COLLECTION_POLICY:string 'collection-policy )
  (defconst GUARD_POLICY:string 'guard-policy )
  (defconst CONCRETE_POLICY_LIST:[string]
    [NON_FUNGIBLE_POLICY ROYALTY_POLICY COLLECTION_POLICY GUARD_POLICY] )

  (defun write-concrete-policy:bool (policy-field:string policy:module{kip.token-policy-v2})
    (enforce (contains policy-field CONCRETE_POLICY_LIST) "Not registered as concrete policy")
    (with-capability (CONCRETE-POLICY policy-field policy)
      (write concrete-policies policy-field {
        "policy": policy
        }
      )
    true)
  )

  ; Capbilities to guard internal functions

  (defcap OFFER:bool (sale-id:string)
    @doc "Capability to grant internal transaction inside OFFER"
    true
  )

  (defcap BUY:bool (sale-id:string)
    @doc "Capability to grant internal transaction inside BUY"
    true
  )

  (defcap WITHDRAW:bool (sale-id:string)
    @doc "Capability to grant internal transaction inside WITHDRAW"
    true
  )

  ; Map list of policy functions

  (defun enforce-init:[bool]
    (token:object{token-info})
    (let ((ledger:module{ledger-v1} (retrieve-ledger)))
      (require-capability (ledger::INIT-CALL (at "id" token) (at "precision" token) (at "uri" token)))
    )

    (map (lambda (policy:module{kip.token-policy-v2})
      (with-capability (INIT-CALL (at "id" token) (at "precision" token) (at "uri" token) policy)
        (policy::enforce-init token)
      )
    ) (at 'policies token))
  )

  (defun enforce-mint:[bool]
    ( token:object{token-info}
      account:string
      guard:guard
      amount:decimal
    )
    (let ((ledger:module{ledger-v1} (retrieve-ledger)))
      (require-capability (ledger::MINT-CALL (at "id" token) account amount))
    )
    (map (lambda (policy:module{kip.token-policy-v2})
      (with-capability (MINT-CALL (at "id" token) account amount policy)
        (policy::enforce-mint token account guard amount)
      )
    ) (at 'policies token))
  )

  (defun enforce-burn:[bool]
    ( token:object{token-info}
      account:string
      amount:decimal
    )
    (let ((ledger:module{ledger-v1} (retrieve-ledger)))
      (require-capability (ledger::BURN-CALL (at "id" token) account amount))
    )
    (map (lambda (policy:module{kip.token-policy-v2})
      (with-capability (BURN-CALL (at "id" token) account amount policy)
        (policy::enforce-burn token account amount)
      )
    ) (at 'policies token))
  )

  (defun enforce-offer:[bool]
    ( token:object{token-info}
      seller:string
      amount:decimal
      timeout:integer
      sale-id:string )
    @doc " Executed at `offer` step of marmalade.ledger.                             \
    \ Required msg-data keys:                                                        \
    \ * (optional) quote:object{quote-spec} - sale is registered as a quoted fungible \
    \ sale if present. If absent, sale proceeds without quotes."

    (let ((ledger:module{ledger-v1} (retrieve-ledger)))
      (require-capability (ledger::OFFER-CALL (at "id" token) seller amount timeout sale-id))
    )

    (enforce-sale-pact sale-id)
    (enforce (= (pact-id) (tx-hash)) "cannot be triggered as nested defpacts")

    ; Check if quote-msg exists
    (if (exists-msg-quote QUOTE-MSG-KEY)
      ; true - insert quote message and create escrow account in fungible
    (let* (
        (quote-spec:object{quote-spec} (read-msg QUOTE-MSG-KEY))
        (fungible:module{fungible-v2} (at 'fungible quote-spec))
        (escrow-account:object{fungible-account} (get-escrow-account sale-id))
        (token-id:string (at 'id token))
        (quote:object{quote-schema} (+
            { "token-id": token-id
            , 'seller: seller
            , 'amount: amount
            , 'timeout: timeout
            }
            quote-spec))
      )
      (validate-quote quote)
      (insert quotes sale-id quote) ;; void sale type
      (fungible::create-account (at 'account escrow-account) (at 'guard escrow-account))
      (emit-event (QUOTE sale-id token-id quote-spec))
    )
      ; false - skip
      true
    )
     ; run policy::enforce-offer
    (map
      (lambda (policy:module{kip.token-policy-v2})
        (with-capability (OFFER-CALL (at "id" token) seller amount sale-id timeout policy)
          (policy::enforce-offer token seller amount timeout sale-id)
        )
      )
      (at 'policies token))
  )

  (defun enforce-withdraw:[bool]
    ( token:object{token-info}
      seller:string
      amount:decimal
      timeout:integer
      sale-id:string )
    @doc " Executed at `withdraw` step of marmalade.ledger."
    (let ((ledger:module{ledger-v1} (retrieve-ledger)))
      (require-capability (ledger::WITHDRAW-CALL (at "id" token) seller amount timeout sale-id))
    )
    (enforce-sale-pact sale-id)

    (if (exists-quote sale-id)
      (let* (
        (quote-spec:object{quote-schema} (get-quote-info sale-id))
        (sale-type:string (at 'sale-type quote-spec)))

        (if (!= sale-type "")
          (let ((sale-contract:module{sale-v2} (retrieve-sale sale-type)))
            (sale-contract::enforce-withdrawal sale-id))
          true
        ))
      true
    )

    (map (lambda (policy:module{kip.token-policy-v2})
      (with-capability (WITHDRAW-CALL (at "id" token) seller amount sale-id timeout policy)
        (policy::enforce-withdraw token seller amount timeout sale-id)
      )
    ) (at 'policies token))
  )

  (defun enforce-buy:[bool]
    ( token:object{token-info}
      seller:string
      buyer:string
      buyer-guard:guard
      amount:decimal
      sale-id:string )
      @doc " Executed at `buy` step of marmalade.ledger.                                 \
      \ Required msg-data keys:                                                          \
      \ * (optional) buyer_fungible_account:string - The fungible account of the buyer   \
      \ which transfers the fungible to the escrow account. Only required if the sale is \
      \ a quoted sale. "

    (enforce-sale-pact sale-id)

    ;; enforce function is called from ledger
    (let ((ledger:module{ledger-v1} (retrieve-ledger)))
      (require-capability (ledger::BUY-CALL (at "id" token) seller buyer amount sale-id))
    )

    ; Checks if quote is saved at offer
    (if (exists-quote sale-id)

      ; true - quote is used
      (let* (
             (escrow-account:object{fungible-account} (get-escrow-account sale-id))
             (quote-spec:object{quote-schema} (get-quote-info sale-id))
             (fungible:module{fungible-v2} (at 'fungible quote-spec))
             (seller-fungible-account:object{fungible-account} (at 'seller-fungible-account quote-spec))
             (sale-type:string (at 'sale-type quote-spec))
             (sale-price:decimal (at 'sale-price quote-spec))
           )

        ; If a sale contract is being used, update the price accordingly
        (if (!= sale-type "")
          (if (exists-msg-decimal UPDATED-PRICE-KEY)
            (let ((updated-price:decimal (read-msg UPDATED-PRICE-KEY)))
              (fungible::enforce-unit updated-price)
              (with-capability (UPDATE-QUOTE-PRICE (at 'id token) sale-id sale-type updated-price)
                (update quotes sale-id { "sale-price": updated-price })
              )
              true
            )
          true
          )
          true
        )

        (let* (
            (final-sale-price:decimal  (at 'sale-price (get-quote-info sale-id)))
            (mk-fee-spec:object{marketplace-fee-spec} (try { "mk-account": "", "mk-fee-percentage": 0.0 } (read-msg MARKETPLACE-FEE-KEY)))
            (mk-fee-percentage:decimal (at 'mk-fee-percentage mk-fee-spec))
            (mk-fee:decimal (floor (* mk-fee-percentage final-sale-price) (fungible::precision)))
          )
          (enforce (> final-sale-price 0.0) "Price is not finalized for this quote")

          ; Handle the marketplace fee if applicable
          (if (= 0.0 mk-fee-percentage)
            true
            (with-capability (FUNGIBLE-TRANSFER-CALL sale-id)
              (enforce (and (>= mk-fee-percentage 0.0) (<= mk-fee-percentage 1.0)) "Invalid market-fee percentage")

              (install-capability (fungible::TRANSFER (read-msg BUYER-FUNGIBLE-ACCOUNT-MSG-KEY) (at "mk-account" mk-fee-spec) mk-fee))
              (fungible::transfer (read-msg BUYER-FUNGIBLE-ACCOUNT-MSG-KEY) (at "mk-account" mk-fee-spec) mk-fee)
            )
          )

          (with-capability (FUNGIBLE-TRANSFER-CALL sale-id)
            ; Transfer sale amount from buyer to policy manager's escrow account
            (install-capability (fungible::TRANSFER (read-msg BUYER-FUNGIBLE-ACCOUNT-MSG-KEY) (at 'account escrow-account) final-sale-price))
            (fungible::transfer-create (read-msg BUYER-FUNGIBLE-ACCOUNT-MSG-KEY) (at 'account escrow-account) (at 'guard escrow-account) final-sale-price)
          )
          (with-capability (ESCROW sale-id)
            ; Run policies::enforce-buy
            (let ((result:[bool]
              (map (lambda (policy:module{kip.token-policy-v2})
                  (with-capability (BUY-CALL (at "id" token) seller buyer amount sale-id policy)
                    (policy::enforce-buy token seller buyer buyer-guard amount sale-id)
                  )
                ) (at 'policies token))
                ))

              (let (
                    (balance:decimal (fungible::get-balance (at 'account escrow-account)))
                  )
                (install-capability (fungible::TRANSFER (at 'account escrow-account) (at 'account seller-fungible-account) balance))
                (fungible::transfer (at 'account escrow-account) (at 'account seller-fungible-account) balance)
              )
            result
          ))
        )
      )

      ; false: quote is not used
      (map (lambda (policy:module{kip.token-policy-v2})
        (with-capability (BUY-CALL (at "id" token) seller buyer amount sale-id policy)
          (policy::enforce-buy token seller buyer buyer-guard amount sale-id)
        )
      ) (at 'policies token))
    )
  )

  (defun enforce-transfer:[bool]
    ( token:object{token-info}
      sender:string
      guard:guard
      receiver:string
      amount:decimal )
    (let ((ledger:module{ledger-v1} (retrieve-ledger)))
      (require-capability (ledger::TRANSFER-CALL (at "id" token) sender receiver amount))
    )
    (map (lambda (policy:module{kip.token-policy-v2})
      (with-capability (TRANSFER-CALL (at "id" token) sender receiver amount policy)
        (policy::enforce-transfer token sender guard receiver amount)
      )
    ) (at 'policies token))
  )

  (defun enforce-sale-pact:bool (sale:string)
    "Enforces that SALE is id for currently executing pact"
    (enforce (= sale (pact-id)) "Invalid pact/sale id")
  )



  ; Utility functions

  (defun exists-quote:bool (sale-id:string)
    @doc "Looks up quote table for quote"
    (try false (let ((q (get-quote-info sale-id))) true))
  )

  (defun exists-msg-decimal:bool (msg:string)
    @doc "Checks env-data field and see if the msg is a decimal"
    (let  ((d:decimal (try -1.0 (read-msg msg))))
      (!= d -1.0))
  )

  (defun exists-msg-quote:bool (msg:string)
    @doc "Checks env-data field and see if the msg is a object"
    (let ((o:object (try {} (read-msg msg))))
      (!= o {}))
  )

  (defun retrieve-ledger:module{ledger-v1} ()
    @doc "Retrieves the ledger implementation"
    (with-read ledgers "" {
        "ledger-impl":= ledger
      }
    ledger)
  )

  (defun retrieve-sale:module{sale-v2} (sale-type:string)
    @doc "Retrieves the sale-contract"
    (with-read sale-whitelist sale-type {"sale-contract":= sale} sale)
  )

  (defun get-concrete-policy:module{kip.token-policy-v2} (policy-field:string)
    (with-read concrete-policies policy-field {
      "policy":= policy
      }
      policy)
  )

  (defun get-quote-info:object{quote-schema} (sale-id:string)
    @doc "Get Quote information"
    (read quotes sale-id)
  )

  ;; Validate functions
  (defun validate-fungible-account (fungible:module{fungible-v2} account:object{fungible-account})
    (let ((seller-details (fungible::details (at 'account account))))
      (enforce (=
        (at 'guard seller-details) (at 'guard account))
            "Account guard does not match"))
  )

  (defun validate-quote:bool (quote-spec:object{quote-schema})
    (let* ( (fungible:module{fungible-v2} (at 'fungible quote-spec) )
            (seller-fungible-account:object{fungible-account} (at 'seller-fungible-account quote-spec))
            (sale-type:string (at 'sale-type quote-spec))
            (sale-price:decimal (at 'sale-price quote-spec)) )
      (validate-fungible-account fungible seller-fungible-account)
      (fungible::enforce-unit sale-price)
      (if (= sale-type "")
        (enforce (> sale-price 0.0) "Offer price must be positive" )
        [ (retrieve-sale sale-type)
          (enforce (>= sale-price 0.0) "Offer price must be positive or zero")
        ]
      )
      true)
  )
)

(if (read-msg 'upgrade )
  ["upgrade complete"]
  [ (create-table ledgers)
    (create-table concrete-policies)
    (create-table quotes)
    (create-table sale-whitelist)
  ])
(enforce-guard ADMIN-KS)
