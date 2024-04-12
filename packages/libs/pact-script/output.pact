


; AUTO-GENERATED FILE
(namespace "free")
(module coin GOVERNANCE
  (implements fungible_v2)
  (implements fungible_xchain_v1)


  (defcap GOVERNANCE ()
    (enforce false "Enforce non-upgradeability")
  )


  =====Error=====
   PropertyDeclaration is not supported
  @defscheme coin_scheme: coin_scheme;
  ================



  =====Error=====
   PropertyDeclaration is not supported
  @deftable coin_table: Table<coin_scheme>;
  ================


  (defcap DEBIT (sender:string)
    (enforce_guard (at "guard" (coin_table.read sender) ))
    (enforce (!= sender "") "valid sender")
  )

  (defcap CREDIT (receiver:string)
    (enforce (!= receiver "") "valid receiver")
  )

  (defcap TRANSFER_mgr (managed:decimal requested:decimal)
    (let ((newbal (- managed requested)))
      (enforce (>= newbal 0) (format "TRANSFER exceeded for balance {}" [managed]))
      newbal
    )
  )

  (defcap TRANSFER (sender:string receiver:string amount:decimal)
    (managed amount TRANSFER_mgr)
    (enforce (!= sender receiver) "same sender and receiver")
    (enforce_unit amount)
    (enforce (> amount 0))
    (compose_capability (DEBIT sender))
    (compose_capability (CREDIT receiver))
  )

  (defun debit (account:string amount:decimal)
    (validate_account account)
    (enforce (> amount 0) "debit amount must be positive")
    (enforce_unit amount)
    (require_capability (DEBIT account))
    (let ((balance (at "balance" (coin_table.read account))))
      (enforce (<= amount balance) "Insufficient funds")
      (update "coin-table" account { balance: (- balance amount) })
    )
  )

  (defun credit (account:string guard:guard amount:decimal)
    (validate_account account)
    (enforce (> amount 0) "credit amount must be positive")
    (enforce_unit amount)
    (require_capability (CREDIT account))
    (let (( temp_variable (coin_table.read account)))
      (let ((retg (at "guard" temp_variable)))
        (let ((balance (at "balance" temp_variable)))
          (enforce (= retg guard) "account guards do not match")
          (let ((is_new (if (= balance -1) (enforce_reserved account guard) false)))
            (coin_table.write account { balance: (if is_new amount (+ balance amount)),guard: retg })
    ))))
  )

  (defun transfer (sender:string receiver:string amount:decimal)
    (enforce (!= sender receiver) "same sender and receiver")
    (validate_account sender)
    (validate_account receiver)
    (enforce (> amount 0))
    (enforce_unit amount)
    (with_capability (TRANSFER sender receiver amount)
      (debit sender amount)
      (let ((guard (at "guard" (coin_table.read receiver))))
        (credit receiver guard amount)
      )
    )
  )
)
