import type { INetwork } from '@/context/networks-context';

export const createHref = (activeNetwork: INetwork, href: string): string => {
  //if the href is just a # link return it.
  if (href.startsWith('#')) return href;

  const arr = href.split('/');

  const cleanedArr = arr.filter((val) => val);

  if (cleanedArr[0] !== activeNetwork.networkId) {
    cleanedArr.unshift(activeNetwork.networkId);
  }

  return `/${cleanedArr.join('/')}`;
};
