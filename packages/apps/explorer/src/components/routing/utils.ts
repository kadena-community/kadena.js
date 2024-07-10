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

export const removeNetworkFromPath = (href: string, networks: INetwork[]) => {
  const regExp = new RegExp(/[?#].*/);
  const match = href.match(regExp);

  const searchParams = match?.length ? match[0] : '';

  const arr = href
    .replace(regExp, '')
    .split('/')
    .filter((v) => v);

  if (networks.find((v) => v.networkId === arr[0])) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [first, ...restArr] = arr;
    return `/${restArr.join('/')}${searchParams}`;
  }

  return href;
};
