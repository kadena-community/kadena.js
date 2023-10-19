(namespace "user")

(module registry GOVERNANCE
  (defcap GOVERNANCE ()
    @doc "No one should be able to upgrade the base contract."
    ; TODO: check if this is the right GOVERNANCE
    ; uncomment the following line to enforce non-upgradeability
    ; (enforce false "Enforce non-upgradeability")
    (enforce-keyset "user.registry-admin")
  )

  ; TODO: check how we can update this nubmber later
  (defconst CURRENT_DIAMETER 3)
  ; https://en.wikipedia.org/wiki/Table_of_the_largest_known_graphs_of_a_given_diameter_and_maximal_degree
  ; set first 3 to 20 because the network alreday have 20 chains
  (defconst CHAINS_IN_DIAMETER:list [20, 20, 20, 38, 70, 132, 196, 336, 600, 1250])
  
  (defconst CHAR_MAP {
    'a: 1, 'b: 2, 'c: 3, 'd: 4, 'e: 5, 'f: 6, 'g: 7, 'h: 8, 'i: 9, 'j: 10, 'k: 11, 'l: 12, 'm: 13, 'n: 14, 'o: 15, 'p: 16, 'q: 17, 'r: 18, 's: 19, 't: 20, 'u: 21, 'v: 22, 'w: 23, 'x: 24, 'y: 25, 'z: 26
  })

  (defschema registry-schema
    @doc "The registry schema for the numbers."
    guard:guard
  )

  (deftable registry-table:{registry-schema})

  (defcap NUMBER-BLONGS-TO-CHAIN (number: integer diameter: integer)
    @doc "Check if the number blongs to the chian."
    (let ((remainder (mod number (at (- diameter 1) CHAINS_IN_DIAMETER))))
      (enforce
        (= remainder (str-to-int 10 (at "chain-id" (chain-data))))
        "The number does not blong to this chain"
      )
    )
  )

  (defcap ONLY_OWNER (number:integer) 
    (enforce-guard (at 'guard (getData number)))
  )

  (defcap VALID-NUMBER (number:integer)
    @doc "Check if the number is valid."
    (let ((strLength (+ 1 (floor (log 26.0 (dec number))))))
      (enforce (>= strLength 4) "the number is too small")
      (let ((diameter (+ 1 (/ strLength 4))))
        (enforce (<= (+ 1 diameter) CURRENT_DIAMETER) "the number is too big")
        (compose-capability (NUMBER-BLONGS-TO-CHAIN number diameter))
      )
    )
  )


  (defun register (number:integer guard:guard)
    (with-capability (VALID-NUMBER  number)
      (insert registry-table (int-to-str 10 number) { "guard" : guard })
    )
  )

  (defun transferOwnership (number:integer newOwnerGuard:guard)
    (with-capability (ONLY_OWNER  number)
      (update registry-table (int-to-str 10 number) { "guard" : newOwnerGuard })
    )
  )

  (defun getData:object (number:integer)
    (read registry-table (int-to-str 10 number))
  )

  (defun get-account (account:integer) 
    @doc "Get principal account bsed on the account's guard."
    (create-principal (at "guard" (getData account)))
  )

  (defun nameToNumber (name:string)
    @doc "Calculate number from name, to be used in chain calculation."
    (enforce (>= (length name) 4) "Minimum 4 characters required in name")

    (let
      ((indexmap (zip
        (lambda (x y) { 'index: x, 'value: y })
        (enumerate 0 (- (length name) 1))
        (str-to-list name))))
      (fold
        (+)
        -1
        (map
          (lambda (x) (* (at (at "value" x) CHAR_MAP) (^ 26 (- (- (length name) (at "index" x)) 1))))
          indexmap
        )
      )
    )
  )
)

(if (read-msg "upgrade")
  []
  [
    (define-keyset "user.registry-admin" (read-keyset "registry-admin"))
    (create-table registry-table)
  ]
)