-- Prisma reverse query paginating backwards from cursor
--   Query:
SELECT
   "public"."transfers"."block",
   "public"."transfers"."chainid",
   "public"."transfers"."idx",
   "public"."transfers"."modulehash",
   "public"."transfers"."requestkey",
   "public"."transfers"."amount",
   "public"."transfers"."to_acct",
   "public"."transfers"."from_acct",
   "public"."transfers"."height"
FROM
   "public"."transfers"
WHERE
   (
      (
         "public"."transfers"."from_acct" = '$ 1'
         OR "public"."transfers"."to_acct" = '$ 2'
      )
      AND "public"."transfers"."modulename" = '$ 3'
      AND "public"."transfers"."height" >= (
         SELECT
            "public"."transfers"."height"
         FROM
            "public"."transfers"
         WHERE
            (
               "public"."transfers"."block",
               "public"."transfers"."chainid",
               "public"."transfers"."idx",
               "public"."transfers"."modulehash",
               "public"."transfers"."requestkey"
            ) = ('$ 4', '$ 5', '$ 6', '$ 7', '$ 8')
      )
   )
ORDER BY
   "public"."transfers"."height" ASC OFFSET '$ 9'
-- Params: ["k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94","k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94","coin","gMpReKI-O4oaKwXZlmM5WTx5B5fnOjtoM8DrNBVaXpc",1,0,"rE7DU8jlQL9x_MPYuniZJf5ICBTAEHAIFQCB4blofP4","16vVvYgEEkyCljEabcXDYYy7157ObwOdQ6uDI2xvaZc",0]



   -- Prisma forward query paginating to next page from cursor
   --   Query:
SELECT
   "public"."transfers"."block",
   "public"."transfers"."chainid",
   "public"."transfers"."idx",
   "public"."transfers"."modulehash",
   "public"."transfers"."requestkey",
   "public"."transfers"."amount",
   "public"."transfers"."to_acct",
   "public"."transfers"."from_acct",
   "public"."transfers"."height"
FROM
   "public"."transfers"
WHERE
   (
      (
         "public"."transfers"."from_acct" = '$ 1'
         OR "public"."transfers"."to_acct" = '$ 2'
      )
      AND "public"."transfers"."modulename" = '$ 3'
      AND "public"."transfers"."height" <= (
         SELECT
            "public"."transfers"."height"
         FROM
            "public"."transfers"
         WHERE
            (
               "public"."transfers"."block",
               "public"."transfers"."chainid",
               "public"."transfers"."idx",
               "public"."transfers"."modulehash",
               "public"."transfers"."requestkey"
            ) = ('$ 4', '$ 5', '$ 6', '$ 7', '$ 8')
      )
   )
ORDER BY
   "public"."transfers"."height" DESC OFFSET '$ 9'
-- Params: ["k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94","k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94","coin","gMpReKI-O4oaKwXZlmM5WTx5B5fnOjtoM8DrNBVaXpc",1,2,"rE7DU8jlQL9x_MPYuniZJf5ICBTAEHAIFQCB4blofP4","16vVvYgEEkyCljEabcXDYYy7157ObwOdQ6uDI2xvaZc",0]
