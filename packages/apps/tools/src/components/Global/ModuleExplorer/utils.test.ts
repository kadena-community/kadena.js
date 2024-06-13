import type {
  IncompleteModuleModel,
  ModuleModel,
} from '@/hooks/use-module-query';
import { describe, expect, it } from 'vitest';
import type { TreeItem } from '../CustomTree/CustomTree';
import {
  checkModuleEquality,
  mapToTabs,
  moduleToOutlineTreeItems,
  moduleToTabId,
  modulesToMap,
  tabIdToModule,
} from './utils';

const codeWithoutInterfaces = `
(interface fungible-v1

  " Standard for fungible coins and tokens as specified in KIP-0002. "

   ; ----------------------------------------------------------------------
   ; Schema

   (defschema account-details
    @doc "Schema for results of 'account' operation."
    @model [ (invariant (!= "" sender)) ]

    account:string
    balance:decimal
    guard:guard)


   ; ----------------------------------------------------------------------
   ; Caps

   (defcap TRANSFER:bool
     ( sender:string
       receiver:string
       amount:decimal
     )
     @doc " Managed capability sealing AMOUNT for transfer from SENDER to \
          \ RECEIVER. Permits any number of transfers up to AMOUNT."
     @managed amount TRANSFER-mgr
     )

   (defun TRANSFER-mgr:decimal
     ( managed:decimal
       requested:decimal
     )
     @doc " Manages TRANSFER AMOUNT linearly, \
          \ such that a request for 1.0 amount on a 3.0 \
          \ managed quantity emits updated amount 2.0."
     )

   ; ----------------------------------------------------------------------
   ; Functionality

   (defun transfer-create:string
     ( sender:string
       receiver:string
       receiver-guard:guard
       amount:decimal
     )
     @doc " Transfer AMOUNT between accounts SENDER and RECEIVER. \
          \ Fails if SENDER does not exist. If RECEIVER exists, guard \
          \ must match existing value. If RECEIVER does not exist, \
          \ RECEIVER account is created using RECEIVER-GUARD. \
          \ Subject to management by TRANSFER capability."
     @model [ (property (> amount 0.0))
              (property (!= sender ""))
              (property (!= receiver ""))
              (property (!= sender receiver))
            ]
     )

   (defpact transfer-crosschain:string
     ( sender:string
       receiver:string
       receiver-guard:guard
       target-chain:string
       amount:decimal
     )
     @doc " 2-step pact to transfer AMOUNT from SENDER on current chain \
          \ to RECEIVER on TARGET-CHAIN via SPV proof. \
          \ TARGET-CHAIN must be different than current chain id. \
          \ First step debits AMOUNT coins in SENDER account and yields \
          \ RECEIVER, RECEIVER_GUARD and AMOUNT to TARGET-CHAIN. \
          \ Second step continuation is sent into TARGET-CHAIN with proof \
          \ obtained from the spv 'output' endpoint of Chainweb. \
          \ Proof is validated and RECEIVER is credited with AMOUNT \
          \ creating account with RECEIVER_GUARD as necessary."
     @model [ (property (> amount 0.0))
              (property (!= sender ""))
              (property (!= receiver ""))
              (property (!= sender receiver))
              (property (!= target-chain ""))
            ]
     )

   (defun get-balance:decimal
     ( account:string )
     " Get balance for ACCOUNT. Fails if account does not exist."
     )

   (defun details:object{account-details}
     ( account: string )
     " Get an object with details of ACCOUNT. \
     \ Fails if account does not exist."
     )

   (defun precision:integer
     ()
     "Return the maximum allowed decimal precision."
     )

   (defun enforce-unit:bool
     ( amount:decimal )
     " Enforce minimum precision allowed for transactions."
     )

   (defun create-account:string
     ( account:string
       guard:guard
     )
     " Create ACCOUNT with 0.0 balance, with GUARD controlling access."
     )

   (defun rotate:string
     ( account:string
       new-guard:guard
     )
     " Rotate guard for ACCOUNT. Transaction is validated against \
     \ existing guard before installing new guard. "
     )

)

`;

