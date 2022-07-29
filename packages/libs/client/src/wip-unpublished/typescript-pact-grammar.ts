type PactModule<TModule> =
  TModule extends `(module ${infer TModuleName} ${infer TModuleContent})`
    ? {
        moduleName: TModuleName;
        defuns: PactDefun<TModuleContent>;
      }
    : never;

type PactDefun<TDefun> =
  TDefun extends `${string}(defun ${infer TName} (${infer TArgs})${string})${infer TRest}`
    ? {
        name: TName extends `${infer TName}:${infer TType}`
          ? { name: TName; type: TType }
          : { name: TName };
        args: TPactArgs<TArgs>;
      } | PactDefun<TRest>
    : never;

type TPactArgs<Args> = Args extends `${infer TLeft} ${infer TRight}`
  ? [TLeft, FlatArray<TPactArgs<TRight>, 1>]
  : Args;

/**
 * @internal
 */
export type CoinModule = PactModule<`(module coin GOVERNANCE

  (defun TRANSFER-mgr:decimal (managed:decimal requested:decimal)
	  (let ((newbal (- managed requested)))
      (enforce (>= newbal 0.0)
        (format "TRANSFER exceeded for balance {}" [managed]))
      newbal)
  )


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
)`>;
