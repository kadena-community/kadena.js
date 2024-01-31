
-- Add the id column if it doesnt exist
ALTER TABLE
  events
ADD
  COLUMN IF NOT EXISTS id INT;

-- Create a sequence for the id column if not already created
CREATE SEQUENCE IF NOT EXISTS events_id_seq OWNED BY events.id;


-- Update existing entries with unique id's
UPDATE
  events
SET
  id = COALESCE(id, nextval('events_id_seq'))
WHERE
  id IS NULL;


-- Make the id column not null
ALTER TABLE
  events
ALTER COLUMN
  id
SET NOT NULL;


-- Set value of the sequence
SELECT
  setval(
    'events_id_seq',
    COALESCE(MAX(events.id), 0) + 1,
    false
  )
FROM events;


--Set the default value of the id column to the next value of the sequence
ALTER TABLE
  events
ALTER COLUMN
  id
SET
  DEFAULT nextval('events_id_seq');
