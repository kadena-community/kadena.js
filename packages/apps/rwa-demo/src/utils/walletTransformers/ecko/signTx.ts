import type { IECKOWindow } from '@/components/EckoWalletConnect/eckotypes';
import { env } from '@/utils/env';
import type { IUnsignedCommand } from '@kadena/client';

export const eckoSignTx = async (tx: IUnsignedCommand) => {
  const { kadena } = window as IECKOWindow;
  const cmd = JSON.parse(tx.cmd);

  const eckoUnsignedTx = {
    ...cmd.meta,
    pactCode: cmd.payload.exec.code,
    envData: cmd.payload.exec.data,
    caps: cmd.signers[0].clist.map((c) => ({
      cap: c,
    })),
  };

  const result = await kadena.request({
    method: 'kda_requestSign',
    data: {
      networkId: env.NETWORKID,
      signingCmd: eckoUnsignedTx,
    },
  });

  return result.signedCmd;
};
