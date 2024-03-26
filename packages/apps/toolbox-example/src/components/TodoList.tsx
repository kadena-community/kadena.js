import { useQuery } from '@tanstack/react-query';
import { readTodos } from '../api/api';

export function TodoList() {
  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos/readTodos'],
    queryFn: readTodos,
  });

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : todos.length > 0 ? (
        todos.map((todo) => (
          <div key={todo.id}>
            <h2>{todo.title}</h2>
            <p>{todo.completed}</p>
          </div>
        ))
      ) : (
        <p>No todos</p>
      )}
    </div>
  );
}
