import { ICommand } from '../../interfaces/ICommand';

export const setProp = <T extends keyof ICommand>(
  item: T,
  value: ICommand[T],
): { [key in T]: ICommand[T] } => {
  return { [item]: value } as { [key in T]: ICommand[T] };
};
