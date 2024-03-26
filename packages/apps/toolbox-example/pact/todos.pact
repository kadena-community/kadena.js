(namespace "free")
(module todos G
  (defcap G() true)

  ;; todo schema and table
  (defschema todo
    "Row type for todos."
     title:string
     completed:bool
     deleted:bool
  )

  (deftable todo-table:{todo})

  ;;
  ;; API functions
  ;;

  (defun new-todo (id title)
    @doc "Create new todo with ENTRY and DATE."
    (insert todo-table id {
      "title": title,
      "completed": false,
      "deleted": false
    })
  )

  (defun toggle-todo-status (id)
    "Toggle completed status flag for todo at ID."
    (with-read todo-table id { "completed":= state }
      (update todo-table id { "completed": (not state) })
    )
  )

  (defun edit-todo (id title)
    "Update todo ENTRY at ID."
    (update todo-table id { "title": title }))

  (defun delete-todo (id)
    "Delete todo title at ID (by setting deleted flag)."
    (update todo-table id { "deleted": true })
  )

  (defun read-todo (id)
    "Read a single todo"
    (+ {'id: id} (read todo-table id))
  )

  (defun read-todos()
    "Read all todos."
    (map (read-todo) (keys todo-table))
  )
)


(if (read-msg "upgrade") ["Module upgraded"] [(create-table todo-table)])
