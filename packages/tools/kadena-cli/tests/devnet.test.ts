import { prepareEnvironment } from '@gmrchk/cli-testing-library';

describe('Task: devnet', () => {
  it('create devnet instance without options', async () => {
    const { spawn, cleanup } = await prepareEnvironment();

    const { waitForText, waitForFinish, writeText, pressKey, getExitCode } =
      await spawn('node', './bin/kadena-cli.js devnet create');
    await waitForText(
      'Select an (default) existing devnet configuration or create a new one:',
    );
    await pressKey('enter'); //

    await waitForText('Enter the name for your new devnet container:');
    await writeText('devnet');
    await pressKey('enter');

    await waitForText(
      'Enter a port number to forward to the Chainweb node API (8080)',
    );
    await writeText('8080');
    await pressKey('enter');

    await waitForText('Would you like to create a persistent volume?');
    await pressKey('enter'); //Do not create persistent volume

    await pressKey('enter'); //Do not mount pact files
    await pressKey('enter'); //Use latest version of Kadena Devnet.
    await pressKey('enter'); //the above configuration is correct
    await waitForFinish();
    expect(getExitCode()).toBe(0);

    await cleanup();
  });
  it('start devnet instance without options', async () => {
    const { spawn, cleanup } = await prepareEnvironment();

    const { getExitCode, waitForFinish, getStdout, debug } = await spawn(
      'node',
      './bin/kadena-cli.js devnet run',
    );
    debug();
    await waitForFinish();
    expect(getExitCode()).toBe(0);
    console.log(getStdout());

    await cleanup();
  });
});
