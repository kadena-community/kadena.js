CREATE VIEW reconcile AS
SELECT params ->> 0 AS token
     , (params ->> 1) :: INT AS amount
     , params -> 2 ->> 'account' AS sender
     , (params -> 2 ->> 'current') :: INT AS sender_current
     , (params -> 2 ->> 'previous') :: INT AS sender_previous
     , params -> 3 ->> 'account' AS receiver
     , (params -> 3 ->> 'current') :: INT  AS receiver_current
     , (params -> 3 ->> 'previous') :: INT  AS receiver_previous
     , chainid
     , height
     , requestkey
     , idx
     , block
     , id
     , CASE
         WHEN module = 'marmalade.ledger' THEN 'v1'
         WHEN module = 'marmalade-v2.ledger' THEN 'v2'
       END AS version
FROM events
WHERE ( module = 'marmalade.ledger' OR module = 'marmalade-v2.ledger' )
  AND name = 'RECONCILE'
;

CREATE INDEX exp_reconcile_token_chainid_height_idx
  ON events ((params ->> 0), chainid, height DESC)
  WHERE (module = 'marmalade.ledger' OR module = 'marmalade-v2.ledger')
  AND name = 'RECONCILE'
;

CREATE INDEX exp_reconcile_sender_token_idx
  ON events ((params -> 2 ->> 'account'), (params ->> 0))
  WHERE (module = 'marmalade.ledger' OR module = 'marmalade-v2.ledger')
  AND name = 'RECONCILE'
;
