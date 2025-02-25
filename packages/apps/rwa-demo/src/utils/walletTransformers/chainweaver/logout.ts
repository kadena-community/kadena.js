import type { IECKOWindow } from '@/components/EckoWalletConnect/eckotypes';
import { env } from '@/utils/env';

export const chainweaverAccountLogout = async (): Promise<void> => {
  const { kadena } = window as IECKOWindow;
  const isKadena = Boolean(kadena && kadena.isKadena);
  if (!isKadena) return;

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  kadena.request({
    method: 'kda_disconnect',
    networkId: env.NETWORKID,
  });
};
