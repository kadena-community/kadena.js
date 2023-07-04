import { IPactCommand } from '../../interfaces/IPactCommand';

/**
 * @alpha
 */
export const setProp = <T extends keyof IPactCommand>(
  item: T,
  value: IPactCommand[T],
): { [key in T]: IPactCommand[T] } => {
  return { [item]: value } as { [key in T]: IPactCommand[T] };
};
