# Kadena/client

- support defpact (continuations)
  - TODO extra implementation
- support defun->defcap
  - TODO parser to connect defun with defcap

- split between
  - code generation
  - transaction management

- Pact.modules.coin.transfer()  
  // `(coin.transfer "k:${string}" "k:${string}" ${number})`

# 1.0.0

- keep the interface of
  Pact.modules.coin.transfer().addCap.addMeta.addSigners... etc
- make the interface of Pact.modules.coin.transfer() should be compatible with
  the functional approach

# 1.1.0

- The builder-pattern will still be available 1.1.0
- The functional pattern will be exposed
- the builder-pattern will make use of the function such that it will provide an
  abstraction over the functional approach
