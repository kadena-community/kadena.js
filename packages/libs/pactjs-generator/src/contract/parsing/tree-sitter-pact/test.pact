(module coin GOVERNANCE
  (defpact transfer-crosschain
    (sender
      receiver
      receiver-guard
      target-chain
      amount)
    (with-capability (TRANSFER sender receiver amount)
      (body))))
