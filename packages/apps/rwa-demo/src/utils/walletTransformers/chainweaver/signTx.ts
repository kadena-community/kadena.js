import { getWalletConnection } from '@/utils/getWalletConnection/getWalletConnection';
import type { ICommand, IUnsignedCommand } from '@kadena/client';

export const chainweaverSignTx = async (tx: IUnsignedCommand) => {
  const { message, close } = await getWalletConnection();
  console.log(JSON.parse(tx.cmd));
  const response = await message('SIGN_REQUEST', tx as any);
  const payload: {
    status: 'signed' | 'rejected';
    transaction?: ICommand;
  } = response.payload as any;

  close();

  return payload.transaction;
};
