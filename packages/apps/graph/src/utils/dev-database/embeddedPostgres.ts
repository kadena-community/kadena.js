import EmbeddedPostgres from 'embedded-postgres';

const pg: EmbeddedPostgres = new EmbeddedPostgres({
  database_dir: './data/db',
  user: 'graphuser',
  password: 'graphpassword',
  port: 55432,
  persistent: true,
});

function createSigintHandler(pg: EmbeddedPostgres): () => Promise<void> {
  return async () => {
    console.log('Stopping postgres');
    await pg.stop();
    console.log('Postgres stopped');

    process.exit(0);
  };
}

export async function embeddedPostgres(): Promise<void> {
  createSigintHandler(pg);

  try {
    // Create the cluster config files
    await pg.initialise();
  } catch (e) {
    console.log(
      'INFO: Postgres already initialized, remove the data/db folder to reinitialize',
    );
  }

  // Start the server
  await pg.start();
  try {
    await pg.createDatabase('chainweb-data');
  } catch (e) {
    if (e.code === '42P04') {
      console.log(
        'INFO: Database already exists, remove the data/db folder to reinitialize',
      );
    } else {
      throw e;
    }
  }
}
