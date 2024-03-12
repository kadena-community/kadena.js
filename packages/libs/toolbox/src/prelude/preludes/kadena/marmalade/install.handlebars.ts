export const template = `
(begin-tx)
  (define-namespace 'kip (sig-keyset) (sig-keyset))
  (load "kip/account-protocols-v1.pact")
  (env-data { 'ns: "kip", 'upgrade: false })
  (load "kip/manifest.pact")
  (load "kip/token-policy-v2.pact")
  (load "kip/poly-fungible-v3.pact")
  (load "util/fungible-util.pact")
  (load "util/guards1.pact")
(commit-tx)

(begin-tx "deploy marmalade-v2 namespace and admin keyset")
  (env-data
   { 'marmalade-admin: ["{{publicKey}}"]
   , 'marmalade-user: ["{{publicKey}}"]
   , 'ns: "marmalade-v2"
   , 'upgrade: false })
   (env-sigs [
     { 'key: "{{publicKey}}"
      ,'caps: []
      }])
  (load "marmalade-ns/ns-marmalade.pact")
  (env-data
   { "marmalade-v2.marmalade-contract-admin": ["{{publicKey}}"]
   , 'ns: "marmalade-v2"
   , 'upgrade: false })
   (env-sigs [
     { 'key: "{{publicKey}}"
      ,'caps: []
     }, {
       'key: "{{publicKey}}"
      ,'caps: []
      }])
  (load "marmalade-ns/ns-contract-admin.pact")
(commit-tx)

(begin-tx "deploy marmalade-sale namespace and admin keyset")
  (env-data
   { 'marmalade-admin: ["{{publicKey}}"]
   , 'marmalade-user: ["{{publicKey}}"]
   , 'ns: "marmalade-sale"
   , 'upgrade: false })
   (env-sigs [
     { 'key: "{{publicKey}}"
      ,'caps: []
      }])
  (load "marmalade-ns/ns-marmalade.pact")
  (env-data
   { "marmalade-sale.marmalade-contract-admin": ["{{publicKey}}"]
   , 'ns: "marmalade-sale"
   , 'upgrade: false })
   (env-sigs [
     { 'key: "{{publicKey}}"
      ,'caps: []
     }, {
       'key: "{{publicKey}}"
      ,'caps: []
      }])
  (load "marmalade-ns/ns-contract-admin.pact")
(commit-tx)

(env-data
 { 'marmalade-admin: ["{{publicKey}}"]
 , 'marmalade-user: ["{{publicKey}}"]
 , 'ns: "marmalade-v2"
 , 'upgrade: false })

(begin-tx)
  (load "marmalade-v2/ledger.interface.pact")
  (load "marmalade-v2/sale.interface.pact")
  (load "marmalade-v2/policy-manager.pact")
  (load "marmalade-v2/ledger.pact")
  (load "marmalade-v2/util-v1.pact")
(commit-tx)

(begin-tx "load concrete-polices")
  (load "marmalade-v2/non-fungible-policy-v1.pact")
  (load "marmalade-v2/royalty-policy-v1.pact")
  (load "marmalade-v2/collection-policy-v1.pact")
  (load "marmalade-v2/guard-policy-v1.pact")
  (load "marmalade-v2/manager-init.pact")
(commit-tx)
(print "Loaded marmalade contracts.")
`.trim();
