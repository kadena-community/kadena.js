
-- Add the id column if it doesnt exist
ALTER TABLE
  public.events
ADD
  COLUMN IF NOT EXISTS id INT;

-- Create a sequence for the id column if not already created
CREATE SEQUENCE IF NOT EXISTS public.events_id_seq OWNED BY public.events.id;


-- Update existing entries with unique id's
UPDATE
  public.events
SET
  id = COALESCE(id, nextval('public.events_id_seq'))
WHERE
  id IS NULL;


-- Make the id column not null
ALTER TABLE
  public.events
ALTER COLUMN
  id
SET NOT NULL;


-- Set value of the sequence
SELECT
  setval(
    'public.events_id_seq',
    COALESCE(MAX(public.events.id), 0) + 1,
    false
  )
FROM public.events;


--Set the default value of the id column to the next value of the sequence
ALTER TABLE
  public.events
ALTER COLUMN
  id
SET
  DEFAULT nextval('public.events_id_seq');
