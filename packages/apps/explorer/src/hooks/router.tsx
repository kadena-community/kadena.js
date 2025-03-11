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

    // if networkId is passed, find appropriate slug and redirect
    if (router.query.networkId) {
      // maybe network is passed
      const networkId = router.query.networkId;
      const network = innerNetworks.find((n) => n.networkId === networkId);
      if (network) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.replace(
          createHref(
            network,
            innerNetworks,
            `${location.pathname}${location.hash}`,
          ),
        );
        return;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.replace(
          createHref(
            innerNetworks.find((x) => x.networkId === 'mainnet')!,
            innerNetworks,
            router.asPath,
          ),
        );
        return;
      }
    }

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

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.replace(
        createHref(
          networks.find((x) => x.networkId === 'mainnet')!,
          innerNetworks,
          `/mainnet/${router.asPath.split('/').slice(2).join('/')}`,
        ),
      );
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
