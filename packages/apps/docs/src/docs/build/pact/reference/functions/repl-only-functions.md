---
title: REPL-only functions
description:
  This document is a reference for the Pact smart-contract language, designed
  for correct, transactional execution on a high-performance blockchain.
menu: REPL-only functions
label: REPL-only functions
order: 11
layout: full
tags: ['pact', 'language reference', 'repl-only functions', 'repl functions']
---

# REPL-only functions

The following functions are loaded automatically into the interactive REPL, or
within script files with a `.repl` extension. They are not available for
blockchain-based execution.

## begin-tx

_&rarr;_&nbsp;`string`

_name_&nbsp;`string` _&rarr;_&nbsp;`string`

Begin transaction with optional NAME.

```bash
pact> (begin-tx "load module")
"Begin Tx 0: load module"
```

## bench

_exprs_&nbsp;`*` _&rarr;_&nbsp;`string`

Benchmark execution of EXPRS.

```pact
(bench (+ 1 2))
```

## commit-tx

_&rarr;_&nbsp;`string`

Commit transaction.

```bash
pact> (begin-tx) (commit-tx)
"Commit Tx 0"
```

## continue-pact

_step_&nbsp;`integer` _&rarr;_&nbsp;`string`

_step_&nbsp;`integer` _rollback_&nbsp;`bool` _&rarr;_&nbsp;`string`

_step_&nbsp;`integer` _rollback_&nbsp;`bool` _pact-id_&nbsp;`string`
_&rarr;_&nbsp;`string`

_step_&nbsp;`integer` _rollback_&nbsp;`bool` _pact-id_&nbsp;`string`
_yielded_&nbsp;`object:<{y}>` _&rarr;_&nbsp;`string`

Continue previously-initiated pact identified STEP, optionally specifying
ROLLBACK (default is false), PACT-ID of the pact to be continued (defaults to
the pact initiated in the current transaction, if one is present), and YIELDED
value to be read with 'resume' (if not specified, uses yield in most recent pact
exec, if any).

```pact
(continue-pact 1)
(continue-pact 1 true)
(continue-pact 1 false "[pact-id-hash]"))
(continue-pact 2 1 false "[pact-id-hash]" { "rate": 0.9 })
```

## env-chain-data

_new-data_&nbsp;`object:~{public-chain-data}` _&rarr;_&nbsp;`string`

Update existing entries of 'chain-data' with NEW-DATA, replacing those items
only.

```bash
pact> (env-chain-data { "chain-id": "TestNet00/2", "block-height": 20 })
"Updated public metadata"
```

## env-data

_json_&nbsp;`<a[integer,string,time,decimal,bool,[<l>],object:<{o}>,keyset]>`
_&rarr;_&nbsp;`string`

Set transaction JSON data, either as encoded string, or as pact types coerced to
JSON.

```bash
pact> (env-data { "keyset": { "keys": ["my-key" "admin-key"], "pred": "keys-any" } })
"Setting transaction data"
```

## env-dynref

_iface_&nbsp;`module` _impl_&nbsp;`module{}` _&rarr;_&nbsp;`string`

_&rarr;_&nbsp;`string`

Substitute module IMPL in any dynamic usages of IFACE in typechecking and
analysis. With no arguments, remove all substitutions.

```pact
(env-dynref fungible-v2 coin)
```

## env-enable-repl-natives

_enable_&nbsp;`bool` _&rarr;_&nbsp;`string`

Control whether REPL native functions are allowed in module code. When enabled,
fixture functions like 'env-sigs' are allowed in module code.

```bash
pact> (env-enable-repl-natives true)
"Repl natives enabled"
```

## env-entity

_&rarr;_&nbsp;`string`

_entity_&nbsp;`string` _&rarr;_&nbsp;`string`

Set environment confidential ENTITY id, or unset with no argument.

```pact
(env-entity "my-org")
(env-entity)
```

## env-events

_clear_&nbsp;`bool` _&rarr;_&nbsp;`[object:*]`

Retreive any accumulated events and optionally clear event state. Object
returned has fields 'name' (fully-qualified event name), 'params' (event
parameters), 'module-hash' (hash of emitting module).

```pact
(env-events true)
```

## env-exec-config

_flags_&nbsp;`[string]` _&rarr;_&nbsp;`[string]`

_&rarr;_&nbsp;`[string]`

