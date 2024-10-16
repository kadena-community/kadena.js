WITH transfers_by_acct AS (
	SELECT
		*
	FROM
		(
			SELECT
				*
			FROM
				transfers
			WHERE
				from_acct = 'k:22fbc926b497bf3ecc7199b923039e74cdeda12726e1dc4f443953007cf8cc43'
			ORDER BY
				height DESC,
				requestkey DESC,
				idx ASC
		) as t0
	UNION
	ALL
	SELECT
		*
	FROM
		(
			SELECT
				*
			FROM
				transfers
			WHERE
				to_acct = 'k:22fbc926b497bf3ecc7199b923039e74cdeda12726e1dc4f443953007cf8cc43'
			ORDER BY
				height DESC,
				requestkey DESC,
				idx ASC
		) AS t1
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
FROM
	transfers_by_acct
-- OFFSET WHERE PART
WHERE
	(
		"height" <= (
			SELECT
				"height"
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
					'I_Oyt-xi7BdmO9hsATRClofuFE-OpVKAFYtT6Vk8oXc',
					1,
					0,
					'rE7DU8jlQL9x_MPYuniZJf5ICBTAEHAIFQCB4blofP4',
					'-gE_ZELs7JDixNbvLkfgUy6d0DR-3c54SJe7SG-Xm3A'
				)
		)
	)
ORDER BY
	height DESC,
	requestkey DESC,
	idx ASC OFFSET 100
LIMIT
	100;

-- QUERY WITH OFFSET
-- SELECT
-- 	"public"."transfers"."block",
-- 	"public"."transfers"."chainid",
-- 	"public"."transfers"."idx",
-- 	"public"."transfers"."modulehash",
-- 	"public"."transfers"."requestkey",
-- 	"public"."transfers"."amount",
-- 	"public"."transfers"."to_acct",
-- 	"public"."transfers"."from_acct",
-- 	"public"."transfers"."height"
-- FROM
-- 	"public"."transfers"
-- WHERE
-- 	(
-- 		(
-- 			"public"."transfers"."from_acct" = $1
-- 			OR "public"."transfers"."to_acct" = $2
-- 		)
-- 		AND "public"."transfers"."height" <= (
-- 			SELECT
-- 				"public"."transfers"."height"
-- 			FROM
-- 				"public"."transfers"
-- 			WHERE
-- 				(
-- 					"public"."transfers"."block",
-- 					"public"."transfers"."chainid",
-- 					"public"."transfers"."idx",
-- 					"public"."transfers"."modulehash",
-- 					"public"."transfers"."requestkey"
-- 				) = ($3, $4, $5, $6, $7)
-- 		)
-- 	)
-- ORDER BY
-- 	"public"."transfers"."height" DESC OFFSET $8
--    Params: ["875e4493e19c8721583bfb46f0768f10266ebcca33c4a0e04bc099a7044a90f7","875e4493e19c8721583bfb46f0768f10266ebcca33c4a0e04bc099a7044a90f7","I_Oyt-xi7BdmO9hsATRClofuFE-OpVKAFYtT6Vk8oXc",1,0,"rE7DU8jlQL9x_MPYuniZJf5ICBTAEHAIFQCB4blofP4","-gE_ZELs7JDixNbvLkfgUy6d0DR-3c54SJe7SG-Xm3A",0]
