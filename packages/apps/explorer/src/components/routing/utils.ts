import type { INetwork } from '@/context/networks-context';

export const createHref = (
  activeNetwork: INetwork,
  networks: INetwork[],
  href: string,
): string => {
  //if the href is just a # link return it.
  if (href.startsWith('#')) return href;

  const arr = href.split('/');

  const cleanedArr = arr.filter((val) => val);

  if (!networks.find((n) => n.networkId === cleanedArr[0])) {
    cleanedArr.unshift(activeNetwork.networkId);
  }

  return `/${cleanedArr.join('/')}`;
};
