import { createHref, removeNetworkFromPath } from '@/components/Routing/utils';
import {
  getNetworks,
  selectedNetworkKey,
  useNetwork,
} from '@/context/networksContext';
import Cookies from 'js-cookie';
import { useRouter as NextUseRouter } from 'next/router';
import { useEffect } from 'react';

export const useRouter = () => {
  const { activeNetwork, networks } = useNetwork();
  const router = NextUseRouter();

  //check that the first part of a URL is really an existing network.
  //if not, redirect to root
  useEffect(() => {
    if (!router.isReady) return;

    const innerNetworks = getNetworks();

    const regExp = new RegExp(/[?#].*/);
    const pathArray = router.asPath
      .replace(regExp, '')
      .split('/')
      .filter((v) => !!v);
    const foundNetwork = innerNetworks.find(
      (n) => n.slug && pathArray[0] === n.slug,
    );

    if (!foundNetwork) {
      //check that localstorage for selectedNetwork is not that value
      const selectedNetworkLocalstorageValue =
        localStorage.getItem(selectedNetworkKey);

      try {
        const selectedNetworkLocalstorage = selectedNetworkLocalstorageValue
          ? JSON.parse(selectedNetworkLocalstorageValue)
          : null;

        if (selectedNetworkLocalstorage) {
          if (
            selectedNetworkLocalstorage.slug === pathArray[0] ||
            !selectedNetworkLocalstorage.slug
          ) {
            localStorage.removeItem(selectedNetworkKey);
            Cookies.remove(selectedNetworkKey);
          }
        }
      } catch (e) {
        localStorage.removeItem(selectedNetworkKey);
        Cookies.remove(selectedNetworkKey);
      }

      window.location.href = '/mainnet';
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
