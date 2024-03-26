import { Pact } from '@kadena/client';
import { dirtyReadClient } from '@kadena/client-utils';
import { addDefaultMeta, getSignerAccount } from '@kadena/client-utils/toolbox';
import { composePactCommand, execution } from '@kadena/client/fp';

// const wallet = new EckoWalletProvider();

export interface Todo {
  title: string;
  completed: boolean;
  deleted: boolean;
  id: string;
}
export async function readTodos() {
  const tx = composePactCommand(execution(`(free.todos.read-todos)`));
  return dirtyReadClient<Todo[]>({})(tx);
}

export async function readTodoById(id: string) {
  const tx = addDefaultMeta(
    Pact.builder.execution(`(free.todos.read-todo "${id}")`),
  ).createTransaction();
  return dirtyReadOrFail<Todo>(tx);
}

export async function editTodoById(id: string, title: string) {
  const signer = getSignerAccount();
  const tx = addDefaultMeta(
    Pact.builder.execution(`(free.todos.edit-todo "${id}" "${title}")`),
  )
    .addSigner(signer.publicKey)
    .setMeta({
      senderAccount: signer.account,
    })
    .createTransaction();
  const signedTX = await wallet.sign(tx);
  return submitAndListen(signedTX);
}

export async function toggleTodoStatusById(id: string) {
  const signer = getSignerAccount();
  const tx = addDefaultMeta(
    Pact.builder.execution(`(free.todos.toggle-todo-status "${id}")`),
  )
    .addSigner(signer.publicKey)
    .setMeta({
      senderAccount: signer.account,
    })
    .createTransaction();
  const signedTX = await wallet.sign(tx);
  return submitAndListen(signedTX);
}

export async function deleteTodoById(id: string) {
  const signer = getSignerAccount();
  const tx = addDefaultMeta(
    Pact.builder.execution(`(free.todos.delete-todo "${id}")`),
  )
    .addSigner(signer.publicKey)
    .setMeta({
      senderAccount: signer.account,
    })
    .createTransaction();
  const signedTX = await wallet.sign(tx);
  return submitAndListen(signedTX);
}

export async function createTodo(title: string, id: string = generateUUID()) {
  const signer = getSignerAccount();
  const tx = addDefaultMeta(
    Pact.builder.execution(`(free.todos.new-todo "${id}" "${title}")`),
  )
    .addSigner(signer.publicKey, (signFor) => [signFor('coin.GAS')])
    .setMeta({
      senderAccount: signer.account,
    })
    .createTransaction();
  const signedTX = await wallet.sign(tx);
  return submitAndListen(signedTX);
}
