import { buildUnsignedTransaction } from '../buildUnsignedTransaction';

describe('buildUnsignedTransaction', () => {
  it('builds a transaction from template', () => {
    /**
code: (describe-module "{module}")
signers:
  - public: {signerKey}
    caps:
      - name: "coin.GAS"
        args: []
     */
    const parts = [
      `code: (describe-module "`,
      `")
signers:
  - pubKey: "`,
      `"
    caps:
      - name: "coin.GAS"
        args: []`,
    ];
    const holes = ['module', 'signerKey'];
    const args = { module: 'coin', signerKey: 'no-key' };

    const unsignedTransaction = buildUnsignedTransaction(parts, holes, args);
    const expected = {
      cmd: '{"code":"(describe-module \\"coin\\")","signers":[{"pubKey":"no-key","caps":[{"name":"coin.GAS","args":[]}]}]}',
      hash: 'CiOCI0G3K-azK4dvVraisrHwjZf5WOoUWeL-1KbZAa4',
      sigs: { 'no-key': null },
    };

    expect(unsignedTransaction).toEqual(expected);
  });

  it('throws an error when the json or yaml template is incorrect', () => {
    /**
code: (describe-module "{module}")
signers:
  - public: {signerKey}
    caps:
      - name: "coin.GAS"
        args: []
     */
    const parts = [
      `code: (describe-module "`,
      `")
signers:
  - pubKey: "`,
      `"
  caps:
    - name: "coin.GAS"
      args: []`,
    ];
    const holes = ['module', 'signerKey'];
    const args = { module: 'coin', signerKey: 'no-key' };

    expect(() => buildUnsignedTransaction(parts, holes, args)).toThrow();
  });
});