Queries, or with arguments, sets execution config flags. Valid flags:
["AllowReadInLocal","DisableHistoryInTransactionalMode","DisableInlineMemCheck","DisableModuleInstall","DisableNewTrans","DisablePact40","DisablePact420","DisablePact43","DisablePact431","DisablePact44","DisablePact45","DisablePact46","DisablePact47","DisablePact48","DisablePact49","DisablePactEvents","DisableRuntimeReturnTypeChecking","EnforceKeyFormats","OldReadOnlyBehavior","PreserveModuleIfacesBug","PreserveModuleNameBug","PreserveNsModuleInstallBug","PreserveShowDefs"]

```bash
pact> (env-exec-config ['DisableHistoryInTransactionalMode]) (env-exec-config)
["DisableHistoryInTransactionalMode"]
```

## env-gas

_&rarr;_&nbsp;`integer`

_gas_&nbsp;`integer` _&rarr;_&nbsp;`string`

Query gas state, or set it to GAS. Note that certain plaforms may charge
additional gas that is not captured by the interpreter gas model, such as an
overall transaction-size cost.

```bash
pact> (env-gasmodel "table") (env-gaslimit 10) (env-gas 0) (map (+ 1) [1 2 3]) (env-gas)
7
```

## env-gaslimit

_limit_&nbsp;`integer` _&rarr;_&nbsp;`string`

Set environment gas limit to LIMIT.

## env-gaslog

_&rarr;_&nbsp;`string`

Enable and obtain gas logging. Bracket around the code whose gas logs you want
to inspect.

```bash
pact> (env-gasmodel "table") (env-gaslimit 10) (env-gaslog) (map (+ 1) [1 2 3]) (env-gaslog)
["TOTAL: 7" "map:GUnreduced:currTotalGas=4: 4" "+:GUnreduced:currTotalGas=5: 1" ":GIntegerOpCost:(1, ):(1, ):currTotalGas=5: 0" "+:GUnreduced:currTotalGas=6: 1" ":GIntegerOpCost:(1, ):(2, ):currTotalGas=6: 0" "+:GUnreduced:currTotalGas=7: 1" ":GIntegerOpCost:(1, ):(3, ):currTotalGas=7: 0"]
```

## env-gasmodel

_model_&nbsp;`string` _&rarr;_&nbsp;`string`

_&rarr;_&nbsp;`string`

_model_&nbsp;`string` _rate_&nbsp;`integer` _&rarr;_&nbsp;`string`

Update or query current gas model. With just MODEL, "table" is supported; with
MODEL and RATE, 'fixed' is supported. With no args, output current model.

```bash
pact> (env-gasmodel)
"Current gas model is 'fixed 0': constant rate gas model with fixed rate 0"
pact> (env-gasmodel 'table)
"Set gas model to table-based cost model"
pact> (env-gasmodel 'fixed 1)
"Set gas model to constant rate gas model with fixed rate 1"
```

## env-gasprice

_price_&nbsp;`decimal` _&rarr;_&nbsp;`string`

Set environment gas price to PRICE.

## env-gasrate

_rate_&nbsp;`integer` _&rarr;_&nbsp;`string`

Update gas model to charge constant RATE.

## env-hash

_hash_&nbsp;`string` _&rarr;_&nbsp;`string`

Set current transaction hash. HASH must be an unpadded base64-url encoded
BLAKE2b 256-bit hash.

```bash
pact> (env-hash (hash "hello"))
"Set tx hash to Mk3PAn3UowqTLEQfNlol6GsXPe-kuOWJSCU0cbgbcs8"
```

## env-keys

_keys_&nbsp;`[string]` _&rarr;_&nbsp;`string`

DEPRECATED in favor of 'env-sigs'. Set transaction signer KEYS. See 'env-sigs'
for setting keys with associated capabilities.

```bash
pact> (env-keys ["my-key" "admin-key"])
"Setting transaction keys"
```

## env-namespace-policy

_allow-root_&nbsp;`bool` _ns-policy-fun_&nbsp;`ns:string ns-admin:guard -> bool`
_&rarr;_&nbsp;`string`

Install a managed namespace policy specifying ALLOW-ROOT and NS-POLICY-FUN.

```pact
(env-namespace-policy (my-ns-policy-fun))
```

## env-sigs

_sigs_&nbsp;`[object:*]` _&rarr;_&nbsp;`string`

Set transaction signature keys and capabilities. SIGS is a list of objects with
"key" specifying the signer key, and "caps" specifying a list of associated
capabilities.

```pact
(env-sigs [{'key: "my-key", 'caps: [(accounts.USER_GUARD "my-account")]}, {'key: "admin-key", 'caps: []}
```

## env-simulate-onchain

_on-chain_&nbsp;`bool` _&rarr;_&nbsp;`string`

Set a flag to simulate on-chain behavior that differs from the repl, in
particular for observing things like errors and stack traces.

```pact
(env-simulate-onchain true)
```

## expect