const codeWithInterfaces = `
(module coin GOVERNANCE

  @doc "'coin' represents the Kadena Coin Contract. This contract provides both the \
  \buy/redeem gas support in the form of 'fund-tx', as well as transfer,       \
  \credit, debit, coinbase, account creation and query, as well as SPV burn    \
  \create. To access the coin contract, you may use its fully-qualified name,  \
  \or issue the '(use coin)' command in the body of a module declaration."

  @model
    [ (defproperty conserves-mass
        (= (column-delta coin-table 'balance) 0.0))

      (defproperty valid-account (account:string)
        (and
          (>= (length account) 3)
          (<= (length account) 256)))
    ]

  (implements fungible-v2)
  (implements fungible-xchain-v1)

  ;; coin-v2
  (bless "ut_J_ZNkoyaPUEJhiwVeWnkSQn9JT9sQCWKdjjVVrWo")

  ;; coin v3
  (bless "1os_sLAUYvBzspn5jjawtRpJWiH1WPfhyNraeVvSIwU")

  ;; coin v4
  (bless "BjZW0T2ac6qE_I5X8GE4fal6tTqjhLTC7my0ytQSxLU")

  ;; coin v5
  (bless "rE7DU8jlQL9x_MPYuniZJf5ICBTAEHAIFQCB4blofP4")

  ; --------------------------------------------------------------------------
  ; Schemas and Tables

  (defschema coin-schema
    @doc "The coin contract token schema"
    @model [ (invariant (>= balance 0.0)) ]

    balance:decimal
    guard:guard)

  (deftable coin-table:{coin-schema})

  ; --------------------------------------------------------------------------
  ; Capabilities

  (defcap GOVERNANCE ()
    (enforce false "Enforce non-upgradeability"))

  (defcap GAS ()
    "Magic capability to protect gas buy and redeem"
    true)

  (defcap COINBASE ()
    "Magic capability to protect miner reward"
    true)

  (defcap GENESIS ()
    "Magic capability constraining genesis transactions"
    true)

  (defcap REMEDIATE ()
    "Magic capability for remediation transactions"
    true)

  (defcap DEBIT (sender:string)
    "Capability for managing debiting operations"
    (enforce-guard (at 'guard (read coin-table sender)))
    (enforce (!= sender "") "valid sender"))

  (defcap CREDIT (receiver:string)
    "Capability for managing crediting operations"
    (enforce (!= receiver "") "valid receiver"))

  (defcap ROTATE (account:string)
    @doc "Autonomously managed capability for guard rotation"
    @managed
    true)

  (defcap TRANSFER:bool
    ( sender:string
      receiver:string
      amount:decimal
    )
    @managed amount TRANSFER-mgr
    (enforce (!= sender receiver) "same sender and receiver")
    (enforce-unit amount)
    (enforce (> amount 0.0) "Positive amount")
    (compose-capability (DEBIT sender))
    (compose-capability (CREDIT receiver))
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

  (defcap TRANSFER_XCHAIN:bool
    ( sender:string
      receiver:string
      amount:decimal
      target-chain:string
    )

    @managed amount TRANSFER_XCHAIN-mgr
    (enforce-unit amount)
    (enforce (> amount 0.0) "Cross-chain transfers require a positive amount")
    (compose-capability (DEBIT sender))
  )

  (defun TRANSFER_XCHAIN-mgr:decimal
    ( managed:decimal
      requested:decimal
    )

    (enforce (>= managed requested)
      (format "TRANSFER_XCHAIN exceeded for balance {}" [managed]))
    0.0
  )

  (defcap TRANSFER_XCHAIN_RECD:bool
    ( sender:string
      receiver:string
      amount:decimal
      source-chain:string
    )
    @event true
  )

  ; v3 capabilities
  (defcap RELEASE_ALLOCATION
    ( account:string
      amount:decimal
    )
    @doc "Event for allocation release, can be used for sig scoping."
    @event true
  )

  ; --------------------------------------------------------------------------
  ; Constants

  (defconst COIN_CHARSET CHARSET_LATIN1
    "The default coin contract character set")

  (defconst MINIMUM_PRECISION 12
    "Minimum allowed precision for coin transactions")

  (defconst MINIMUM_ACCOUNT_LENGTH 3
    "Minimum account length admissible for coin accounts")

  (defconst MAXIMUM_ACCOUNT_LENGTH 256
    "Maximum account name length admissible for coin accounts")

  (defconst VALID_CHAIN_IDS (map (int-to-str 10) (enumerate 0 19))
    "List of all valid Chainweb chain ids")

  ; --------------------------------------------------------------------------
  ; Utilities

  (defun enforce-unit:bool (amount:decimal)
    @doc "Enforce minimum precision allowed for coin transactions"

    (enforce
      (= (floor amount MINIMUM_PRECISION)
         amount)
      (format "Amount violates minimum precision: {}" [amount]))
    )

  (defun validate-account (account:string)
    @doc "Enforce that an account name conforms to the coin contract \
         \minimum and maximum length requirements, as well as the    \
         \latin-1 character set."

    (enforce
      (is-charset COIN_CHARSET account)
      (format
        "Account does not conform to the coin contract charset: {}"
        [account]))

    (let ((account-length (length account)))

      (enforce
        (>= account-length MINIMUM_ACCOUNT_LENGTH)
        (format
          "Account name does not conform to the min length requirement: {}"
          [account]))

      (enforce
        (<= account-length MAXIMUM_ACCOUNT_LENGTH)
        (format
          "Account name does not conform to the max length requirement: {}"
          [account]))
      )
  )

  ; --------------------------------------------------------------------------
  ; Coin Contract

  (defun gas-only ()
    "Predicate for gas-only user guards."
    (require-capability (GAS)))

  (defun gas-guard (guard:guard)
    "Predicate for gas + single key user guards"
    (enforce-one
      "Enforce either the presence of a GAS cap or keyset"
      [ (gas-only)
        (enforce-guard guard)
      ]))

  (defun buy-gas:string (sender:string total:decimal)
    @doc "This function describes the main 'gas buy' operation. At this point \
    \MINER has been chosen from the pool, and will be validated. The SENDER   \
    \of this transaction has specified a gas limit LIMIT (maximum gas) for    \
    \the transaction, and the price is the spot price of gas at that time.    \
    \The gas buy will be executed prior to executing SENDER's code."

    @model [ (property (> total 0.0))
             (property (valid-account sender))
           ]

    (validate-account sender)

    (enforce-unit total)
    (enforce (> total 0.0) "gas supply must be a positive quantity")

    (require-capability (GAS))
    (with-capability (DEBIT sender)
      (debit sender total))
    )

  (defun redeem-gas:string (miner:string miner-guard:guard sender:string total:decimal)
    @doc "This function describes the main 'redeem gas' operation. At this    \
    \point, the SENDER's transaction has been executed, and the gas that      \
    \was charged has been calculated. MINER will be credited the gas cost,    \
    \and SENDER will receive the remainder up to the limit"

    @model [ (property (> total 0.0))
             (property (valid-account sender))
             (property (valid-account miner))
           ]

    (validate-account sender)
    (validate-account miner)
    (enforce-unit total)

    (require-capability (GAS))
    (let*
      ((fee (read-decimal "fee"))
       (refund (- total fee)))

      (enforce-unit fee)
      (enforce (>= fee 0.0)
        "fee must be a non-negative quantity")

      (enforce (>= refund 0.0)
        "refund must be a non-negative quantity")

      (emit-event (TRANSFER sender miner fee)) ;v3

        ; directly update instead of credit
      (with-capability (CREDIT sender)
        (if (> refund 0.0)
          (with-read coin-table sender
            { "balance" := balance }
            (update coin-table sender
              { "balance": (+ balance refund) }))

          "noop"))

      (with-capability (CREDIT miner)
        (if (> fee 0.0)
          (credit miner miner-guard fee)
          "noop"))
      )

    )

  (defun create-account:string (account:string guard:guard)
    @model [ (property (valid-account account)) ]

    (validate-account account)
    (enforce-reserved account guard)

    (insert coin-table account
      { "balance" : 0.0
      , "guard"   : guard
      })
    )

  (defun get-balance:decimal (account:string)
    (with-read coin-table account
      { "balance" := balance }
      balance
      )
    )

  (defun details:object{fungible-v2.account-details}
    ( account:string )
    (with-read coin-table account
      { "balance" := bal
      , "guard" := g }
      { "account" : account
      , "balance" : bal
      , "guard": g })
    )

  (defun rotate:string (account:string new-guard:guard)
    (with-capability (ROTATE account)

      ; Allow rotation only for vanity accounts, or
      ; re-rotating a principal account back to its proper guard
      (enforce (or (not (is-principal account))
                  (validate-principal new-guard account))
        "It is unsafe for principal accounts to rotate their guard")

      (with-read coin-table account
        { "guard" := old-guard }
        (enforce-guard old-guard)
        (update coin-table account
          { "guard" : new-guard }
          )))
    )


  (defun precision:integer
    ()
    MINIMUM_PRECISION)

  (defun transfer:string (sender:string receiver:string amount:decimal)
    @model [ (property conserves-mass)
             (property (> amount 0.0))
             (property (valid-account sender))
             (property (valid-account receiver))
             (property (!= sender receiver)) ]

    (enforce (!= sender receiver)
      "sender cannot be the receiver of a transfer")

    (validate-account sender)
    (validate-account receiver)

    (enforce (> amount 0.0)
      "transfer amount must be positive")

    (enforce-unit amount)

    (with-capability (TRANSFER sender receiver amount)
      (debit sender amount)
      (with-read coin-table receiver
        { "guard" := g }

        (credit receiver g amount))
      )
    )

  (defun transfer-create:string
    ( sender:string
      receiver:string
      receiver-guard:guard
      amount:decimal )

    @model [ (property conserves-mass) ]

    (enforce (!= sender receiver)
      "sender cannot be the receiver of a transfer")

    (validate-account sender)
    (validate-account receiver)

    (enforce (> amount 0.0)
      "transfer amount must be positive")

    (enforce-unit amount)

    (with-capability (TRANSFER sender receiver amount)
      (debit sender amount)
      (credit receiver receiver-guard amount))
    )

  (defun coinbase:string (account:string account-guard:guard amount:decimal)
    @doc "Internal function for the initial creation of coins.  This function \
    \cannot be used outside of the coin contract."

    @model [ (property (valid-account account))
             (property (> amount 0.0))
           ]

    (validate-account account)
    (enforce-unit amount)

    (require-capability (COINBASE))
    (emit-event (TRANSFER "" account amount)) ;v3
    (with-capability (CREDIT account)
      (credit account account-guard amount))
    )

  (defun remediate:string (account:string amount:decimal)
    @doc "Allows for remediation transactions. This function \
         \is protected by the REMEDIATE capability"
    @model [ (property (valid-account account))
             (property (> amount 0.0))
           ]

    (validate-account account)

    (enforce (> amount 0.0)
      "Remediation amount must be positive")

    (enforce-unit amount)

    (require-capability (REMEDIATE))
    (emit-event (TRANSFER "" account amount)) ;v3
    (with-read coin-table account
      { "balance" := balance }

      (enforce (<= amount balance) "Insufficient funds")

      (update coin-table account
        { "balance" : (- balance amount) }
        ))
    )

  (defpact fund-tx (sender:string miner:string miner-guard:guard total:decimal)
    @doc "'fund-tx' is a special pact to fund a transaction in two steps,     \
    \with the actual transaction transpiring in the middle:                   \
    \                                                                         \
    \  1) A buying phase, debiting the sender for total gas and fee, yielding \
    \     TX_MAX_CHARGE.                                                      \
    \  2) A settlement phase, resuming TX_MAX_CHARGE, and allocating to the   \
    \     coinbase account for used gas and fee, and sender account for bal-  \
    \     ance (unused gas, if any)."

    @model [ (property (> total 0.0))
             (property (valid-account sender))
             (property (valid-account miner))
             ;(property conserves-mass) not supported yet
           ]

    (step (buy-gas sender total))
    (step (redeem-gas miner miner-guard sender total))
    )

  (defun debit:string (account:string amount:decimal)
    @doc "Debit AMOUNT from ACCOUNT balance"

    @model [ (property (> amount 0.0))
             (property (valid-account account))
           ]

    (validate-account account)

    (enforce (> amount 0.0)
      "debit amount must be positive")

    (enforce-unit amount)

    (require-capability (DEBIT account))
    (with-read coin-table account
      { "balance" := balance }

      (enforce (<= amount balance) "Insufficient funds")

      (update coin-table account
        { "balance" : (- balance amount) }
        ))
    )


  (defun credit:string (account:string guard:guard amount:decimal)
    @doc "Credit AMOUNT to ACCOUNT balance"

    @model [ (property (> amount 0.0))
             (property (valid-account account))
           ]

    (validate-account account)

    (enforce (> amount 0.0) "credit amount must be positive")
    (enforce-unit amount)

    (require-capability (CREDIT account))
    (with-default-read coin-table account
      { "balance" : -1.0, "guard" : guard }
      { "balance" := balance, "guard" := retg }
      ; we don't want to overwrite an existing guard with the user-supplied one
      (enforce (= retg guard)
        "account guards do not match")

      (let ((is-new
             (if (= balance -1.0)
                 (enforce-reserved account guard)
               false)))

        (write coin-table account
          { "balance" : (if is-new amount (+ balance amount))
          , "guard"   : retg
          }))
      ))

  (defun check-reserved:string (account:string)
    " Checks ACCOUNT for reserved name and returns type if \
    \ found or empty string. Reserved names start with a \
    \ single char and colon, e.g. 'c:foo', which would return 'c' as type."
    (let ((pfx (take 2 account)))
      (if (= ":" (take -1 pfx)) (take 1 pfx) "")))

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


  (defschema crosschain-schema
    @doc "Schema for yielded value in cross-chain transfers"
    receiver:string
    receiver-guard:guard
    amount:decimal
    source-chain:string)

  (defpact transfer-crosschain:string
    ( sender:string
      receiver:string
      receiver-guard:guard
      target-chain:string
      amount:decimal )

    @model [ (property (> amount 0.0))
             (property (valid-account sender))
             (property (valid-account receiver))
           ]

    (step
      (with-capability
        (TRANSFER_XCHAIN sender receiver amount target-chain)

        (validate-account sender)
        (validate-account receiver)

        (enforce (!= "" target-chain) "empty target-chain")
        (enforce (!= (at 'chain-id (chain-data)) target-chain)
          "cannot run cross-chain transfers to the same chain")

        (enforce (> amount 0.0)
          "transfer quantity must be positive")

        (enforce-unit amount)

        (enforce (contains target-chain VALID_CHAIN_IDS)
          "target chain is not a valid chainweb chain id")

        ;; step 1 - debit delete-account on current chain
        (debit sender amount)
        (emit-event (TRANSFER sender "" amount))

        (let
          ((crosschain-details:object{crosschain-schema}
            { "receiver" : receiver
            , "receiver-guard" : receiver-guard
            , "amount" : amount
            , "source-chain" : (at 'chain-id (chain-data))
            }))
          (yield crosschain-details target-chain)
          )))

    (step
      (resume
        { "receiver" := receiver
        , "receiver-guard" := receiver-guard
        , "amount" := amount
        , "source-chain" := source-chain
        }

        (emit-event (TRANSFER "" receiver amount))
        (emit-event (TRANSFER_XCHAIN_RECD "" receiver amount source-chain))

        ;; step 2 - credit create account on target chain
        (with-capability (CREDIT receiver)
          (credit receiver receiver-guard amount))
        ))
    )


  ; --------------------------------------------------------------------------
  ; Coin allocations

  (defschema allocation-schema
    @doc "Genesis allocation registry"
    ;@model [ (invariant (>= balance 0.0)) ]

    balance:decimal
    date:time
    guard:guard
    redeemed:bool)

  (deftable allocation-table:{allocation-schema})

  (defun create-allocation-account
    ( account:string
      date:time
      keyset-ref:string
      amount:decimal
    )

    @doc "Add an entry to the coin allocation table. This function \
         \also creates a corresponding empty coin contract account \
         \of the same name and guard. Requires GENESIS capability. "

    @model [ (property (valid-account account)) ]

    (require-capability (GENESIS))

    (validate-account account)
    (enforce (>= amount 0.0)
      "allocation amount must be non-negative")

    (enforce-unit amount)

    (let
      ((guard:guard (keyset-ref-guard keyset-ref)))

      (create-account account guard)

      (insert allocation-table account
        { "balance" : amount
        , "date" : date
        , "guard" : guard
        , "redeemed" : false
        })))

  (defun release-allocation
    ( account:string )

    @doc "Release funds associated with allocation ACCOUNT into main ledger.   \
         \ACCOUNT must already exist in main ledger. Allocation is deactivated \
         \after release."
    @model [ (property (valid-account account)) ]

    (validate-account account)

    (with-read allocation-table account
      { "balance" := balance
      , "date" := release-time
      , "redeemed" := redeemed
      , "guard" := guard
      }

      (let ((curr-time:time (at 'block-time (chain-data))))

        (enforce (not redeemed)
          "allocation funds have already been redeemed")

        (enforce
          (>= curr-time release-time)
          (format "funds locked until {}. current time: {}" [release-time curr-time]))

        (with-capability (RELEASE_ALLOCATION account balance)

        (enforce-guard guard)

        (with-capability (CREDIT account)
          (emit-event (TRANSFER "" account balance))
          (credit account guard balance)

          (update allocation-table account
            { "redeemed" : true
            , "balance" : 0.0
            })

          "Allocation successfully released to main ledger"))
    )))

)
`;

