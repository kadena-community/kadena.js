import { addData, IAddKeyset } from './addData';

/**
 * Helper to add keyset to the data property for {@link IPactCommand.payload}
 *
 * @public
 */
export const addKeyset: IAddKeyset = (
  name: string,
  pred: string,
  ...publicKeys: string[]
) => addData(name, { keys: publicKeys, pred });
