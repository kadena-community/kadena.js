(namespace 'free)

;; Define a keyset with name `election-admin-keyset`.
;; Keysets cannot be created in code, thus we read them in from the load message data.
(define-keyset "free.cka-admin-keyset" (read-keyset 'cka-admin-keyset))

;; Define `cka-message-store` module
(module cka-message-store GOVERNANCE
  "Create Kadena App message store"

  (defcap GOVERNANCE ()
    "Module governance capability that only allows the admin to update this module"
    ;; Check if the tx was signed with the provided keyset, fail if not
    (enforce-keyset "free.cka-admin-keyset"))

  ;; Import `coin` module while only making the `details` function available
  ;; in the `election` module body
  (use coin [ details ])

  (defcap ACCOUNT-OWNER (account:string)
    "Make sure the requester owns the KDA account"

    ;; Get the guard of the given KDA account using coin.details function
    ;; and execute it using `enforce-guard`
    (enforce-guard (at 'guard (details account)))
  )

  ;; Define the `messages-schema` schema
  (defschema messages-schema
    "Candidates table schema"

    ;; Messages table has one column, `message` - Message written by a user
    message:string
  )

  ;; Define the `messages` table that's using the `messages-schema`
  (deftable messages:{messages-schema})

  (defun write-message (account:string message:string)
    "Write a message"

    (enforce (<= (length message) 150) "Message can be a maximum of 150 characters long")

    ;; Try to acquire the `ACCOUNT-OWNER` capability which checks
    ;; that the transaction owner is also the owner of the KDA account provided as parameter to our `write-messages` function.
    (with-capability (ACCOUNT-OWNER account)
      (write messages account { "message" : message })
    )
  )

  (defun read-message (account:string)
    "Read a message for a specific account"

    (with-default-read messages account
      { "message": "You haven't written any message yet" }
      { "message" := message }
      message
    )
  )
)

(if (read-msg "upgrade")
  ;; If its value is true, it means we're upgrading the module
  ["upgrade"]
  ;; Otherwise, the transaction is deploying the module and we need to create the table
  [
    (create-table messages)
  ]
)
