(namespace 'free)
(define-keyset "free.cka-admin-keyset" (read-keyset "cka-admin-keyset"))

(module cka-message-store-v1 GOVERNANCE
  "Create Kadena App message store with a shared global message"

  (defcap GOVERNANCE ()
    "Module governance capability that only allows the admin to update this module"
    (enforce-keyset "free.cka-admin-keyset"))

  (use coin [ details ])

  (defcap ACCOUNT-OWNER (account:string)
    "Make sure the requester owns the KDA account"
    (enforce-guard (at 'guard (details account)))
  )

  ;; Schema and table for one global message
  (defschema messages-schema
    message:string
  )
  (deftable messages:{messages-schema})

  ;; Write the global message
  (defun write-message (account:string message:string)
    "Write the global message (only by account owner)"

    (enforce (<= (length message) 150) "Message can be a maximum of 150 characters long")

    (with-capability (ACCOUNT-OWNER account)
      (write messages "global" { "message": message })
    )
  )

  ;; Read the global message
  (defun read-message ()
    "Read the shared global message"

    (at 'message (read messages "global"))
  )

  ;; Constructor to initialize the message
  (defun init ()
    (insert messages "global" { "message": "Hello from Kadena!" })
    "initialized"
  )
)

;; Constructor call outside the module
(if (read-msg "upgrade")
  ["upgrade"]
  [
    (create-table messages)
    (cka-message-store-v1.init)
  ]
)
