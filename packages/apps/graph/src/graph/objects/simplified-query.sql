SELECT
  "chainid" AS "chain_id",
  "height" AS "height",
  "requestkey" AS "request_key",
  "idx" AS "order_index"
  -- ,
  -- "block" AS "block_hash",
  -- "modulename" AS "module_name",
  -- "modulehash" AS "module_hash",
  -- "from_acct" AS "sender_account",
  -- "to_acct" AS "receiver_account",
  -- "amount" AS "amount",
  -- "row_number",
  -- "is_fungible"
FROM
  (
    SELECT
      *,
      ("modulename") = 'coin' AS "is_fungible",
      ROW_NUMBER() OVER (
        ORDER BY
          "height" DESC,
          "chainid" DESC,
          "requestkey" ASC
      ) AS "row_number"
    FROM
      (
        (
          SELECT
            *
          FROM
            "transfers" AS "t0"
          WHERE
            ("from_acct") = ('w:DD-js2J0pYzsFkqpaTckDmHAH3bVLu5JqwyIbx0yJbg:keys-any')
          ORDER BY
            "height" DESC,
            "chainid" ASC,
            "requestkey" DESC,
            "idx" ASC
        )
        UNION
        ALL (
          SELECT
            *
          FROM
            "transfers"
          WHERE
            ("to_acct") = ('w:DD-js2J0pYzsFkqpaTckDmHAH3bVLu5JqwyIbx0yJbg:keys-any')
          ORDER BY
            "height" DESC,
            "chainid" ASC,
            "requestkey" DESC,
            "idx" ASC
        )
      ) as "t0"
    WHERE
      (
        ("chainid", "height", "idx", "requestkey") >= (
          SELECT
            "chainid",
            "height",
            "idx",
            "requestkey"
          FROM
            "transfers"
          WHERE
            (
              block,
              chainid,
              idx,
              modulehash,
              requestkey
            ) = (
              'EcLdEV2xp6lYQfPxnlVURn9tlSXNiY8Bwb3QKvwmYYo',
              0,
              1,
              'klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s',
              'GUfHY6LGd2PJ8eMjO-6HYYyrpCDsw_xC0PIsL4Y5EwM'
            )
        )
      )
    LIMIT
      50000
  ) AS "t0"
WHERE
  "is_fungible" = true
ORDER BY
  "height" DESC,
  "chain_id" ASC,
  "request_key" DESC,
  "order_index" ASC
-- OFFSET ${condition?.skip || 0}
-- LIMIT ${condition?.take};
LIMIT 20;