_doc_&nbsp;`string` _expected_&nbsp;`<a>` _actual_&nbsp;`<a>`
_&rarr;_&nbsp;`string`

Evaluate ACTUAL and verify that it equals EXPECTED.

```bash
pact> (expect "Sanity prevails." 4 (+ 2 2))
"Expect: success: Sanity prevails."
```

## expect-failure

_doc_&nbsp;`string` _exp_&nbsp;`<a>` _&rarr;_&nbsp;`string`

_doc_&nbsp;`string` _err_&nbsp;`string` _exp_&nbsp;`<a>` _&rarr;_&nbsp;`string`

Evaluate EXP and succeed only if it throws an error.

```bash
pact> (expect-failure "Enforce fails on false" (enforce false "Expected error"))
"Expect failure: success: Enforce fails on false"
pact> (expect-failure "Enforce fails with message" "Expected error" (enforce false "Expected error"))
"Expect failure: success: Enforce fails with message"
```

## expect-that

_doc_&nbsp;`string` _pred_&nbsp;`value:<a> -> bool` _exp_&nbsp;`<a>`
_&rarr;_&nbsp;`string`

Evaluate EXP and succeed if value passes predicate PRED.

```bash
pact> (expect-that "addition" (< 2) (+ 1 2))
"Expect-that: success: addition"
pact> (expect-that "addition" (> 2) (+ 1 2))
"FAILURE: addition: did not satisfy (> 2) : 3:integer"
```

## format-address

_scheme_&nbsp;`string` _public-key_&nbsp;`string` _&rarr;_&nbsp;`string`

Transform PUBLIC-KEY into an address (i.e. a Pact Runtime Public Key) depending
on its SCHEME.

## load

_file_&nbsp;`string` _&rarr;_&nbsp;`string`

_file_&nbsp;`string` _reset_&nbsp;`bool` _&rarr;_&nbsp;`string`

Load and evaluate FILE, resetting repl state beforehand if optional RESET is
true.

```pact
(load "accounts.repl")
```

## mock-spv

_type_&nbsp;`string` _payload_&nbsp;`object:*` _output_&nbsp;`object:*`
_&rarr;_&nbsp;`string`

Mock a successful call to 'spv-verify' with TYPE and PAYLOAD to return OUTPUT.

```pact
(mock-spv "TXOUT" { 'proof: "a54f54de54c54d89e7f" } { 'amount: 10.0, 'account: "Dave", 'chainId: "1" })
```

## pact-state

_&rarr;_&nbsp;`object:*`

_clear_&nbsp;`bool` _&rarr;_&nbsp;`object:*`

Inspect state from most recent pact execution. Returns object with fields
'pactId': pact ID; 'yield': yield result or 'false' if none; 'step': executed
step; 'executed': indicates if step was skipped because entity did not match.
With CLEAR argument, erases pact from repl state.

```pact
(pact-state)
(pact-state true)
```

## print

_value_&nbsp;`<a>` _&rarr;_&nbsp;`string`

Output VALUE to terminal as unquoted, unescaped text.

## rollback-tx

_&rarr;_&nbsp;`string`

Rollback transaction.

```bash
pact> (begin-tx "Third Act") (rollback-tx)
"Rollback Tx 0: Third Act"
```

## sig-keyset

_&rarr;_&nbsp;`keyset`

Convenience function to build a keyset from keys present in message signatures,
using 'keys-all' as the predicate.

## test-capability

_capability_&nbsp;` -> bool` _&rarr;_&nbsp;`string`

Acquire (if unmanaged) or install (if managed) CAPABILITY. CAPABILITY and any
composed capabilities are in scope for the rest of the transaction.

```pact
(test-capability (MY-CAP))
```

## typecheck

_module_&nbsp;`string` _&rarr;_&nbsp;`string`

_module_&nbsp;`string` _debug_&nbsp;`bool` _&rarr;_&nbsp;`string`

Typecheck MODULE, optionally enabling DEBUG output.

## verify

_module_&nbsp;`string` _debug_&nbsp;`bool` _&rarr;_&nbsp;`string`

Verify MODULE, checking that all properties hold. Optionally, if DEBUG is set to
true, write debug output to "pact-verify-MODULE" directory.

```pact
(verify "module")
(verify "module" true)
```

## with-applied-env

_exec_&nbsp;`<a>` _&rarr;_&nbsp;`<a>`

Evaluate EXEC with any pending environment changes applied. Normally,
environment changes must execute at top-level for the change to take effect.
This allows scoped application of non-toplevel environment changes.

```bash
pact> (let ((a 1)) (env-data { 'b: 1 }) (with-applied-env (+ a (read-integer 'b))))
2
```
