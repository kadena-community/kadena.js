import { createPactTestEnv } from '@kadena/toolbox/test';
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { afterAll, beforeAll, describe, it } from 'vitest';
import { createTodo } from '../api/api';
import { queryClient } from '../api/queryClient';
import { TodoList } from './TodoList';

function renderComponent() {
  return render(
    <QueryClientProvider client={queryClient}>
      <TodoList />
    </QueryClientProvider>,
  );
}
describe('TodoList', async () => {
  const env = await createPactTestEnv({
    network: 'local',
    enableProxy: false,
  });

  beforeAll(async () => {
    await env.start();
    await env.client.deployContract('todos.pact');
  });

  afterAll(async () => {
    await env.stop();
  });

  it('should render an empty list', async () => {
    renderComponent();
    await screen.findByText('No todos');
  });

  it('should render a list of todos', async () => {
    await createTodo('Learn pact', '1');
    renderComponent();
    await screen.findByText('Learn pact');
  });
});
