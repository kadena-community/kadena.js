(let
    ((mk-guard (lambda (max-gas-price:decimal)
                (util.guards.guard-or
                  (keyset-ref-guard "ns-admin-keyset")
                  (util.guards1.guard-all
                    [ (create-user-guard (coin.gas-only))
                      (util.guards1.max-gas-price max-gas-price)
                      (util.guards1.max-gas-limit 500)
                    ]))
               )
     )
    )

    (coin.transfer-create
      "{{{funding-acct}}}"
      "{{{gas-station-name}}}"
      (mk-guard 0.0000000001)
      {{amount}})
    (coin.rotate
      "{{{gas-station-name}}}"
      (mk-guard 0.00000001))
  )
