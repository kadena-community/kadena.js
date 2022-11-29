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
      code: '(describe-module "coin")',
      data: {},
      networkId: 'testnet04',
      publicMeta: {
        chainId: '1',
        gasLimit: 2500,
        gasPrice: 1e-8,
        sender: '',
        ttl: 28800,
      },
      signers: [
        {
          caps: [
            {
              args: [],
              name: 'coin.GAS',
            },
          ],
          pubKey: 'no-key',
        },
      ],
      sigs: [],
      type: 'exec',
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
