create table public.app_test_versions (
  id uuid primary key default gen_random_uuid(),
  isActive boolean default false not null,
  app_id uuid references public.apps(id) on delete cascade,
  version integer not null,
  script text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);


CREATE INDEX idx_app_test_app_id_version ON app_test_versions (app_id, version);


/* insert a new test version for this app. automatically increments the version number. */
CREATE OR REPLACE FUNCTION public.insert_app_test_version(app_id_input uuid, script_input text)
RETURNS TABLE (
  id uuid,
  app_id uuid,
  version integer,
  script text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  WITH next_version AS (
    SELECT COALESCE(MAX(at.version) + 1, 1) AS new_version
    FROM app_test_versions at
    WHERE at.app_id = app_id_input
  )
  INSERT INTO app_test_versions (app_id, version, script)
  SELECT app_id_input, next_version.new_version, script_input
  FROM next_version
  RETURNING app_test_versions.id, app_test_versions.app_id, app_test_versions.version, app_test_versions.script, app_test_versions.created_at, app_test_versions.updated_at;
END;
$$ LANGUAGE plpgsql;


/*
 * Function: activate_app_version
 * Purpose: Activates a specific version of an app and deactivates all other versions for the same app_id
 * Parameters:
 *   - p_version_id: UUID of the version to activate
 * Returns: void
 * Example: SELECT activate_app_version('550e8400-e29b-41d4-a716-446655440000');
 * Notes:
 *   - Updates isActive and updated_at columns
 *   - Assumes version exists and app_id is valid
 */
CREATE OR REPLACE FUNCTION public.activate_app_version(p_app_id UUID, p_test_id UUID)
RETURNS void AS $$
BEGIN
    -- Deactivate all versions for the same app_id
    UPDATE app_test_versions
    SET isActive = false,
        updated_at = timezone('utc'::text, now())
    WHERE app_test_versions.app_id = p_app_id
    AND id != p_test_id;

    -- Activate the specified version
    UPDATE app_test_versions
    SET isActive = true,
        updated_at = timezone('utc'::text, now())
    WHERE id = p_test_id;
END;
$$ LANGUAGE plpgsql;