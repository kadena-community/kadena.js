import { useNetwork } from '@/context/networks-context';
import { useRouter as NextUseRouter } from 'next/router';
import { createHref, removeNetworkFromPath } from './utils';

export const useRouter = () => {
  const { activeNetwork, networks } = useNetwork();
  const router = NextUseRouter();

  const replace = (href: string): Promise<boolean> => {
    return router.replace(createHref(activeNetwork, networks, href));
  };
  const push = (href: string): Promise<boolean> => {
    return router.push(createHref(activeNetwork, networks, href));
  };

  const asPath = removeNetworkFromPath(router.asPath, networks);

  return { ...router, replace, push, asPath, activeNetwork };
};