describe('checkModuleEquality', () => {
  it('should return true when modules are equal', () => {
    const module1 = {
      name: 'module',
      chainId: '0',
      networkId: 'mainnet01',
    } as const;

    const module2 = {
      name: 'module',
      chainId: '0',
      networkId: 'mainnet01',
    } as const;

    const result = checkModuleEquality(module1, module2);

    expect(result).toBe(true);
  });

  it('should return false when modules are not equal', () => {
    const module1 = {
      name: 'module1',
      chainId: '1',
      networkId: 'testnet04',
    } as const;

    const module2 = {
      name: 'module2',
      chainId: '2',
      networkId: 'mainnet01',
    } as const;

    const result = checkModuleEquality(module1, module2);

    expect(result).toBe(false);

    expect(
      checkModuleEquality(
        { name: 'same-name', chainId: '19', networkId: 'development' },
        { name: 'same-name', chainId: '19', networkId: 'testnet04' },
      ),
    ).toBe(false);
    expect(
      checkModuleEquality(
        { name: 'same-name', chainId: '0', networkId: 'development' },
        { name: 'same-name', chainId: '1', networkId: 'development' },
      ),
    ).toBe(false);
    expect(
      checkModuleEquality(
        { name: 'some-name', chainId: '19', networkId: 'development' },
        { name: 'different-name', chainId: '19', networkId: 'development' },
      ),
    ).toBe(false);
  });
});

