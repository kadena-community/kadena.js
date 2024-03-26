import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTodo } from './api/api';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';

export function TodoApp() {
  const queryClient = useQueryClient();
  const { mutateAsync: addTodo, isPending } = useMutation({
    mutationKey: ['todos/createTodo'],
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['todos/readTodos'],
      });
    },
  });

  return (
    <div>
      <TodoInput addTodo={addTodo} />
      {isPending && <p>Adding todo it works</p>}
      <TodoList />
    </div>
  );
}
