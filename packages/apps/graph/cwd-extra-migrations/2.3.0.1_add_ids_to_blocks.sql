ALTER TABLE
  public.blocks
ADD
  COLUMN IF NOT EXISTS id INT;

UPDATE
  public.blocks
SET
  id = COALESCE(id, b.rownum)
FROM
  (
    SELECT
      hash,
      row_number() OVER (
        ORDER BY
          creationtime
      ) AS rownum
    FROM
      public.blocks
  ) b
WHERE
  public.blocks.hash = b.hash
  AND public.blocks.id IS NULL;

ALTER TABLE
  public.blocks
ALTER COLUMN
  id
SET
  NOT NULL;

ALTER TABLE
  public.blocks
ADD
  CONSTRAINT blocks_id_uniq UNIQUE (id);

CREATE SEQUENCE IF NOT EXISTS public.blocks_id_seq OWNED BY public.blocks.id;

SELECT
  setval(
    'public.blocks_id_seq',
    COALESCE(MAX(public.blocks.id), 0) + 1,
    false
  )
FROM
  public.blocks;

ALTER TABLE
  public.blocks
ALTER COLUMN
  id
SET
  DEFAULT nextval('public.blocks_id_seq');