describe('moduleToOutlineTreeItems', () => {
  it('should return an empty array if module code is not provided', () => {
    const someModule = {
      name: 'module',
      chainId: '0',
      networkId: 'mainnet01',
    } as const;

    const result = moduleToOutlineTreeItems(someModule, []);

    expect(result).toEqual([]);
  });

  it('should return the correct tree items for interfaces', () => {
    const someModule = {
      name: 'module',
      chainId: '0',
      networkId: 'mainnet01',
      code: codeWithInterfaces,
    } as const;

    const items: TreeItem<IncompleteModuleModel>[] = [
      {
        data: {
          networkId: 'mainnet01',
          name: 'whatever',
          chainId: '8',
        },
        title: 'whatever',
        key: 'whatever',
        children: [
          {
            title: '',
            key: '',
            data: {
              name: 'fungible-v2',
              chainId: '0',
              networkId: 'mainnet01',
            },
            children: [
              {
                title: '',
                key: '',
                data: {
                  chainId: '0',
                  name: '0',
                  networkId: 'mainnet01',
                },
                children: [],
              },
            ],
          },
        ],
      },
    ];

    const result = moduleToOutlineTreeItems(someModule, items);

    expect(result[0]).toEqual({
      title: 'Interfaces',
      key: 'interfaces',
      data: {
        name: 'interfaces',
        chainId: '0',
        networkId: 'mainnet01',
      },
      children: [
        {
          title: 'fungible-v2',
          key: 'mainnet01.fungible-v2',
          label: undefined,
          data: {
            chainId: '0',
            networkId: 'mainnet01',
            name: 'fungible-v2',
          },
          children: [],
        },
        {
          title: 'fungible-xchain-v1',
          key: 'mainnet01.fungible-xchain-v1',
          label: undefined,
          data: {
            chainId: '0',
            networkId: 'mainnet01',
            name: 'fungible-xchain-v1',
          },
          children: [],
        },
      ],
    });
  });

  it('should return the correct tree items for capabilities', () => {
    const someModule = {
      name: 'module',
      chainId: '0',
      networkId: 'mainnet01',
      code: codeWithoutInterfaces,
    } as const;

    const result = moduleToOutlineTreeItems(someModule, []);

    expect(result[0]).toEqual({
      title: 'Capabilities',
      key: 'capabilities',
      data: 'capabilities',
      children: [
        {
          title: 'TRANSFER',
          key: 'TRANSFER',
          data: {
            doc: ' Managed capability sealing AMOUNT for transfer from SENDER to            RECEIVER. Permits any number of transfers up to AMOUNT.',
            kind: 'defcap',
            managed: {
              manager: 'TRANSFER-mgr',
              property: 'amount',
            },
            name: 'TRANSFER',
            parameters: [
              {
                name: 'sender',
                type: 'string',
              },
              {
                name: 'receiver',
                type: 'string',
              },
              {
                name: 'amount',
                type: 'decimal',
              },
            ],
            returnType: 'bool',
          },
          children: [],
        },
      ],
    });
  });

  it('should return the correct tree items for functions', () => {
    const someModule = {
      name: 'module',
      chainId: '0',
      networkId: 'mainnet01',
      code: codeWithoutInterfaces,
    } as const;

    const result = moduleToOutlineTreeItems(someModule, []);

    expect(result[1].title).toEqual('Functions');
    expect(result[1].children[0]).toEqual({
      children: [],
      data: {
        bodyPointer: 55,
        doc: ' Manages TRANSFER AMOUNT linearly,            such that a request for 1.0 amount on a 3.0            managed quantity emits updated amount 2.0.',
        kind: 'defun',
        name: 'TRANSFER-mgr',
        parameters: [
          {
            name: 'managed',
            type: 'decimal',
          },
          {
            name: 'requested',
            type: 'decimal',
          },
        ],
        returnType: 'decimal',
      },
      key: 'TRANSFER-mgr',
      title: 'TRANSFER-mgr',
    });
  });
});

