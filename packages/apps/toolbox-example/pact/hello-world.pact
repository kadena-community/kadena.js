(namespace 'free )

(module hello-world G
  (defcap G () true)
  (defun say-hello(name:string)
    (format "Hello, {}!" [name])
  )
)
