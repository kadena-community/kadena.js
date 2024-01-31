const transferTemplate = `
code: |-
  (coin.transfer "{{{account-from}}}" "{{{account-to}}}" {{amount}})
data:
meta:
  chainId: "{{chain}}"
  sender: "{{{account-from}}}"
  gasLimit: 4600
  gasPrice: 0.000001
  ttl: 600
networkId: {{networkId}}
signers:
  - public: "{{pk-from}}"
    caps:
      - name: "coin.TRANSFER"
        args: ["{{{account-from}}}", "{{{account-to}}}", {{amount}}]
  - public: "{{pk-from}}"
    caps:
      - name: "coin.GAS"
        args: []
type: exec
`;

export const defaultTemplates = {
  transfer: transferTemplate,
} as Record<string, string>;
