'use client';

import { FormEvent, useState } from 'react';
interface TodoInputProps {
  addTodo: (title: string) => void;
}

export function TodoInput(props: TodoInputProps) {
  const [title, setTitle] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    props.addTodo?.(title);
    setTitle('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title</label>
      <input id="title" type="text" value={title} onChange={(event) => setTitle(event.target.value)} />
      <button type="submit">Add Todo</button>
    </form>
  );
}
