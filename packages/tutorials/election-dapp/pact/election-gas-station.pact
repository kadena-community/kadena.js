(namespace 'free)

(module election-gas-station GOVERNANCE
  (defcap GOVERNANCE ()
    "Only admin can update the smart contract"
    (enforce-keyset "free.election-admin-keyset"))

  ; Signal that the module implements the gas-payer-v1 interface
  (implements gas-payer-v1)

  ; Import the coin module, we need it to create a KDA account that will be controlled
  ; by the gas station
  (use coin)

  (defun chain-gas-price ()
  "Return gas price from chain-data"
  ; chain-data is a built-in function that returns tx public metadata
  ; we are using it to retrieve the tx gas price
  (at 'gas-price (chain-data)))

  (defun enforce-below-or-at-gas-price:bool (gasPrice:decimal)
    (enforce (<= (chain-gas-price) gasPrice)
      (format "Gas Price must be smaller than or equal to {}" [gasPrice])))

  (defcap GAS_PAYER:bool
    ( user:string
      limit:integer
      price:decimal
    )

    ; There are 2 types of Pact transactions: exec and cont
    ; `cont` is used for multi-step pacts, `exec` is for regular transactions.
    ; In our case transaction has to be of type `exec`.
    (enforce (= "exec" (at "tx-type" (read-msg))) "Inside an exec")

    ; A Pact transaction can have multiple function calls, but we only want to allow one
    (enforce (= 1 (length (at "exec-code" (read-msg)))) "Tx of only one pact function")

    ; Gas station can only be used to pay for gas consumed by functions defined in `free-election` module
    (enforce
      ; We take the first 15 characters and compare it with `(free.election`
      ; to make sure a function from our module is called.
      ; `free` is the namespace where our module will be deployed.
      (= "(free.election." (take 15 (at 0 (at "exec-code" (read-msg)))))
      "Only election module calls allowed")

    ;; Limit the gas price that the gas station can pay
    (enforce-below-or-at-gas-price 0.000001)

    ; Import the `ALLOW_GAS` capability
    (compose-capability (ALLOW_GAS))
  )

  (defcap ALLOW_GAS () true)

  (defun create-gas-payer-guard:guard ()
    (create-user-guard (gas-payer-guard))
  )

  (defun gas-payer-guard ()
    (require-capability (GAS))
    (require-capability (ALLOW_GAS))
  )

  (defconst GAS_STATION "election-gas-station")

  (defun init ()
    (coin.create-account GAS_STATION (create-gas-payer-guard))
  )
)

(if (read-msg 'upgrade)
  ["upgrade"]
  [
    (init)
  ]
)