import { GetServerSidePropsContext } from 'next';
import Cookies from 'js-cookie';
import { DateTime } from 'luxon';
import cookie from 'cookie';
import { NetworkName } from './api';
import { hasWindow } from './window';
import { Route } from '../config/Routes';

export function getCookie(name: string, context?: GetServerSidePropsContext) {
  return context
    ? getCookieFromString(name, context?.req?.headers?.cookie) ||
        context?.req?.cookies?.leafythings_session
    : Cookies.get(name);
}

export function getNetworkCookie(
  context?: GetServerSidePropsContext,
  resolvedUrl?: string,
) {
  if (resolvedUrl === Route.Testnet) {
    return NetworkName.TEST_NETWORK;
  }
  if (resolvedUrl === Route.Mainnet) {
    return NetworkName.MAIN_NETWORK;
  }
  const networkCookie = context
    ? getCookieFromString('network', context?.req?.headers?.cookie) ||
      context?.req?.cookies?.leafythings_session
    : Cookies.get('network');
  if (hasWindow && !networkCookie) {
    Cookies.set('network', NetworkName.MAIN_NETWORK);
  }
  return (networkCookie || NetworkName.MAIN_NETWORK) as NetworkName;
}

export const setCookieStatic = (
  ctx: GetServerSidePropsContext,
  cookieName: string,
  cookieValue: string,
) => {
  if (ctx?.res && ctx?.req) {
    const cookieString = getCookie(cookieName, ctx);
    if (cookieString !== cookieValue) {
      const expires = DateTime.now().plus({ days: 365 }).toJSDate();
      ctx.res.setHeader(
        'Set-Cookie',
        cookie.serialize(cookieName, cookieValue, {
          httpOnly: false,
          secure: false,
          path: '/',
          expires,
        }),
      );
    }
  }
};

export function setNetworkCookie(network: NetworkName) {
  Cookies.set('network', network || NetworkName.MAIN_NETWORK, {
    path: '/',
    secure: false,
  });
}

export const getCookieFromString = (
  cookieName: string,
  cookieString?: string,
) => {
  if (cookieString) {
    const name = cookieName + '=';
    const decodedCookie = decodeURIComponent(cookieString);
    if (decodedCookie) {
      const ca = decodedCookie.split(';');
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
        }
      }
    }
  }
  return '';
};
