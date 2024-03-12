export const template = `{{#each preludes as |prelude|}}
(load "{{prelude}}/install.repl")
{{/each}}
(load "tools/test-accounts.repl")
(env-gasmodel "table")
(env-gaslimit {{gasLimit}})
(print "Initialized gas model 'table'")`;
