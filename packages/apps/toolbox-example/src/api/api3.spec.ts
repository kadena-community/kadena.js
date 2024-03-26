import { generateUUID } from '@pact-toolbox/client-utils';
import { createPactTestEnv } from 'pact-toolbox';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createTodo, deleteTodoById, editTodoById, readTodoById, readTodos, toggleTodoStatusById } from './api';

describe('todos api pact local server', async () => {
  let id = generateUUID();
  let title = 'Learn pact';

  const env = await createPactTestEnv({
    network: 'local',
    enableProxy: false,
  });

  beforeAll(async () => {
    await env.start();
    await env.runtime.deployContract('todos.pact');
  });

  afterAll(async () => {
    await env.stop();
  });
  it('should read all todos', async () => {
    const todos = await readTodos();
    expect(todos).toEqual([]);
  });

  it('should create a todo', async () => {
    const message = await createTodo(title, id);
    expect(message).toEqual('Write succeeded');
    const todos = await readTodos();
    expect(todos[0].title).toEqual(title);
  });

  it('should read one todo by id', async () => {
    const todo = await readTodoById(id);
    expect(todo.title).toEqual(title);
  });

  it('should edit a todo', async () => {
    const newTitle = 'build a todo app';
    const message = await editTodoById(id, newTitle);
    expect(message).toEqual('Write succeeded');
    const t = await readTodoById(id);
    expect(t.title).toEqual(newTitle);
  });

  it('should complete a todo', async () => {
    const message = await toggleTodoStatusById(id);
    expect(message).toEqual('Write succeeded');
    const t = await readTodoById(id);
    expect(t.completed).toEqual(true);
  });

  it('should delete a todo', async () => {
    const message = await deleteTodoById(id);
    expect(message).toEqual('Write succeeded');
    const t = await readTodoById(id);
    expect(t.deleted).toEqual(true);
  });
});
