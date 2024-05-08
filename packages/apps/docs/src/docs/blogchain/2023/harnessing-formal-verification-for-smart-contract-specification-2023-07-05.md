---
title: Harnessing Formal Verification for Smart Contract Specification
description:
  Kadena’s smart contract language, Pact, is a powerful tool at our disposal.
  Pact assists developers in creating smart contracts on the Kadena blockchain,
  called Formal Verification. So what is Formal Verification? In the context of
  hardware and software systems, formal verification is the act of proving or
  disproving the correctness of intended algorithms underlying a system with
  respect to a certain formal specification or property, using formal methods of
  mathematics.
menu: Harnessing Formal Verification for Smart Contract Specification
label: Harnessing Formal Verification for Smart Contract Specification
publishDate: 2023-07-05
headerImage: /assets/blog/1_I5E__mD5RA-gfneIBQgKag.webp
tags: [smart contract, formal verification, pact]
author: Andy
authorId: andy
layout: blog
---

# Harnessing Formal Verification for Smart Contract Specification

## What is Formal Verification?

Kadena’s smart contract language, [Pact](/build/pact), is a powerful tool at
our disposal. Pact assists developers in creating smart contracts on
the[ Kadena blockchain](https://kadena.io/), called Formal Verification. So what
is Formal Verification?

The definition of Formal Verification on Wikipedia is as follows:

> In the context of hardware and software systems, formal verification is the
> act of proving or disproving the correctness of intended algorithms underlying
> a system with respect to a certain formal specification or property, using
> formal methods of mathematics.

This may appear initially daunting – I know it certainly was for me. It seems
like a complicated system that is out of reach for many developers. After using
Formal Verification for a significant period of time, my perspective has
changed. With the continuous stream of updates on the Formal Verification
modules, I firmly believe that it is an exceptionally valuable asset that every
developer engaged in smart contract development on the Kadena blockchain should
leverage.

### Why should we make use of Formal Verification?

Formal Verification grants you the ability to verify the expected behaviors of
your smart contract. By specifying your smart contract before you implement any
logic, you can identify challenges upfront and devise high-level solutions. This
approach allows you to focus on specific details while disregarding other
aspects.

For example, I can zoom in on a single `win` condition of a game of Rock, Paper,
Scissors, while ignoring all the other win conditions. You only need to specify
that single win condition. Then you can proceed to specify the next win
condition, and so on. This way, if your smart contract can be formally verified
(i.e., a mathematical proof can be generated), it will satisfy all conditions
without the need to write unit tests for all those use cases.

### Introducing the Use Case

Let’s create a smart contract that will govern a game of Rock, Paper, Scissors.
Normally when you play in real life, both players agree to reveal their move at
the same time.

In a traditional web 2 application, both players could submit their move to a
centralized server. If this centralized server for some reason is compromised,
it could lead to some unfair advantage of either player.

Due to the decentralized nature of the blockchain, we are taught to distrust any
involved party. A way to provide a fair process that can be trusted, without
trusting the involved parties, could be to commit your move in the first step
and reveal your move in the second step.

In this mini guide, we will show how Pact’s formal verification system can help
guide us through the process of defining a smart contract.

### Define your Interface

We start off by defining a smart contract, `rps.pact` with the following
content.

```pact
(module rock-paper-scissors GOVERNANCE
(defcap GOVERNANCE()
    (enforce false "Prevent this contract from upgrading"))

(defun commit(
    id           : string
    player1      : string
    player2      : string
    player1-move : string
    player2-move : string)
    0)

(defun reveal(
    id           : string
    player1-move : string
    player1-salt : string
    player2-move : string
    player2-salt : string)
    0)

)

```

This scaffolds our initial interface, where we have a `rock-paper-scissors`
module containing two functions, `commit` and `reveal`. We can prepare a test
file that will act as our playground, `rps.repl` with the following contents:

```pact
(begin-tx)
(load "rps.pact")
(commit-tx)

(verify "rock-paper-scissors")
```

This loads our smart contract into our test environment and performs a
verification of the defined model. `verify` will perform the verification of our
model. Our current contract lacks a model definition, rendering it functionally
limited at the moment. You can run the `rps.repl` with pact via command line:
`pact -t rps.repl`

### Specify your Expectations

Now we can start specifying our model for our game. First let’s specify what the
valid moves are. We can first define a `reusable` property `is-valid-move`. This
property simply checks if the provided move is either `rock`, `paper` or
`scissors`, returning `true` if valid and `false` if invalid.

```pact
(module rock-paper-scissors GOVERNANCE
@model [
    (defproperty is-valid-move(move:string)
    (or (= move "rock")
        (or (= move "paper") (= move "scissors"))))
]
```

Now we can specify the moves provided in the reveal function:

```pact
(defun reveal(
    id           : string
    player1-move : string
    player1-salt : string
    player2-move : string
    player2-salt : string)
    @model [
    (property (is-valid-move player1-move))
    (property (is-valid-move player2-move))
    ]
    0)
)
```

If we would run the `rps.repl` it will validate the smart contract and produce
the following error:

```bash
rps.pact:24:16:OutputFailure: Invalidating model found in rock-paper-scissors.reveal
    Program trace:
    entering function rock-paper-scissors.reveal with arguments
        id = ""
        player1-move = ""
        player1-salt = ""
        player2-move = ""
        player2-salt = ""

        returning with 0


rps.pact:25:16:OutputFailure: Invalidating model found in rock-paper-scissors.reveal
    Program trace:
    entering function rock-paper-scissors.reveal with arguments
        id = ""
        player1-move = ""
        player1-salt = ""
        player2-move = ""
        player2-salt = ""

        returning with 0


Load successful
```

It notifies about two invalidating models and provides the input used to reach
this state, along with the result it produced. In general, when our model is
invalidated, the transaction is expected to fail. This information helps us
understand and address any issues or inconsistencies in the smart contract.

Now we can specify win, lose and draw conditions. For simplicity’s sake, I will
be specifying from player one’s perspective.
The`result` keyword refers to a
value that the function will output. Note that we have defined 3 different
possible outcomes: `Player 1 wins`,` Player 2 wins` or `Draw`.

```pact
(module rock-paper-scissors GOVERNANCE
@model [
    (defproperty allow-draw(move1:string move2:string)
    (when (= move1 move2) (= result "Draw")))
    (defproperty allow-win(move1:string move2:string)
    (when (or (and (= move1 "rock") (= move2 "scissors"))
                (or (and (= move1 "paper") (= move2 "rock"))
                    (and (= move1 "scissors") (= move2 "paper"))))
        (= result "Player 1 wins")))
    (defproperty allow-lose(move1:string move2:string)
    (when (or (and (= move1 "scissors") (= move2 "rock"))
                (or (and (= move1 "rock") (= move2 "paper"))
                    (and (= move1 "paper") (= move2 "scissors"))))
        (= result "Player 2 wins")))
]
```

We can then use these properties to specify how our `reveal` function should
behave. As the result is now specified to be a string of either `Player 1 wins`,
`Player 2 wins` or `Draw`, we need to update the return value to match
accordingly.

```pact
(defun reveal(
    id           : string
    player1-move : string
    player1-salt : string
    player2-move : string
    player2-salt : string)
    @model [
    (property (is-valid-move player1-move))
    (property (is-valid-move player2-move))
    (property (allow-draw player1-move player2-move))
    (property (allow-win player1-move player2-move))
    (property (allow-lose player1-move player2-move))
    ]
    "Draw")
)
```

We are unable to provide a detailed specification on how a move is committed, as
it needs to remain a secret until revealed. However we can specify how a move is
revealed, which indirectly outlines the process of committing a move. It is
important to note that Formal Verification still has certain limitations. We are
not able to specify behaviors around the `hash` function. To work around this
limitation, we will make use of the `expect-failure` in the `.repl` environment.

In this example, we want the player to submit a hash of their move concatenated
with a random string. When it comes time to reveal, they will provide both their
move and the random string to reproduce the hashed string. This process serves
as proof that their revelation is truthful.

```pact
(begin-tx)
(load "rps.pact")
(commit-tx)

(verify "rock-paper-scissors")

(begin-tx)
(rock-paper-scissors.commit
"game-1"
"alice"
"bob"
(hash "rock-a-salt-that-should-be-random")
(hash "rock-a-different-salt-that-is-random"))
(commit-tx)

(begin-tx)
(expect-failure
"Expect player one's move to be incorrect"
"Player 1 revealed move does not match saved move"
(rock-paper-scissors.reveal
    "game-1"
    "rock"
    "incorrect-salt"
    "rock"
    "a-different-salt-that-is-random"))
(commit-tx)

(begin-tx)
(expect-failure
"Expect player two's move to be incorrect"
"Player 2 revealed move does not match saved move"
(rock-paper-scissors.reveal
    "game-1"
    "rock"
    "a-salt-that-should-be-random"
    "rock"
    "incorrect-salt"))
(commit-tx)
```

### Implement your Contract

Now that we established our expectations, we can proceed with implementing our
contract. By ensuring that all tests pass, we can be confident that we haven’t
overlooked any use cases.

Given that we have specified a two-step process for committing and revealing
moves, we need to create a table to store the committed move.

```pact
(defschema game
    player1      : string
    player2      : string
    player1-move : string
    player2-move : string)
(deftable games:{game})

(defun commit(
    id           : string
    player1      : string
    player2      : string
    player1-move : string
    player2-move : string)
    (insert games id
    { 'player1      : player1
    , 'player2      : player2
    , 'player1-move : player1-move
    , 'player2-move : player2-move }))
```

Now we can compare the submitted move with the revealed move and validate that
neither player is dishonest.

```pact
(defun enforce-valid-move(move:string)
    (enforce
    (or (= move "rock")
    (or (= move "paper") (= move "scissors")))

(defun reveal(
    id           : string
    player1-move : string
    player1-salt : string
    player2-move : string
    player2-salt : string)
    @model [
    (property (is-valid-move player1-move))
    (property (is-valid-move player2-move))
    (property (allow-draw player1-move player2-move))
    (property (allow-win player1-move player2-move))
    (property (allow-lose player1-move player2-move))
    ]
    (with-read games id
    { 'player1-move := commited-player1-move
    , 'player2-move := commited-player2-move }
    (enforce
        (= (hash (format "{}-{}" [player1-move player1-salt])) commited-player1-move)
        "Player 1 revealed move does not match saved move")
    (enforce
        (= (hash (format "{}-{}" [player2-move player2-salt])) commited-player2-move)
        "Player 2 revealed move does not match saved move")
    (enforce-valid-move player1-move)
    (enforce-valid-move player2-move)
    (cond ((= player1-move player2-move) "Draw")
            ((and (= player1-move "rock") (= player2-move "scissors")) "Player 1 wins")
            ((and (= player1-move "scissors") (= player2-move "paper")) "Player 1 wins")
            ((and (= player1-move "paper") (= player2-move "rock")) "Player 1 wins")
            "Player 2 wins")))
```

By using enforce statements, we can guard our function from any illicit entry.
First, we guard the function against processing any move that does not match the
committed move. Since the move committed has not been revealed yet, we need to
verify that the move is valid from the start.

Secondly, once we have established that the moves are valid, we can proceed to
determine the result. By using `cond` we can specify a list of `Draw` and `Win`
conditions. Once implemented, we can rerun the `.repl` and verify if we have
satisfied our specifications.

You can try and remove a `Player 1 wins` condition and see the verification
fail. For example we could remove the win condition of `Scissors beats paper`
for `Player 1`, this will produce the following validation error:

```bash
rps.pact:63:16:OutputFailure: Invalidating model found in rock-paper-scissors.reveal
    Program trace:
    entering function rock-paper-scissors.reveal with arguments
        id = "!0!"
        player1-move = "scissors"
        player1-salt = ""
        player2-move = "paper"
        player2-salt = ""

        read { player1-move: "HsVo-gcG-pk1BciGr2xovMyR7sVH0Kt9gTgqicXDXMM", player2-move: "HsVo-gcG-pk1BciGr2xovMyR7sVH0Kt9gTgqicXDXMM" } from games at key "!0!" succeeds
        destructuring object
        commited-player1-move := "HsVo-gcG-pk1BciGr2xovMyR7sVH0Kt9gTgqicXDXMM"
        commited-player2-move := "HsVo-gcG-pk1BciGr2xovMyR7sVH0Kt9gTgqicXDXMM"
        satisfied assertion: (= (hash (format "{}-{}" [player1-move player1-salt])) commited-player1-move)

        satisfied assertion: (= (hash (format "{}-{}" [player2-move player2-salt])) commited-player2-move)

        entering function rock-paper-scissors.enforce-valid-move with argument
            move = "scissors"

            satisfied assertion: (or (= move ROCK)
        (or (= move PAPER) (= move SCISSORS)))

            returning with True

        entering function rock-paper-scissors.enforce-valid-move with argument
            move = "paper"

            satisfied assertion: (or (= move ROCK)
        (or (= move PAPER) (= move SCISSORS)))

            returning with True

        returning with "Player 2 wins"
```

_Note: OutputWarnings will be displayed, due to the usage of hash for dynamic
content (i.e., content that is not statically known). This is to warn developers
of the substitution of the hash function inside of the formal verification
context._

After cleaning up our code and redefining the moves as constants we end up with
the following contract:

```pact
(module rock-paper-scissors GOVERNANCE
@model [
    (defproperty is-valid-move(move:string)
    (or (= move ROCK)
        (or (= move PAPER) (= move SCISSORS))))
    (defproperty allow-draw(move1:string move2:string)
    (when (= move1 move2) (= result DRAW)))
    (defproperty allow-win(move1:string move2:string)
    (when (or (and (= move1 ROCK) (= move2 SCISSORS))
                (or (and (= move1 PAPER) (= move2 ROCK))
                    (and (= move1 SCISSORS) (= move2 PAPER))))
        (= result PLAYER1-WINS)))
    (defproperty allow-lose(move1:string move2:string)
    (when (or (and (= move1 SCISSORS) (= move2 ROCK))
                (or (and (= move1 ROCK) (= move2 PAPER))
                    (and (= move1 PAPER) (= move2 SCISSORS))))
        (= result PLAYER2-WINS)))
]
(defcap GOVERNANCE() false)
(defconst ROCK 'rock)
(defconst PAPER 'paper)
(defconst SCISSORS 'scissors)

(defconst DRAW 'Draw)
(defconst PLAYER1-WINS "Player 1 wins")
(defconst PLAYER2-WINS "Player 2 wins")

(defschema game
    player1      : string
    player2      : string
    player1-move : string
    player2-move : string)
(deftable games:{game})

(defun commit(
    id           : string
    player1      : string
    player2      : string
    player1-move : string
    player2-move : string)
    (insert games id
    { 'player1      : player1
    , 'player2      : player2
    , 'player1-move : player1-move
    , 'player2-move : player2-move }))

(defun enforce-valid-move(move:string)
    (enforce
    (or (= move ROCK)
    (or (= move PAPER) (= move SCISSORS)))
    "Invalid move"))

(defun reveal(
    id           : string
    player1-move : string
    player1-salt : string
    player2-move : string
    player2-salt : string)
    @model [
    (property (is-valid-move player1-move))
    (property (is-valid-move player2-move))
    (property (allow-draw player1-move player2-move))
    (property (allow-win player1-move player2-move))
    (property (allow-lose player1-move player2-move))
    ]
    (with-read games id
    { 'player1-move := commited-player1-move
    , 'player2-move := commited-player2-move }
    (enforce
        (= (hash (format "{}-{}" [player1-move player1-salt])) commited-player1-move)
        "Player 1 revealed move does not match saved move")
    (enforce
        (= (hash (format "{}-{}" [player2-move player2-salt])) commited-player2-move)
        "Player 2 revealed move does not match saved move")
    (enforce-valid-move player1-move)
    (enforce-valid-move player2-move)
    (cond ((= player1-move player2-move) DRAW)
            ((and (= player1-move ROCK) (= player2-move SCISSORS)) PLAYER1-WINS)
            ((and (= player1-move SCISSORS) (= player2-move PAPER)) PLAYER1-WINS)
            ((and (= player1-move PAPER) (= player2-move ROCK)) PLAYER1-WINS)
            PLAYER2-WINS)))

)

(create-table games)
```

The result of running the `rps.repl` would yield:

```bash
rps.repl:1:0:Trace: Begin Tx 0
rps.repl:2:0:Trace: Loading rps.pact...
rps.pact:1:0:Trace: Loaded module rock-paper-scissors, hash lzAukKqAEHZnef_delbgI6NdOcQty03TZ8Plaw1Ja2g
rps.pact:85:0:Trace: TableCreated
rps.repl:3:0:Trace: Commit Tx 0
rps.repl:5:0:Trace: Verification of rock-paper-scissors succeeded
... removed OutputWarning messages ...
rps.repl:7:0:Trace: Begin Tx 1
rps.repl:8:0:Trace: Write succeeded
rps.repl:14:0:Trace: Commit Tx 1
rps.repl:16:0:Trace: Begin Tx 2
rps.repl:17:0:Trace: Expect failure: success: Expect player one's move to be incorrect
rps.repl:26:0:Trace: Commit Tx 2
rps.repl:28:0:Trace: Begin Tx 3
rps.repl:29:0:Trace: Expect failure: success: Expect player two's move to be incorrect
rps.repl:38:0:Trace: Commit Tx 3
rps.repl:40:0:Trace: Begin Tx 4
rps.repl:41:0:Trace: Expect: success: true
rps.repl:47:0:Trace: Commit Tx 4
Load successful
```

### Conclusion

By directing our attention to the desired outcome, we can efficiently define our
game without the burden of constantly juggling all the intricate details.
Although a game of Rock Paper Scissors is inherently straightforward, expanding
it to include additional options can quickly become overwhelming to comprehend
as a whole. Fortunately, with the aid of Formal Verification, this challenge
becomes manageable. We can focus on specific details, addressing them one by
one, and leverage the immense power of Formal Verification in our upcoming and
future smart contract endeavors.
