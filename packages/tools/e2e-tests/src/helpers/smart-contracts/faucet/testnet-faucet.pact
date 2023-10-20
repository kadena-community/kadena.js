(namespace "user")
(module coin-faucet GOVERNANCE

  "'coin-faucet' represents Kadena's Coin Faucet Contract."

  ;; TODO - use hashed import
  (use coin)

  ; --------------------------------------------------------------------------
  ; Governance
  ; --------------------------------------------------------------------------

  (defcap GOVERNANCE ()
    (enforce-guard (at 'guard (details 'contract-admins))))

  ; --------------------------------------------------------------------------
  ; Schemas and Tables
  ; --------------------------------------------------------------------------

  (defschema history
    @doc "Table to record the behavior of addresses. Last transaction time,       \
    \ total coins earned, and total coins returned are inserted or updated at     \
    \ transaction. "
    total-coins-earned:decimal
    total-coins-returned:decimal
    last-request-time:time
    )

  (deftable history-table: {history})

  ; --------------------------------------------------------------------------
  ; Constants
  ; --------------------------------------------------------------------------

  (defconst FAUCET_ACCOUNT:string 'coin-faucet)
  (defconst MAX_COIN_PER_REQUEST:decimal 100.0)
  (defconst WAIT_TIME_PER_REQUEST 1.0)
  (defconst EPOCH (time "1970-01-01T00:00:00Z"))

  ; --------------------------------------------------------------------------
  ; Coin Faucet Contract
  ; --------------------------------------------------------------------------

  (defcap FUND() true)

  (defun faucet-guard:guard () (create-capability-guard (FUND)))

  (defun request-coin:string (address:string amount:decimal)

    (enforce (<= amount MAX_COIN_PER_REQUEST)
      "Has reached maximum coin amount per request")

    (with-capability (FUND)
      (transfer FAUCET_ACCOUNT address amount))

    (with-default-read history-table address
      { "total-coins-earned": 0.0,
      "total-coins-returned": 0.0,
      "last-request-time": EPOCH
      }
      { "total-coins-earned":= total-coins-earned,
      "total-coins-returned":= total-coins-returned,
      "last-request-time":= last-request-time
      }

      (enforce (>= (diff-time (curr-time) last-request-time) WAIT_TIME_PER_REQUEST)
        "Coin can be requested every 30 minutes")

      (let  (( total-coins (+ amount total-coins-earned)))

        (write history-table address {
          "total-coins-earned": total-coins,
          "total-coins-returned": total-coins-returned,
          "last-request-time": (curr-time) }))))

  (defun create-and-request-coin:string (address:string address-guard:guard amount:decimal)
    @doc "Transfers AMOUNT of coins up to MAX_COIN_PER_REQUEST from the faucet    \
    \ account to the requester account at ADDRESS. Inserts or updates the         \
    \ transaction of the account at ADDRESS in history-table. Limits the number   \
    \ of coin requests by time, WAIT_TIME_PER_REQUEST "
    @model [(property (<= amount MAX_COIN_PER_REQUEST))]

    (enforce (<= amount MAX_COIN_PER_REQUEST)
      "Has reached maximum coin amount per request")

      (with-capability (FUND)
        (transfer-create FAUCET_ACCOUNT address address-guard amount))
      (insert history-table address {
        "total-coins-earned": amount,
        "total-coins-returned": 0.0,
        "last-request-time": (curr-time) }))

  (defun return-coin:string (address:string amount:decimal)
    @doc "Returns the AMOUNT of coin from account at ADDRESS back to the faucet   \
    \ account after use. Updates the transaction of the account at ADDRESS in     \
    \ history-table keep track of behavior. "
    @model [(property (> amount 0.0))]

    (with-read history-table address
      {"total-coins-returned":= coins-returned}
      (transfer address FAUCET_ACCOUNT amount)
      (update history-table address
        {"total-coins-returned": (+ amount coins-returned)})))

  (defun read-history:object{history} (address:string)
    @doc "Returns history of the account at ADDRESS"
    (read history-table address))

  (defun curr-time ()
    (at 'block-time (chain-data)))
)
(if (read-msg 'upgrade)
  ["Upgrade successful"]
  [(create-table history-table)])
