SELECT
  (EVENTS.params ->> 0) AS token,
  ((EVENTS.params ->> 1)) :: integer AS amount,
  ((EVENTS.params -> 2) ->> 'account' :: text) AS sender,
  (((EVENTS.params -> 2) ->> 'current' :: text)) :: integer AS sender_current,
  (((EVENTS.params -> 2) ->> 'previous' :: text)) :: integer AS sender_previous,
  ((EVENTS.params -> 3) ->> 'account' :: text) AS receiver,
  (((EVENTS.params -> 3) ->> 'current' :: text)) :: integer AS receiver_current,
  (((EVENTS.params -> 3) ->> 'previous' :: text)) :: integer AS receiver_previous,
  EVENTS.chainid,
  EVENTS.height,
  EVENTS.requestkey,
  EVENTS.idx,
  EVENTS.block,
  CASE
    WHEN ((EVENTS.module) :: text = 'marmalade.ledger' :: text) THEN 'v1' :: text
    WHEN (
      (EVENTS.module) :: text = 'marmalade-v2.ledger' :: text
    ) THEN 'v2' :: text
    ELSE NULL :: text
  END AS version
FROM
  EVENTS
WHERE
  (
    (
      ((EVENTS.module) :: text = 'marmalade.ledger' :: text)
      OR (
        (EVENTS.module) :: text = 'marmalade-v2.ledger' :: text
      )
    )
    AND ((EVENTS.name) :: text = 'RECONCILE' :: text)
  );