describe('modulesToMap', () => {
  it('should convert an array of modules to a map', () => {
    const modules: ModuleModel[] = [
      {
        name: 'module1',
        chainId: '1',
        networkId: 'mainnet01',
        code: 'some code',
      },
      {
        name: 'module2',
        chainId: '2',
        networkId: 'testnet04',
        code: 'some code',
      },
      {
        name: 'module1',
        chainId: '3',
        networkId: 'development',
        code: 'some code',
      },
    ];

    const result = modulesToMap(modules);

    expect(result.size).toBe(2);
    expect(result.get('module1')).toEqual([
      {
        name: 'module1',
        chainId: '1',
        networkId: 'mainnet01',
        code: 'some code',
      },
      {
        name: 'module1',
        chainId: '3',
        networkId: 'development',
        code: 'some code',
      },
    ]);
    expect(result.get('module2')).toEqual([
      {
        name: 'module2',
        chainId: '2',
        networkId: 'testnet04',
        code: 'some code',
      },
    ]);
  });
});

describe('moduleToTabId', () => {
  it('should generate a unique tab id for a module', () => {
    const someModule = {
      name: 'module1',
      chainId: '1',
      networkId: 'testnet04',
      code: 'some code',
    } as const;

    const result = moduleToTabId(someModule);

    expect(result).toBe('testnet04!_&_!module1!_&_!1');
  });
});

