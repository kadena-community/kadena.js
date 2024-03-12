export const template = `(begin-tx)
(module test-keys GOVERNANCE
  (defcap GOVERNANCE () true)
  {{#each accounts as |account|}}
  (defconst {{account.account}} "{{account.publicKey}}")
  {{/each}}
)
(commit-tx)


(env-data {
  {{#each accounts as |account|}}
  "{{account.account}}": [ test-keys.{{account.account}} ]{{#unless @last}},{{/unless}}
  {{/each}}
})
(begin-tx)
(namespace "free")
{{#each accounts as |account|}}
(define-keyset "free.{{account.account}}-keyset" (read-keyset "{{account.account}}"))
{{/each}}
(commit-tx)
(print "Registered sender* keysets.")

(env-data {})
(begin-tx)
{{#each accounts as |account|}}
(coin.create-account "{{account.account}}" (describe-keyset "free.{{account.account}}-keyset"))
{{/each}}
(commit-tx)
(print "Created sender* accounts.")

(begin-tx)
(test-capability (coin.COINBASE))
{{#each accounts as |account|}}
(coin.coinbase "{{account.account}}" (describe-keyset "free.{{account.account}}-keyset") 1000000.0)
{{/each}}
(commit-tx)
(print "Funded sender* accounts each with 1,000,000.0 KDA.")`;
