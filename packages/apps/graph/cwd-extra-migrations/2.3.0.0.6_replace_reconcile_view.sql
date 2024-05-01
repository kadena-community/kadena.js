DROP VIEW IF EXISTS reconcile;

CREATE VIEW reconcile AS
SELECT params ->> 0 AS token
     , (params ->> 1) :: DECIMAL AS amount
     , params -> 2 ->> 'account' AS sender
     , (params -> 2 ->> 'current') :: DECIMAL AS sender_current
     , (params -> 2 ->> 'previous') :: DECIMAL AS sender_previous
     , params -> 3 ->> 'account' AS receiver
     , (params -> 3 ->> 'current') :: DECIMAL  AS receiver_current
     , (params -> 3 ->> 'previous') :: DECIMAL  AS receiver_previous
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
