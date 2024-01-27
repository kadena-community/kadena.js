const transferTemplate = `
code: |-
  (coin.transfer "{{{from-acct}}}" "{{{to-acct}}}" {{amount}})
data:
meta:
  chainId: "{{chain}}"
  sender: "{{{pk-from}}}"
  gasLimit: 2300
  gasPrice: 0.000001
  ttl: 600
networkId: {{networkId}}
signers:
  - public: "{{pk-from}}"
    caps:
      - name: "coin.TRANSFER"
        args: ["{{{from-acct}}}", "{{{to-acct}}}", {{amount}}]
      - name: "coin.GAS"
        args: []
type: exec
`;

export const defaultTemplates = {
  transfer: transferTemplate,
} as Record<string, string>;