describe('tabIdToModule', () => {
  it('should convert a tab id to a module', () => {
    const tabId = 'testnet04!_&_!module1!_&_!1';

    const result = tabIdToModule(tabId);

    expect(result).toEqual({
      networkId: 'testnet04',
      name: 'module1',
      chainId: '1',
    });
  });
});

describe('mapToTabs', () => {
  it('should convert a map of modules to an array of tabs', () => {
    const map: Map<string, ModuleModel[]> = new Map([
      [
        'module1',
        [
          {
            name: 'module1',
            chainId: '1',
            networkId: 'mainnet01',
            code: 'some code',
          },
          {
            name: 'module1',
            chainId: '2',
            networkId: 'testnet04',
            code: 'some code',
          },
        ],
      ],
      [
        'module2',
        [
          {
            name: 'module2',
            chainId: '1',
            networkId: 'mainnet01',
            code: 'some code',
          },
          {
            name: 'module2',
            chainId: '2',
            networkId: 'testnet04',
            code: 'some code',
          },
        ],
      ],
    ]);

    const result = mapToTabs(map);

    expect(result).toEqual([
      {
        title: 'module1',
        children: [
          {
            name: 'module1',
            chainId: '1',
            networkId: 'mainnet01',
            code: 'some code',
          },
          {
            name: 'module1',
            chainId: '2',
            networkId: 'testnet04',
            code: 'some code',
          },
        ],
      },
      {
        title: 'module2',
        children: [
          {
            name: 'module2',
            chainId: '1',
            networkId: 'mainnet01',
            code: 'some code',
          },
          {
            name: 'module2',
            chainId: '2',
            networkId: 'testnet04',
            code: 'some code',
          },
        ],
      },
    ]);
  });
});
