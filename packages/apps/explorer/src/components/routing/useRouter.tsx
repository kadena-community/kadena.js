import { selectedNetworkKey, useNetwork } from '@/context/networks-context';
import Cookies from 'js-cookie';
import { useRouter as NextUseRouter } from 'next/router';
import { useEffect } from 'react';
import { createHref, removeNetworkFromPath } from './utils';

export const useRouter = () => {
  const { activeNetwork, networks } = useNetwork();
  const router = NextUseRouter();

  //check that the first part of a URL is really an existing network.
  //if not, redirect to root
  useEffect(() => {
    const pathArray = router.asPath;
    const foundNetwork = networks.find((n) =>
      n.networkId.startsWith(pathArray[0]),
    );

    if (!foundNetwork) {
      //check that localstorage for selectedNetwork is not that value
      const selectedNetworkLocalstorage = JSON.parse(
        localStorage.getItem(selectedNetworkKey) ?? '{}',
      );

      if (selectedNetworkLocalstorage.networkId === pathArray[0]) {
        localStorage.removeItem(selectedNetworkKey);
        Cookies.remove(selectedNetworkKey);
      }

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push('/');
    }
  }, [router.asPath]);

  const replace = (href: string): Promise<boolean> => {
    return router.replace(createHref(activeNetwork, networks, href));
  };
  const push = (href: string): Promise<boolean> => {
    return router.push(createHref(activeNetwork, networks, href));
  };

  const asPath = removeNetworkFromPath(router.asPath, networks);

  return { ...router, replace, push, asPath, activeNetwork };
};
