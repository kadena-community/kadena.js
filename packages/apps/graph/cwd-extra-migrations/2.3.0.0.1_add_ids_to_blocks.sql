ALTER TABLE
  blocks
ADD
  COLUMN IF NOT EXISTS id INT;

UPDATE
  blocks
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
      blocks
  ) b
WHERE
  blocks.hash = b.hash
  AND blocks.id IS NULL;

ALTER TABLE
  blocks
ALTER COLUMN
  id
SET
  NOT NULL;

ALTER TABLE
  blocks
ADD
  CONSTRAINT blocks_id_uniq UNIQUE (id);

CREATE SEQUENCE IF NOT EXISTS blocks_id_seq OWNED BY blocks.id;

SELECT
  setval(
    'blocks_id_seq',
    COALESCE(MAX(blocks.id), 0) + 1,
    false
  )
FROM
  blocks;

ALTER TABLE
  blocks
ALTER COLUMN
  id
SET
  DEFAULT nextval('blocks_id_seq');
