export const template = `
(env-exec-config ["DisablePact44", "DisablePact45"])
(begin-tx "Load root contracts")
(env-data {
  'ns-admin-keyset: [],
  'ns-operate-keyset: [],
  'ns-genesis-keyset: { "keys": [], "pred": "="}
})
(load "root/ns.pact")
(load "root/gas-payer-v1.pact")
(load "root/fungible-v2.pact")
(load "root/fungible-xchain-v1.pact")
(load "root/coin-v6.pact")
(commit-tx)


(begin-tx "Load util contracts")
(env-data {
  'util-ns-users: ["{{publicKey}}"],
  'util-ns-admin: ["{{publicKey}}"]
})
(env-sigs [
  { "key": "{{publicKey}}", "caps": [] },
  { "key": "{{publicKey}}", "caps": [] },
  { "key": "{{publicKey}}", "caps": [] }
])
(load "util/util-ns.pact")
(load "util/guards.pact")
(commit-tx)

(print "Loaded kadena/chainweb contracts.")
`.trim();
