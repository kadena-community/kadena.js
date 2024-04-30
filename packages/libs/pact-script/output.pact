


; AUTO-GENERATED FILE
(namespace "free")
(module my-coin GOVERNANCE
  (implements fungibleV2)
  (implements fungibleXChainV1)
  

  (defcap GOVERNANCE ()
    (enforce false "Enforce non-upgradeability")
  )

  (defschema coin-scheme
    balance: decimal
    guard: guard
  )

  (deftable coin-table:{coin-scheme} )

  (defcap DEBIT (sender:string)
    (enforce_guard (at "guard" (read "coin-table" sender) ))
    (enforce (!= sender "") "valid sender")
  )

  (defcap CREDIT (receiver:string)
    (enforce (!= receiver "") "valid receiver")
  )

  (defcap TRANSFER-mgr (managed:decimal requested:decimal)
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
    (with-read coin-table account
      {"balance" : balance}
      (enforce (<= amount balance) "Insufficient funds")
      (update "coin-table" account { balance: (- balance amount) })
    )
  )

  (defun credit (account:string guard:guard amount:decimal)
    (validate_account account)
    (enforce (> amount 0) "credit amount must be positive")
    (enforce_unit amount)
    (require_capability (CREDIT account))
    (with-default-read coin-table account
      { "balance" : -1, "guard" : guard }
      { "balance" : balance, "guard" : retg }
      (enforce (= retg guard) "account guards do not match")
      (let ((is_new (if (= balance -1) (enforce_reserved account guard) false)))
        (write "coin-table" account { balance: (if is_new amount (+ balance amount)),guard: retg })
    ))
  )

  (defun transfer (sender:string receiver:string amount:decimal)
    (enforce (!= sender receiver) "same sender and receiver")
    (validate_account sender)
    (validate_account receiver)
    (enforce (> amount 0))
    (enforce_unit amount)
    (with_capability (TRANSFER sender receiver amount) 
      (debit sender amount)
      (with-read coin-table receiver
        {"guard" : guard}
        (credit receiver guard amount)
      )
    )
  )
)
  