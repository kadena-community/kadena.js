


; AUTO-GENERATED FILE
(namespace "free")
(module my-coin GOVERNANCE
  (implements fungibleV2)
  (implements fungibleXChainV1)
  

  (defcap PRIVATE-METHOD() true)
  
  (defcap GOVERNANCE ()
    (enforce false "Enforce non-upgradeability")
  )

  (defschema coin-schema
    balance: decimal
    guard: guard
  )

  (deftable coin-table:{coin-schema} )

  (defcap DEBIT (sender:string)
    (enforce-guard (at "guard" (read "coin-table" sender) ))
    (enforce (!= sender "") "valid sender")
  )

  (defcap CREDIT (receiver:string)
    (enforce (!= receiver "") "valid receiver")
  )

  (defcap TRANSFER-mgr:decimal (managed:decimal requested:decimal)
    (let ((newbal (- managed requested)))
      (enforce (>= newbal 0) (format "TRANSFER exceeded for balance {}" [managed]))
      newbal
    )
  )

  (defcap TRANSFER (sender:string receiver:string amount:decimal)
    (managed amount TRANSFER_mgr)
    (enforce (!= sender receiver) "same sender and receiver")
    (enforce-unit amount)
    (enforce (> amount 0))
    (compose-capability (DEBIT sender))
    (compose-capability (CREDIT receiver))
  )

  (defun debit:string (account:string amount:decimal)
    (require-capability (PRIVATE-METHOD))
    (validate-account account)
    (enforce (> amount 0) "debit amount must be positive")
    (enforce-unit amount)
    (require-capability (DEBIT account))
    (with-read coin-table account
      { "balance" := balance }
      (enforce (<= amount balance) "Insufficient funds")
      (update "coin-table" account { balance: (- balance amount) })
    )
  )

  (defun credit:string (account:string guard:guard amount:decimal)
    (require-capability (PRIVATE-METHOD))
    (validate-account account)
    (enforce (> amount 0) "credit amount must be positive")
    (enforce-unit amount)
    (require-capability (CREDIT account))
    (with-default-read coin-table account
      { "balance" : -1, "guard" : guard }
      { "balance" := balance, "guard" := retg }
      (enforce (= retg guard) "account guards do not match")
      (let ((is_new (if (= balance -1) (enforce-reserved account guard) false)))
        (write "coin-table" account { balance: (if is_new amount (+ balance amount)),guard: retg })
    ))
  )

  (defun transfer:string (sender:string receiver:string amount:decimal)
    (enforce (!= sender receiver) "same sender and receiver")
    (validate-account sender)
    (validate-account receiver)
    (enforce (> amount 0))
    (enforce-unit amount)
    (with-capability (TRANSFER sender receiver amount) 
      (with-capability (PRIVATE-METHOD)
        (debit sender amount)
      )
      (with-read coin-table receiver
        { "guard" := guard }
        (with-capability (PRIVATE-METHOD)
          (credit receiver guard amount)
        )
      )
    )
  )
)
  