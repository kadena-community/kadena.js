(namespace 'free)

(define-keyset "free.cka-admin-keyset" (read-keyset "cka-admin-keyset"))


(module store2 GOVERNANCE
  "Store contract with admin and account guard capabilities"

  ;; Governance capability
  (defcap GOVERNANCE ()
    "Allows admin to upgrade or change the module"
    (enforce-keyset "free.cka-admin-keyset"))

  (use coin [ details ])

  ;; Capability to restrict actions to the KDA account owner
  (defcap ACCOUNT-OWNER (account:string)
    "Only the owner of the KDA account can call this"
    (enforce-guard (at 'guard (details account)))
  )

  ;; Product schema
  (defschema product-schema
    name:string
    price:decimal
    stock:integer)

  ;; Purchase schema
  (defschema purchase-schema
    buyer:string
    product:string
    quantity:integer
    timestamp:time)

  ;; Tables
  (deftable products:{product-schema})
  (deftable purchases:{purchase-schema})

  ;; Admin-only function: Add a product
  (defun add-product (id:string name:string price:decimal stock:integer)
    (with-capability (GOVERNANCE)
      (insert products id {"name": name, "price": price, "stock": stock}))
  )

;    ;; Admin-only function: Update a product
;    (defun update-product (id:string new-price:decimal new-stock:integer)
;      (with-capability (GOVERNANCE)
;        (with-read products id {"name": n}
;          (update products id {"name": n, "price": new-price, "stock": new-stock})))
;    )

;    ;; Admin-only function: Delete a product
;    (defun delete-product (id:string)
;      (with-capability (GOVERNANCE)
;        (delete products id))
;    )

  ;; Public: Get product by ID
  (defun get-product (id:string)
  (read products id))


  ;; Account-owner-only function: Buy a product
;    (defun buy-product (id:string buyer:string quantity:integer)
;      (with-capability (ACCOUNT-OWNER buyer)
;        (with-read products id {"name": name, "price": price, "stock": stock}
;          (enforce (>= stock quantity) "Not enough stock")
;          (let ((new-stock (- stock quantity)))
;            (update products id {"name": name, "price": price, "stock": new-stock})
;            (insert purchases (format "{}-{}" [id buyer])
;              {"buyer": buyer, "product": name, "quantity": quantity, "timestamp": (now)}))))
;    )
  (defun list-products ()
  (map (lambda (id) (read products id)) (keys products)))
  (defun get-purchases (buyer:string)
  (filter
    (lambda (entry) (= (at 'buyer entry) buyer))
    (map (lambda (id) (read purchases id)) (keys purchases))))

)


(if (read-msg "upgrade")
  ["upgrade"]
  [
    (create-table products)
    (create-table purchases)
  ]
)