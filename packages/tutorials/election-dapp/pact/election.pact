(namespace 'free)

;; Define a keyset with name `election-admin-keyset`.
;; Keysets cannot be created in code, thus we read them in from the load message data.
(define-keyset "free.election-admin-keyset" (read-keyset 'election-admin-keyset))

;; Define `election` module
(module election GOVERNANCE
  "Election demo module"

  (defcap GOVERNANCE ()
    "Module governance capability that only allows the admin to update this module"
    ;; Check if the tx was signed with the provided keyset, fail if not
    (enforce-keyset "free.election-admin-keyset"))

  ;; Import `coin` module while only making the `details` function available
  ;; in the `election` module body
  (use coin [ details ])

  (defcap ACCOUNT-OWNER (account:string)
    "Make sure the requester owns the KDA account"

    ;; Get the guard of the given KDA account using coin.details function
    ;; and execute it using `enforce-guard`
    (enforce-guard (at 'guard (coin.details account)))
  )

  (defcap VOTED (candidateId:string)
    "Emit an event that indicates a vote has been made for the provided candidate"
    @event
    true
  )

  ;; Define the `candidates-schema` schema
  (defschema candidates-schema
    "Candidates table schema"

    ;; Candidates table has 2 columns, `name` of type string
    ;; and `votes` which is an `integer`
    name:string
    votes:integer)

  ;; Define the `votes-schema` schema
  (defschema votes-schema
    "Votes table schema"

    ;; Votes table has one column, `cid` - Candidate id of type string
    cid:string
  )

  ;; Define the `votes` table that's using the `votes-schema`
  (deftable votes:{votes-schema})

  ;; Define the `candidates` table that's using the `candidates-schema`
  (deftable candidates:{candidates-schema})

  (defun user-voted:bool (account:string)
    "Check if a user already voted"

    ;; Read from the votes table using `account` param value as key
    ;; with-default-read allows us to set default values for the table columns
    ;; that are returned if the row does not exist.
    (with-default-read votes account

      ;; In this case we're setting the `cid` column default value to an empty string
      { "cid": "" }
      { "cid":= cid }

      ;; Check if `cid` is an empty string or not, return true if not,
      ;; i.e. user already voted and false otherwise,
      ;; meaning the user did not vote yet
      (> (length cid) 0))
  )

  (defun candidate-exists:bool (cid:string)
    "Check if a candidate exists"

    ;; Using a similar approach as in `user-voted` function,
    ;; in this case to check if a candidate exists
    (with-default-read candidates cid
      { "name": "" }
      { "name" := name }
      (> (length name) 0))
  )

  (defun vote-protected (account:string candidateId:string)
    "Safe vote"

    ;; Check that the ACCOUNT-OWNER capability has already been granted, fail if not
    (require-capability (ACCOUNT-OWNER account))

    ;; Read the current number of votes the candidate has
    (with-read candidates candidateId { "votes" := votesCount }

      ;; Increment the number of votes by 1
      (update candidates candidateId { "votes": (+ votesCount 1) })

      ;; Record the vote in the `votes` table (prevent double-voting)
      (insert votes account { "cid": candidateId })

      ;; Emit an event that can be used by the front-end component to update the number of
      ;; votes displayed for a candidate
      (emit-event (VOTED candidateId))
    )
  )

  (defun vote (account:string cid:string)
    "Vote for a candidate"

    ;; Prevent double-voting by checking if the user already voted through `user-voted` function
    ;; and `enforce` the returned value is `false`
    (let ((double-vote (user-voted account)))
      (enforce (= double-vote false) "Multiple voting not allowed"))

    ;; Prevent voting for a candidate that doesn't exist through `candidate-exists`
    ;; function and `enforce` the returned value is `true`
    (let ((exists (candidate-exists cid)))
      (enforce (= exists true) "Candidate doesn't exist"))

    ;; Try to acquire the `ACCOUNT-OWNER` capability which checks
    ;; that the transaction owner is also the owner of the KDA account provided as parameter to our `vote` function.
    (with-capability (ACCOUNT-OWNER account)

      ;; While the `ACCOUNT-OWNER` capability is in scope we are calling `vote-protected` which is the function that updates the database
      (vote-protected account cid))
  )

  (defun get-votes:integer (cid:string)
    "Get the votes count by cid"

    ;; Read the row using cid as key and select only the `votes` column
    (at 'votes (read candidates cid ['votes]))
  )

  (defun insert-candidate (candidate)
  "Insert a new candidate, admin operation"

  ;; Try to acquire the GOVERNANCE capability
  (with-capability (GOVERNANCE)
    ;; While GOVERNANCE capability is in scope, insert the candidate
    (let ((name (at 'name candidate)))
      ;; The key has to be unique, otherwise this operation will fail
      (insert candidates (at 'key candidate) { "name": (at 'name candidate), "votes": 0 })))
  )

  (defun insert-candidates (candidates:list)
    "Insert a list of candidates"
    ;; Using the above defined `insert-candidate` to bulk-insert a list of candidates
    (map (insert-candidate) candidates)
  )
)

(if (read-msg "upgrade")
  ;; If its value is true, it means we're upgrading the module
  ["upgrade"]
  ;; Otherwise, the transaction is deploying the module and we need to create the tables
  [
    (create-table candidates)
    (create-table votes)
  ]
)
