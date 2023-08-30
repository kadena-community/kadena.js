---
title: Pact 4.2.0 Blazes to Mainnet!
description:
  At Kadena, we strive for delivering continued improvements to better our user
  experience in building on our platform. With Pact at the forefront of safe,
  expressive and performant smart contracts, we are pleased to announce the
  release of Pact 4.2.0! This version adds anonymous “lambda” functions, new
  natives for improved user experience, improvements to persistence, and various
  bugfixes that were weeded out.
menu: Pact 4.2.0 Blazes to Mainnet!
label: Pact 4.2.0 Blazes to Mainnet!
publishDate: 2022-01-19
author: Jose Cardona
layout: blog
---

![](/assets/blog/1_QEGOGwBeXw78S3eV4V-IDA.webp)

# Pact 4.2.0 Blazes to Mainnet!

At [Kadena](https://kadena.io/), we strive for delivering continued improvements
to better our user experience in building on our platform. With Pact at the
forefront of safe, expressive and performant smart contracts, we are pleased to
announce the release of **Pact 4.2.0!** This version adds anonymous “lambda”
functions, new natives for improved user experience, improvements to
persistence, and various bugfixes that were weeded out.

The continued improvements to Pact and our commitment to providing better user
experience is why Pact is the premier standard for smart contracts. You can try
the latest version of Pact out by
**[downloading from our Github](https://github.com/kadena-io/pact)** or on Mac
`brew install kadena-io/pact/pact` !

## Lambdas

4.2.0 brings Lambdas, a major new feature of Pact!

Pact is already a functional language and allows functions to be treated as
arguments in special cases like map and fold . However, using these required
making top-level function definitions that become part of the smart contract API
and require privacy techniques to ensure security. Locally-bound functions are
more tightly constrained which decreases exposure and therefore increases
security.

It also just brings more expressiveness so you can do more with less Pact code.
With lambdas, users can now write **let-bound declarations** of lambdas as
locally-scoped values, as well as **fully anonymous functions** for use at the
call sites. This allows for better code locality in the cases that you would
otherwise write a top-level function for one-off functionality.

The best example of how you can use lambdas in your day-to-day building is using
them with the new **fold-db** native — read on!

## Powerful new built-in natives

Pact 4.2.0 continues to introduce powerful new operations to make blockchain
smart contract programming easier and safer.

### fold-db: key/value querying and processing

fold-db brings a fully functional metaphor to database querying, provides key
querying for the first time, and solves key handling in results by delegating
querying and list processing to functions you provide that take the key and
value pair.

In the following example, we select all bonds with keys starting with p: and a
lockup of greater than 30 days, by binding a lambda to query . We also provide
an anonymous lambda for the processing function that simply returns the key and
the value as a single object.

```pact
    (let*
      ( (query (lambda (key value)
          (and (= "p:" (take 2 k))
               (> (at 'lockup value) 30)))
      )
      (fold-db bonds (query)
        (lambda (k o) { "key": k, "value": o })))
```

### Community-initiated new natives: zip and cond

Pact benefits from an engaged and active community generating new ideas and
requirements for making Pact the best smart contract language. These new natives
were proposed by community builders.

- `zip` allows you to take any two lists and a combining function `f` for each
  pair of elements, and returns a new list with `f` applied to each pair. In the
  following example, we `zip` two lists of integers using addition `(+)` as our
  combining function, and receive a list containing their pairwise sum.

```
  ;; (+) is applied pairwise ;; so we get the resulting list [(+ 1 4) (+ 2 5) (+
  3 6)] ;; which evaluates to [5 7 9] (zip (+) [1 2 3] [4 5 6])
```

- `cond` is our new macro for multiple branching conditional expressions. As an
  example, the following code will branch on scoreto return an award name. If
  `score` is less than 10 it will return `"Bronze"`, otherwise if it is less
  than 20 it will return `"Silver"` and so forth, and finally in the case that
  none of the previous conditions succeed, returns `"Platinum"`:

```pact
(defun award:string (score:integer) (cond ((< score 10) "Bronze") ((<
  score 20) "Silver") ((< score 30) "Gold") "Platinum")))
```

### Detailed Lambda Example: Advent of Code 2021 Day 1

This example ([part 2 of AOC day 1](https://adventofcode.com/2021/day/1))
requires creating sliding windows of 3 elements from a list of measurements (as
integers), and counting how many windows increased from the previous sum. In
pact 4.2.0, we can express this algorithm as:

```pact
    (defun day1 (li:[integer])
      (let* (
       (sum (lambda (x:[integer]) (fold (+) 0 x)))
       (ptl (lambda (x:integer y:integer) [x, y]))
       (append (lambda (x:[integer] y:integer) (+ x [y])))
       (gt-window (lambda (x:integer y:integer) (if (< x y) 1 0)))
       (triples (zip (append) (zip (ptl) li (drop 1 li)) (drop 2 li))
       (triple-sums (map (sum) triples))
      )
      (sum (zip (gt-window) triple-sums (drop 1 triple-sums))))
```

Breaking it down:

- We start with an original list `li`, containing the list of integers.

- We create a few helper functions using our new `lambda` keyword: `sum` for
  adding together a list of ints, `ptl` which will group a pair of elements into
  a list of two elements, `append` which appends a single element to a list,
  `gt-window` which will check whether the previous sum of a window is greater.

- With our helper functions created, we can create an element `triples` which
  consists of a list of 3-element groupings of measurements which is our sliding
  windows, using our new native, `zip`, which takes two lists and applies a
  combining function to them.

- Having `triples`, we can construct `triple-sums`, which is the sum of each
  sliding window.

- Finally, we use `zip` again to compare each element of `triple-sums` with the
  element that follows, and sum the result to count how many elements are indeed
  increases from the previous sliding window.

While the solution can be optimized to avoid creating intermediate structures
(namely, `triple-sums` could be constructed more directly), this form of
solution illustrates how the expressive abilities of pact allow users to tackle
problems in clear pieces, and with the addition of `lambda` expressions, avoid
top-level declarations for single-use functions.

## Conclusion

To learn more about writing safe, smart, and smoking fast contracts in Pact,
visit our educational resources:

- [docs.kadena.io](https://docs.kadena.io/developer-guides/overview): find
  videos, tutorials, information on key concepts and example code.

- [Try Pact ](http://pact.kadena.io/)— start exploring Pact (4.2.0) in your
  browser, no downloads necessary!

- [Beta test smart contracts](http://discord.io/kadena) — get in touch with the
  team via Discord if you want to participate in our public blockchain testnet.

```

```
