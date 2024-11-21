WITH tr AS (
  -- First subquery: Transfers where the account is the sender
  SELECT
    amount,
    block,
    chainid,
    from_acct,
    height,
    idx,
    modulehash,
    modulename,
    requestkey,
    to_acct
  FROM transfers
  WHERE from_acct = :tspAccount
    AND (:minHeight IS NULL OR height >= :minHeight)
    AND (:maxHeight IS NULL OR height <= :maxHeight)

  UNION ALL

  -- Second subquery: Transfers where the account is the receiver
  SELECT
    amount,
    block,
    chainid,
    from_acct,
    height,
    idx,
    modulehash,
    modulename,
    requestkey,
    to_acct
  FROM transfers
  WHERE to_acct = :tspAccount
    AND (:minHeight IS NULL OR height >= :minHeight)
    AND (:maxHeight IS NULL OR height <= :maxHeight)
)
SELECT
  amount,
  block AS block_hash,
  chainid AS chain_id,
  from_acct AS sender_account,
  height,
  idx AS order_index,
  modulehash AS module_hash,
  modulename AS module_name,
  requestkey AS request_key,
  to_acct AS receiver_account
FROM tr
WHERE modulename = :tspToken
  AND (:tspChainId IS NULL OR chainid = :tspChainId)
ORDER BY
  height DESC,
  requestkey DESC,
  idx ASC;
