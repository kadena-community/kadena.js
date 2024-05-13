


; AUTO-GENERATED FILE
(namespace "free")
(module my-coin GOVERNANCE
  (implements fungibleV2)
  (implements fungibleXChainV1)
  

  (defcap PRIVATE-METHOD() true)
  
  (capability GOVERNANCE ()
    (enforce false "Enforce non-upgradeability")
  )

  (defschema coin-schema
    balance: decimal
    guard: guard
  )

  (deftable coin-table:{coin-schema} )

  (capability DEBIT (sender:string)
    (enforce-guard (at "guard" (coinTable.read sender) ))
    (enforce (!= sender "") "valid sender")
  )

  (capability CREDIT (receiver:string)
    (enforce (!= receiver "") "valid receiver")
  )

  (capability TRANSFER-mgr:decimal (managed:decimal requested:decimal)
    (let ((newbal (- managed requested)))
      (enforce (>= newbal 0) (format "TRANSFER exceeded for balance {}" [managed]))
      newbal
    )
  )

  (capability TRANSFER (sender:string receiver:string amount:decimal)
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
    (let ((balance (at "balance" (coinTable.read account))))
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
    (let (( temp_variable (coinTable.read account)))
      (let ((retg (at "guard" temp_variable)))
        (let ((balance (at "balance" temp_variable)))
          (enforce (= retg guard) "account guards do not match")
          (let ((is_new (if (= balance -1) (enforce-reserved account guard) false)))
            (coinTable.write account { balance: (if is_new amount (+ balance amount)),guard: retg })
    ))))
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
      (let ((guard (at "guard" (coinTable.read receiver))))
        (with-capability (PRIVATE-METHOD)
          (credit receiver guard amount)
        )
      )
    )
  )
)
  