# Parser Utilities
We need to parse Pact code to extract information for generating typings and documentation for the client APIs. This package will provide utilities that improve the creation of the grammar/parser (in this approach, the grammar and parser are the same)

## Lexer
First, our initial task is to divide the input string into meaningful tokens. This responsibility is handled by [moo](https://github.com/no-context/moo) internally, but we have an additional layer called the Pointer object. The Pointer object provides us with enhanced flexibility to navigate and access different parts of the token list. You can check the [getPointer](../getPointer.ts) module for more details.

## Rule
A rule is essentially a function that takes the pointer object, allowing it to read as many tokens as necessary, along with a result. There is only one simple requirement: if a rule doesn't match the input, it should reset the pointer and return the FAILED symbol. That's why we have the [rule](./rule.ts) helper function available.

You can define a rule explicitly by creating a function that accepts a pointer, or you can implicitly compose multiple rules using the utilities provided in this package. In most cases, you'll compose rules to define your desired behavior.

For example, the following function is a rule:
```typescript
// match with hello
const hello  = rule((pointer:IPointer)=>{
  const token = pointer.next();
  if(toke.value === "hello"){
    return toke.value
  }
  return FAILED;
})
```
Using the rule helper is not required, but if you choose not to use it, you'll need to manually reset the pointer to its previous location.

### Composing rules
Simple rules alone may not be sufficient to create the entire grammar of a language. This package offers a collection of helpful utilities for composing rules and generating a comprehensive parser. Here is a list of the available helpers provided by the package:
#### seq
It accepts a list of parsers and runs them sequentially. If all of the parsers pass, the rule is considered as passed. However, if any one of the parsers fails, it resets the pointer and returns the FAILED symbol. This approach allows for handling scenarios where multiple conditions need to be satisfied for the rule to pass.

Here is an example of using the seq helper function:
```typescript
// this matches a function function whit an input // function log (message)
const func = seq(id("function"), atom, id("("), atom, id(")"));
```
In addition to checking if the input matches the rule, we often need to extract specific token values. For this purpose, we have the `inspect` helper function. It allows us to extract information within the rules and label it with a name for reference. You can find more details about the `inspect` helper in the [`inspect.ts`](./inspect.ts) file.

Let's extract the function name from our example using the inspect helper. Here's an updated example:
```typescript
// extract the function name as "fn" variable
const func = seq(id("function"), $(atom,'fn'), id("("), atom, id(")"));
```
Let's create a more complex rule just by using seq and $ (inspect) helpers:
```typescript
const func = $(
  'func',
  seq(
    id('function'),
    $('name', atom),
    id('('),
    $('parameter', seq($('name', atom), id(':'), $('type', atom))),
    id(')'),
  ),
);
```
This rule matches a TypeScript function that takes one input, and then it returns the result in the following format:
```typescript
let result = {
  func: {
    name: "fnName",
    parameter:{
      name: "argName",
      type: "argeType"
    }
  }
}
```

Ok, let's get back to the other helpers.
#### block
The `block` function is similar to `seq`, but it groups the input into a block of code. In my implementation, I only considered a block enclosed in parentheses, which surprisingly worked well for parsing Pact. With `block`, if all of the parsers within it match successfully, it will skip the remaining tokens.

Here's an example that demonstrates the usage of `block`. It matches a Pact module, extracts its name and governance, and then skips the rest of the code. As a result, the pointer will be positioned after the closing parentheses, indicating the first token after the block.
```typescript
// matches (module TEST Governance ... )
const module = block(id("module"), $('name', atom), $('governance', atom))
```

#### repeat
The repeat function allows you to specify a set of rules and iteratively applies them to the input. It passes the pointer to each rule one by one, and if a rule successfully matches, it repeats the process again until either the rule can no longer match the input or all tokens have been processed.

In the following example we scan all of the tokens in order to find functions and capabilities in a module. 
```typescript
const moduleBody = repeat(
  $("functions", block(id("defun"), $("name", atom))),
  $("capabilities", block(id("defcap"), $("name", atom))),
  // skip the block if its something else
  block(),
)
```

