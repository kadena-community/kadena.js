
(module coin GOVERNANCE
  (defun transfer:type (sender:string receiver:string amount:number))

  (defun account-guard:guard (id:string account:string)
    (with-read ledger (key id account) { 'guard := g } g)
  )

  (defun get-policy-info:object{policy-info} (id:string)
    (with-read tokens id { 'policie: { "blaat": id } } ))


  @doc "some string"
  @doc "iets verder"

  @managed ;; this is ac omment
  @managed
    (enforce (sale-active timeout) "SALE: invalid timeout")

  (iets {
    'haha: "haha"
  })

  (defcap MINT (id:string account:string amount:decimal)
    @managed ;; one-shot for a given amount
    (enforce (< 0.0 amount) "Amount must be positive")
    (compose-capability (CREDIT id account))
    (compose-capability (UPDATE_SUPPLY))
  )
)

