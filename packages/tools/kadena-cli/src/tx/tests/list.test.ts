import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { services } from '../../services/index.js';
import { runCommand, runCommandJson } from '../../utils/test.util.js';

const txDirectory: string = './test-tx-dir';

const setupTestEnvironment = async (): Promise<void> => {
  await services.filesystem.ensureDirectoryExists(txDirectory);
  await services.filesystem.writeFile(
    `${txDirectory}/transaction-tx1.json`,
    JSON.stringify({
      cmd: '{"payload":{"exec":{"code":"(coin.transfer \\"k:60313e401754007e3525a7474a62500305b8b864b6b616ba933a58c0f89e8d57\\" \\"k:60313e401754007e3525a7474a62500305b8b864b6b616ba933a58c0f89e8d57\\" 0.1)","data":{}}},"nonce":"","networkId":"testnet04","meta":{"sender":"k:60313e401754007e3525a7474a62500305b8b864b6b616ba933a58c0f89e8d57","chainId":"1","creationTime":1716889663,"gasLimit":2300,"gasPrice":0.000001,"ttl":600},"signers":[{"pubKey":"60313e401754007e3525a7474a62500305b8b864b6b616ba933a58c0f89e8d57","clist":[{"name":"coin.TRANSFER","args":["k:60313e401754007e3525a7474a62500305b8b864b6b616ba933a58c0f89e8d57","k:60313e401754007e3525a7474a62500305b8b864b6b616ba933a58c0f89e8d57",0.1]},{"name":"coin.GAS","args":[]}]}]}',
      hash: 'A8rwWNVaOVhSp64xOrOO3mqY8ODfVLejUIQl0uN0rgA',
      sigs: [null],
    }),
  );
  await services.filesystem.writeFile(
    `${txDirectory}/transaction-tx2.json`,
    JSON.stringify({
      cmd: '{"payload":{"exec":{"code":"(coin.transfer \\"k:60313e401754007e3525a7474a62500305b8b864b6b616ba933a58c0f89e8d57\\" \\"k:60313e401754007e3525a7474a62500305b8b864b6b616ba933a58c0f89e8d57\\" 3.0)","data":{}}},"nonce":"","networkId":"testnet04","meta":{"sender":"k:60313e401754007e3525a7474a62500305b8b864b6b616ba933a58c0f89e8d57","chainId":"19","creationTime":1716889752,"gasLimit":2300,"gasPrice":0.000001,"ttl":600},"signers":[{"pubKey":"60313e401754007e3525a7474a62500305b8b864b6b616ba933a58c0f89e8d57","clist":[{"name":"coin.TRANSFER","args":["k:60313e401754007e3525a7474a62500305b8b864b6b616ba933a58c0f89e8d57","k:60313e401754007e3525a7474a62500305b8b864b6b616ba933a58c0f89e8d57",3]},{"name":"coin.GAS","args":[]}]}]}',
      hash: 'YNnPA3CxYYje3zl9ODE1rlQPBhsSRWf_NyNR9qzhIN8',
      sigs: [null],
    }),
  );
  await services.filesystem.writeFile(
    `${txDirectory}/transaction-tx3-signed.json`,
    JSON.stringify({
      cmd: '{"payload":{"exec":{"code":"(coin.transfer \\"k:60313e401754007e3525a7474a62500305b8b864b6b616ba933a58c0f89e8d57\\" \\"k:60313e401754007e3525a7474a62500305b8b864b6b616ba933a58c0f89e8d57\\" 0.1)","data":{}}},"nonce":"","networkId":"testnet04","meta":{"sender":"k:60313e401754007e3525a7474a62500305b8b864b6b616ba933a58c0f89e8d57","chainId":"1","creationTime":1716889663,"gasLimit":2300,"gasPrice":0.000001,"ttl":600},"signers":[{"pubKey":"60313e401754007e3525a7474a62500305b8b864b6b616ba933a58c0f89e8d57","clist":[{"name":"coin.TRANSFER","args":["k:60313e401754007e3525a7474a62500305b8b864b6b616ba933a58c0f89e8d57","k:60313e401754007e3525a7474a62500305b8b864b6b616ba933a58c0f89e8d57",0.1]},{"name":"coin.GAS","args":[]}]}]}',
      hash: 'A8rwWNVaOVhSp64xOrOO3mqY8ODfVLejUIQl0uN0rgA',
      sigs: [
        {
          sig: 'faf5d379f405a09c9f8d71c785d90709940ad658059ddb1f9e33ea1f20c999a71765a1f98bd6632df4da4facfb9e95b950270fa68974c3bdce37dfef03517c0c',
        },
      ],
    }),
  );
};

const cleanupTestEnvironment = async (): Promise<void> => {
  await services.filesystem.deleteDirectory(txDirectory);
};

describe('transaction list', () => {
  beforeEach(async () => {
    await setupTestEnvironment();
  });

  afterEach(async () => {
    await cleanupTestEnvironment();
  });

  it('should list all transactions sorted by signed status', async () => {
    const res: { fileName: string; signed: boolean }[] = await runCommandJson(
      `tx list --directory=${txDirectory}`,
    );

    expect(res).toEqual([
      expect.objectContaining({
        fileName: 'transaction-tx3-signed.json',
        signed: true,
      }),
      expect.objectContaining({
        fileName: 'transaction-tx1.json',
        signed: false,
      }),
      expect.objectContaining({
        fileName: 'transaction-tx2.json',
        signed: false,
      }),
    ]);
  });

  it('should handle empty transaction directory', async () => {
    await cleanupTestEnvironment();
    await services.filesystem.ensureDirectoryExists(txDirectory);

    const res: {
      stdout: string;
      stderr: string;
    } = await runCommand(`tx list --directory=${txDirectory}`);
    expect(res).toEqual({
      stderr: 'No transactions found',
      stdout: '',
    });
  });
});
