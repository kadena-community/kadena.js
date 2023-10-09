import { useRef, useState } from 'react';

export const CLIENT_EVENTS = [
  'session_proposal',
  'session_update',
  'session_extend',
  'session_ping',
  'session_delete',
  'session_expire',
  'session_request',
  'session_request_sent',
  'session_event',
  'proposal_expire',
] as const;

type ClientEventTypes = (typeof CLIENT_EVENTS)[number];
export type ClientEvents = [ClientEventTypes, unknown];

// https://docs.walletconnect.com/2.0/specs/clients/sign/error-codes
export const CLIENT_ERRORS = {
  USER_DISCONNECTED: { code: 6000, message: 'User disconnected.' },
};

export const getAccountsRequest = (
  account: string,
  onlyForCoinContract: boolean = true,
) => {
  const request = {
    id: 1,
    jsonrpc: '2.0',
    method: 'kadena_getAccounts_v1',
    params: {
      accounts: [
        {
          account: account,
          // optional, when omitted the wallet returns all known fungible accounts
          contracts: onlyForCoinContract ? ['coin'] : undefined,
        },
      ],
    },
  };
  return request;
};

export function safeJsonParse<T>(str: string): T | null {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
}

export const timeout = (value: unknown, ms: number) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

/**
 * Force rerender of component
 * Used when something updates in a global static class
 * That would otherwise not be able to trigger a rerender
 */
export const useRenderhook = () => {
  const renderRef = useRef(0);
  const [, setRenderId] = useState(0);

  const render = () => {
    renderRef.current += 1;
    setRenderId(renderRef.current);
  };

  return render;
};
