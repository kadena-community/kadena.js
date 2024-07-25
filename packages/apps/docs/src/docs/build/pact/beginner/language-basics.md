---
title: Explore basic functions
description: Start learning the Pact programming language with an introduction to built-in functions and writing your own simple functions.
menu: Smart contracts
label: Explore basic functions
order: 4
layout: full
tags: ['pact', 'language basics']
---

# Explore basic functions

In [Set up a local development network](/build/pact/dev-network), you learned how to set up a local development environment and connect to it using Chainweaver. 
Chainweaver provides a Module Explorer as part of its development environment.
The Module Explorer enables you to navigate smart contract modules—that is, `.pact` files—review module code, and view or call module functions. 
Chainweaver also includes an editor for working directly with the code and the Pact read-evaluate-print-loop (REPL) interactive interpreter for testing your code as you go.
In most cases, you can use the account and contract management features in Chainweaver in combination with an integrated development environment (IDE), like Visual Studio Code, or another code editor to provide end-to-end development environment. 

In this tutorial, you'll learn the basics for working with the Pact programming language and the built-in functions that Pact provides using the Pact REPL interpreter and Visual Studio Code.
If you use Chainweaver or another IDE for your code editor, you'll need to adjust some steps to suit your environment. 

## Basic operations and data types

Pact, like most programming languages, supports the data types that you would expect.
For example, Pact allows you define the following types of data:

| Data type | Description | Examples
| :--------- | :----------- | :-------
| Integer | Any whole number value—positive or negative—that doesn't include a decimal.| 1, 2, 3, -19
| Decimal | Any number value that includes a decimal. Decimal values can have a potentially unlimited precision. | 1.0, 23.5, 3.14159265359
| String | Any text within quotes. You can represent strings using double quotes or, in some cases, using a single quote. | “Hello”, "Welcome to the show", 'hello
| Boolean | Anything that is represented by true and false literals. | true, false
| List | List literals are created inside square brackets ([ ]). List items can be separated with spaces or commas. If all of the items in the list have the same type, then the type is defined by the content of the list. Otherwise, the type is just defined as a “list”. | [1,2,3] or [1 2 3] = “[Integer]” [1 2 true] = “list”
| Object | Objects are dictionaries specifying key-value pairs created inside curly braces ({ }). | {“house”:”blue”, “locked”:”no”}

For more information about data types, see [Pact syntax](/reference/syntax).

If you aren't sure about the data type when you are working in Pact, you can check its data type by using the Pact `typeof`
built-in function.

To try it yourself:

