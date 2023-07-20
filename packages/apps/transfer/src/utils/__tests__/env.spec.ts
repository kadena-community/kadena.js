describe('env', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return value from process env when env is not empty', async () => {
    process.env = {
      NODE_ENV: 'test',
      KADENA_TESTNET_API: 'testnet-api',
    };

    // load module
    const env = require('../env').env;
    const result = env('KADENA_TESTNET_API', 'default-api');

    expect(result).toEqual('testnet-api');
  });

  it('should return default value when env is not set', async () => {
    delete process.env.KADENA_TESTNET_API;

    // load module
    const result = require('../env').env('KADENA_TESTNET_API', 'default-api');

    expect(result).toEqual('default-api');
  });

  it('should return default number value when env is not set', async () => {
    delete process.env.GAS_PRICE;

    // load module
    const result = require('../env').env('GAS_PRICE', 0.0001);

    expect(result).toEqual(0.0001);
  });

  it('should return default value from process env when env is empty', async () => {
    process.env.KADENA_TESTNET_API = '';

    // load module
    const result = require('../env').env('KADENA_TESTNET_API', 'default-api');

    expect(result).toEqual('default-api');
  });
});
