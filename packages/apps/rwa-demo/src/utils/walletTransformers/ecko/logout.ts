import type { IECKOWindow } from '@/components/EckoWalletConnect/eckotypes';
import { env } from '@/utils/env';

export const eckoAccountLogout = async (): Promise<void> => {
  const { kadena } = window as IECKOWindow;
  const isKadena = Boolean(kadena && kadena.isKadena);
  if (!isKadena) return;

  await kadena.request({
    method: 'kda_disconnect',
    networkId: env.NETWORKID,
  });
};