1. Open a terminal shell on your local computer.
2. Start the Pact REPL interpreter you installed in [Install Pact](/build/pact/dev-network#install-pacth1989060372) by running the following command:
   
   ```bash
   pact
   ```

3. Use the `typeof` built-in function to test different data types.
   
   In Pact, functions are enclosed by parenthesis, so to test a list data type, for example:
   
   ```pact
   (typeof [1,2,3])
   ```
   
   After you run the command, the `typeof` function returns that this is a list with any type of data items:

   ```pact
   "[<a>]"
   ```

### String operations

If most cases, you use double quotation marks (" ") around strings to support whitespace or multi-line strings.
However, you can also represent strings by prepending the string with a single quotation mark (').

Typically, you use a single quotation mark to identify strings that are used as function names or table names. 
You can't identify a string with a single quotation mark if the string includes whitespace or requires multiple lines, but this can be a helpful way to identify certain type of strings more succinctly.

For more information about using a single quotation mark for function or table names, see [symbols](/reference/syntax).

To work with strings:

1. Open a terminal shell on your local computer.
2. Start the Pact REPL interpreter you installed in [Install Pact](/build/pact/dev-network#install-pacth1989060372) by running the following command:
   
   ```bash
   pact
   ```

3. Use double quotation marks to identify a string.

   ```pact
   pact> "Where the wild things are"
   "Where the wild things are"
   ```

3. Use a single quotation mark to identify a string.

   ```pact
   pact> 'hello
   "hello"
   ```

1. Concatenate two strings using the built-in `add` function.
   
   ```pact
   pact> (+ 'Hello " darkness my old friend")
   "Hello darkness my old friend"
   ```

### List and object operations

Pact allows you to express lists using square brackets and objects using curly braces.
Pact objects are similar to JavaScript objects defined using key-value pairs.

To create lists and objects:

1. Open a terminal shell on your local computer.
2. Start the Pact REPL interpreter you installed in [Install Pact](/build/pact/dev-network#install-pacth1989060372) by running the following command:
   
   ```bash
   pact
   ```

3. Use double quotation marks to identify strings in a list using square brackets.
   
   ```pact
   pact> ["Alice" "Dinesh" "Lee"]
   ["Alice" "Dinesh" "Lee"]
   ```

4. Use double quotation marks to identify strings in an object that describes a cat named Scratchy who’s 6 years old.

   ```pact
   pact> { "type": "cat", "name": "Scratchy", "age": 6 }
   {"type": "cat", "name": "Scratchy", "age": 6}
   ```

5. Make a list that that contains two objects that describe a cat named Scratchy and a dog named Fluffy.
   
   ```pact
   pact> [ { "type": "cat", "name": "Scratchy", "age": 6 } { "type": "dog", "name": "Fluffy", "age": 3 } ]
   [{"type": "cat","name": "Scratchy","age": 6}
   {"type": "dog","name": "Fluffy","age": 3}]
   ```

## Time formats

Pact supports many different time properties and formats. 
The following example illustrates using a `format-time` built-in function to format the time specified using the `time` built-in function:

```bash title=" "
pact> (format-time "%Y-%m-%d %H:%M:%S%N" (time "2024-07-23T13:30:45Z"))
"2024-07-23 13:30:45+00:00"
```

The `time` function constructs a time object from a UTC value using the ISO8601 format (%Y-%m-%dT%H:%M:%SZ).
The format-time built-in functions takes a format argument and a time argument to produce the specified time in the specified format.
The following table provides a summary of time formats used in the previous example:

| format | purpose |
| --- | --- |
| %Y | Year, no padding. |
| %m | Month of the year, 0-padded to two chars, "01"–"12" |
| %d | Day of the month, 0-padded to two chars, "01"–"31" |
| %H | Hour of the day (24-hour), 0-padded to two chars, "00"–"23" |
| %M | Minute of of the hour, 0-padded to two chars, "00"–"59" |
| %S | Second of the minute (without decimal part), 0-padded to two chars, "00"–"60" |
| %N | ISO 8601 style numeric time zone (for example, "-06:00" or "+01:00")|

There are many other formatting options than included in the previous example.
For example, you can replace the numeric representing the month of the year with the short or long name for the month.

```pact
pact> (format-time "%Y-%b-%d" (time "2024-07-24T13:30:45Z"))
"2024-Jul-24"
```
For more information about all of the formats supported, see [Time formats](/reference/functions/time).

## Parenthesis

As you've already seen, Pact uses parentheses to mark each statement in the code.
Parentheses enclose all module declaration, all function declarations, and any related logic.
Often, the code requires nested parenthetical statements to resolve the logic.
For example, the following code defines a **helloWorld** module in Pact:

```pact
(module helloWorld 'admin-keyset
  (defun hello (name)
    (format "Hello {}!" [name]))
)
```

Within the module `helloworld` declaration, there is a `hello` function declaration that makes use of the `format` built-in function.

## Comments

You can add comments using double quotation marks (`" "`) or single quotation marks (`' '`) to clearly describe the purpose of the code.

The following is an example of the **helloWorld** smart contract with comments included in the module.

```pact title=" "
(module helloWorld 'admin-keyset
  "A smart contract to greet the world."
  (defun hello (name)
    "Do the hello-world dance"
    (format "Hello {}!" [name]))
)
```

## Built-in functions

After getting familiar with the Pact language syntax, you are ready to start working with some of Pact [built-in functions](/reference/functions).
Pact provides a large number of built-in functions to handle different types of tasks.
In this tutorial, you'll work with a few of the most basic functions to get you started building simple programs. 
Additional functions will be introduced in later tutorials as they become relevant to building more complete programs using Pact.
 

To list the Pact built-in functions:

1. Open a terminal shell on your local computer.
2. Display the list of built-in functions by running the following command:
   
   ```bash
   pact --builtins
   ```
   
   You might want to save the output from this command to a file for quick reference.
   For example:

   ```pact
   pact --builtins > builtin-functions.txt
   ```

   Now that you have a general sense of the functions that are available, you're ready to start experimenting with the functions in the Pact REPL interpreter.

3. Start the Pact REPL interpreter you installed in [Install Pact](/build/pact/dev-network#install-pacth1989060372) by running the following command:
   
   ```bash
   pact
   ```

4. View usage information for a built-in function by typing the function name in the interpreter.
   
   For example, to see information about the format function, type `format` at the `pact>` prompt:

   ```pact
   pact> format
   ```
   
   After you enter the function name, you'll see information about the function in the interpreter.
   For example:

   ```pact
   native `format`
  
     Interpolate VARS into TEMPLATE using {}.
  
     Type:
     template:string vars:[*] -> string
     
     Examples:
     > (format "My {} has {}" ["dog" "fleas"])
   ```

## Arithmetic operators

The simplest built-in functions are used for arithmetic. 
In Pact, you can use arithmetic operators to add (+), subtract (-), multiply (*), or divide (/) by changing the prefix you use in an expression.
Prefix notation for math operators is common in some languages. 
However, if you haven't used this type notation before, it can take some time to get used to it.
With prefix notation, the operator precedes the two values it’s performing an operation on.

Let's try a few simple examples.

To use arithmetic operators:

1. Open a terminal shell on your local computer.
2. Start the Pact REPL interpreter you installed in [Install Pact](/build/pact/dev-network#install-pacth1989060372) by running the following command:
   
   ```bash
   pact
   ```
1. Add two numbers by typing the following expression in the Pact REPL interpreter:

   ```pact
   pact> (+ 5 5)
   10
   ```

1. Subtract the second number from the first number by typing the following expression:
   
   ```pact
   pact> (- 20 3)
   17
   ```
   
   If the first number is smaller than the second, the result is a negative number.
   For example:

   ```pact
   pact> (- 3.4 20.8)
   -17.4
   ```

1. Multiply two numbers by typing the following expression:
   
   ```pact
   pact> (* 20 3)
   60
   ```

1. Divide two numbers by typing the following expression:
   
   ```pact
   pact> (/ 25.0 5.0)
   5.0
   ```
   
   Division can often lead to a fractional value with a large number of decimal places.
   You can use the `round` function to limit the precision to a specific number of decimal places.

2. Round the result from a division operation to six decimal places by typing the following expression:
   
   ```pact
   (round (/ 25.0 5.2) 6)
   4.807692
   ```

   Now that you're familiar with these basic operations, you can combine the operators to build more complex expressions by nesting parentheses.
   For example, if you want to express the operation 5 + 2 - 4 = 3, you can express this in Pact as: 
   
   ```pact
   pact > ( + 5 ( - 2 4 ) )
   3
   ```

   In this example, Pact evaluates 2 - 4, to get -2, then evaluates -2 + 5 to get the final answer of 3.

For more information about basic math operations, see the following topics in [Pact functions](/reference/functions):

- [add](/reference/functions/operators#addh-1149808550)
- [divide](/reference/functions/operators#divideh-2126272338)
- [multiply](/reference/functions/operators#multiplyh273024062) 
- [subtract](/reference/functions/operators#subtracth828146059)

## Comparison operators

Comparison operators check whether values are equal, not equal, greater than, less than, and includes other common comparisons.
The following table lists the comparison operators available in Pact:

| Operator | Description | Examples |
| -------- | ----------- | -------- |
| != | True if X does not equal Y. | (!= "hello" "goodbye") = true |
| \< | True if X \< Y. | (\< 1 3) = true |
| \<= | True if X \<= Y. | (\<= 5.24 2.52) = false |
| = | True if X equals Y. | (= [1 2 3] [1 2 3]) = true |
| > | True if X > Y. | (> 1 3) = false |
| >= | True if X >= Y. | (>= 1 3) = false |

Pact built-in functions also support boolean, exponential, and many other common operators.
For more information about the operators Pact supports, see [Operators](/reference/functions/operators).

## Common general functions

Pact includes many built-in functions that enable you to perform common tasks like manipulating lists, assigning values, and formatting strings with variables.
A few of the most common general purpose functions include the following:

- at
- bind
- map
- format
  
You can use the [at](/reference/functions/general#ath3123) built-in function to return a value from a list or an object.
The [bind](/reference/functions/general#bindh3023933) built-in function allows you to map a variable to a value from within an object.
You can use the [map](/reference/functions/general#maph107868) built-in function to apply a specific operation to all elements in a list and return the results.
The [format](/reference/functions/general#formath-1268779017) built-in function allows you to create messages using strings and variables. 

Let's try a few simple examples to see how these functions work.

To use the common general functions:

1. Open a terminal shell on your local computer.
2. Start the Pact REPL interpreter you installed in [Install Pact](/build/pact/dev-network#install-pacth1989060372) by running the following command:
   
   ```bash
   pact
   ```

1. Select an item from a list using its place—its index location—in the list.
   
   ```pact
   (at 1 ["red" 4 true])
   4
   ```

   The index location starts with position 0, so at index position 1, the result is `4`.
   As this example illustrates, the list can include different data types.
   If you change the index to 0, the result is `"red"`. 
   If you change the index to 2, the result is `true`.

2. Select a value from an object by specifying the object key.

   ```pact
   pact > (at "name" { "type": "cat", "name": "Scratchy", "age": 6 })
   "Scratchy"
   ```
   
   In this example, you use the `"name"` key instead of an index location to return the value—"Scratchy"—from that key.

3. Bind a variable from a source object to a value in another object using the `:=` symbol.

   ```pact
   pact > (bind { "a": 1, "b": 2 } { "a" := a-value } a-value)
   1
   ```

   In this example, the value from the `"a"` key in the source object is assigned to the `a-value` variable, so the value returned by the `a-value` variable is 1.

   A more common use case for binding values using the `:=` symbol is when you want to bind the values from a table object to a variable. 
   The following example illustrates how you might bind a value from a table in a function:

   ```pact
   (defun pay (from to)
       (with-read payments from { "balance":= from-bal }
       ...code
   )
   ```

   This example reads a table named **payments** that includes a user **from** that is sending a balance. 
   A binding is used in this case to map the **balance** column in the payments table to the value of **from-bal** variable that is provided by the user.
   In this example,the function calls the balance of the user using the **balance** variable rather than the **from-bal** variable.

4. Apply a specific operation to each element in a list and return the results using the `map` built-in function.

   ```pact
   pact > (map (+ 1) [1 2 3])
   [2 3 4]
   ```

   This expression adds the value 1 to each element in the specified list then returns the result in a new list.
   You can also use the `map` function with other values, including strings, and with any of the operators available in Pact. 
   For example, if you have a list of names, you can map “Hello ” to each of them to returning a friendly message for each list item.

   ```bash title=" "
   pact> (map (+ "Hello ") ["Kadena" "Pact" "Standard Library"])
   ["Hello Kadena" "Hello Pact" "Hello Standard Library"]
   ```

5. Format a message using strings, curly braces (`{ }`) for placeholders and a list of values or variables.

   ```pact
   (format "My {} has {}" ["dog" "fleas"])
   "My dog has fleas"
   ```

   The first set of curly braces is the placeholder for the first value in the list.
   The second set of curly braces is the placeholder for the second value in the list.
   You can create as many placeholders and list values as you need for your messages.
   In a more typical use case, you would use the `format` function to create dynamic strings with variables inserted into specific locations in Pact contracts.

1. Close the Pact REPL interpreter session by pressing Control-d.

## Prepare to write functions

Now that you've experimented with several built-in functions in Pact, you’re ready to write some simple functions of your own.
In Pact, functions are always defined in the context of a **module**. 
As you learned in [Pact smart contracts](/build/pact#pact-smart-contractsh589005042), modules are one of the core components of the Pact programming language.
A module definition must include information about who has ownership of the module using either an administrator keyset or by defining a GOVERNANCE capability.
So, before you start writing functions, you need to create a module and identify the module owner.

To prepare to write your first functions:

1. Open a code editor—such as Visual Studio Code—on your computer.

2. Create a new file named `myModule.pact` for your new Pact module.

3. Add a module definition and a GOVERNANCE capability to the file with the following lines of code:
   
   ```pact
   (module myModule GOVERNANCE
       (defcap GOVERNANCE() true)
   )
       ;; DEFINE FUNCTION HERE
   )
   ```

   The `defcap` function defines a capability that controls the ownership of your contract.
   It must evaluate to true to allow changes to the module.
   You'll learn more about the power of capabilities in later tutorials.
   These lines of code represent the bare minimum required to define a module.
   Before moving on to writing functions within the module, you can test that the module runs using the Pact REPL interpreter.

4. Start the Pact REPL interpreter by running the following command:
   
   ```bash
   pact
   ```

5. Load the `myModule.pact` file by running a command similar to the following with the path to the `myModule.pact` file:
   
   ```pact
   pact> (load "myModule.pact")
   ```
   
   You should see output similar to the following:

   ```pact
   "Loading myModule.pact..."
   "Loaded module myModule, hash lt47sdWmlQKnqv66VwNBolJqjRg1TcZpteGps5H0xCc"
   ```

## Define a function

Functions are the core units of logic in a module.
They define all of the operations you want your application to offer and all of the features that your users want to access.
Although Pact includes many built-in functions for you to use, you typically need to define most of a contract's logic using your own functions.
Functions definitions start with the reserved keyword `defun` in Pact.
After the `defun` keyword, you must provide the function name followed by any arguments or other functions that the function uses.

The following is a simple example of the syntax to define a function in Pact:

```pact
(defun returnPhrase (a b)
    ;; COMMANDS GO HERE
)
```

In this example, a function named `returnPhrase` accepts inputs `a` and `b`.

Let's add this function to your module.

To define your first function:

1. Open the code editor—such as Visual Studio Code—on your computer.

2. Open the `myModule.pact` file you created for your new Pact module.

3. Define the function in the module by replacing the comment with the following lines of code:
   
   ```pact
   (module myModule GOVERNANCE
     (defcap GOVERNANCE() true)
    
     (defun returnPhrase (a b)
      (format "My {} has {}" [a b])
     )
   )
   ```

   The `returnPhrase` function can now take any two inputs and return a formatted string value.

4. Start the Pact REPL interpreter by running the following command:
   
   ```bash
   pact
   ```

5. Load the `myModule.pact` file by running the following command:
   
   ```pact
   pact> (load "myModule.pact")
   ```

1. Call the function by running the following command:
   
   ```pact
   (returnPhrase "car" "bright lights")
   "My car has bright lights"
   ```
   
   You can now change these inputs to any values you’d like.

## Add calculator functions

Now that you have a working module with one function, you can add functions for the math operations that take any two numbers as input, and returns the result.

To add simple calculator functions:

1. Open the code editor—such as Visual Studio Code—on your computer.

2. Open the `myModule.pact` file you created for your new Pact module.

3. Define functions for adding, subtracting, multiplying, or dividing any input values:
   
   ```pact   
    (defun addNumbers (a b)
    (+ a b)
    )

    (defun subtractNumbers (a b)
    (- a b)
    )

    (defun multiplyNumbers (a b)
    (* a b)
    )

    (defun divNumbers (a b)
    (/ a b)
    )
   ```

1. Call the functions with different values to see the results.
   
   For example:

   ```pact
   pact> (addNumbers 3 4)
   7   
   pact> (subtractNumbers 23 4)
   19   
   pact> (multiplyNumbers 12 4)
   48
   (round (divNumbers 63.5 4.1) 8)
   15.48780488
   ```


## Next steps

In this tutorial, you learned some of the basics for using the Pact programming language with an introduction to Pact syntax and built-in functions. 
You also wrote a few simple functions of your own.
To learn more about the Pact programming language and built-in functions, see the following topics:

- [Pact syntax](https://docs.kadena.io/reference/syntax)
- [Pact functions](https://docs.kadena.io/reference/functions)
- [General purpose functions](https://docs.kadena.io/reference/functions/general)
- [Time functions and formats](https://docs.kadena.io/reference/functions/time)
- [Operators](https://docs.kadena.io/reference/functions/operators)

For a deeper dive into writing Pact code, see the [Election workshop](/build/election) or [Faucet workshop](/build/faucet).