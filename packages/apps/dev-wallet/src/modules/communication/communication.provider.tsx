import { useGlobalState } from '@/App/providers/globalState';
import { usePatchedNavigate } from '@/utils/usePatchedNavigate';
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useWallet } from '../wallet/wallet.hook';

export type Message = {
  id: string;
  type: RequestType;
  payload: unknown;
};

export type UiRequiredRequest = 'CONNECTION_REQUEST' | 'SIGN_REQUEST';

export type RequestType =
  | UiRequiredRequest
  | 'GET_STATUS'
  | 'GET_NETWORK_LIST'
  | 'GET_ACCOUNTS';

type Request = Message & {
  resolve: (data: unknown) => void;
  reject: (error: unknown) => void;
};

const messageHandle = (
  type: RequestType,
  handler: (
    message: Message,
  ) => Promise<{ payload: unknown } | { error: unknown }>,
) => {
  const cb = async (event: MessageEvent) => {
    if (event.data.type === type && event.source && event.origin !== 'null') {
      const payload = await handler(event.data);
      event.source.postMessage(
        { id: event.data.id, type: event.data.type, ...payload },
        { targetOrigin: event.origin },
      );
      if (window.opener && event.origin) {
        window.opener.focus();
      }
    }
  };
  window.addEventListener('message', cb);
  return () => window.removeEventListener('message', cb);
};

const communicationContext = createContext<Map<string, Request>>(new Map());

export const useRequests = () => {
  const requests = useContext(communicationContext);
  return requests;
};

export const CommunicationProvider: FC<
  PropsWithChildren<{
    handle?: (
      type: RequestType,
      handler: (message: Message) => Promise<
        | {
            payload: unknown;
          }
        | {
            error: unknown;
          }
      >,
    ) => () => void;
    uiLoader?: (requestId: string, requestType: UiRequiredRequest) => void;
  }>
> = ({ children, handle = messageHandle, uiLoader }) => {
  const { setOrigin } = useGlobalState();
  const [requests] = useState(() => new Map<string, Request>());
  const routeNavigate = usePatchedNavigate();
  const defaultUiLoader = useCallback(
    (requestId: string, requestType: UiRequiredRequest) => {
      const routeMap = {
        CONNECTION_REQUEST: '/connect',
        PAYMENT_REQUEST: '/payment',
        SIGN_REQUEST: '/sign-request',
      };
      const route = routeMap[requestType];
      if (!route) return;
      const path = `${route}/${requestId}`;
      setOrigin(path);
      routeNavigate(path);
    },
    [routeNavigate, setOrigin],
  );
  const loadUiComponent = useCallback(
    (requestId: string, requestType: UiRequiredRequest) => {
      const loader = uiLoader || defaultUiLoader;
      return loader(requestId, requestType);
    },
    [defaultUiLoader, uiLoader],
  );
  const { isUnlocked, accounts, profile, networks, activeNetwork, keySources } =
    useWallet();

  useEffect(() => {
    const createRequest = (data: Message) =>
      new Promise<{ payload: unknown } | { error: unknown }>((resolve) => {
        const request = {
          ...data,
          resolve: (payload: unknown) => {
            resolve({
              payload,
            });
          },
          reject: (error: unknown) => {
            resolve({
              error,
            });
          },
        };
        requests.set(data.id, request);
      }).finally(() => {
        requests.delete(data.id);
      });

    const handleUIRequiredRequest = (type: UiRequiredRequest) =>
      handle(type, async (payload) => {
        const request = createRequest(payload);
        loadUiComponent(payload.id, type);
        return request;
      });
    const handlers = [
      handleUIRequiredRequest('CONNECTION_REQUEST'),
      handleUIRequiredRequest('SIGN_REQUEST'),
      handle('GET_STATUS', async () => {
        if (!isUnlocked || !profile) return { payload: { isUnlocked: false } };
        const { uuid, name, accentColor } = profile;
        const accountsToSend = accounts.map(
          ({ address, alias, overallBalance, chains, guard }) => ({
            address,
            alias,
            overallBalance,
            chains,
            guard,
          }),
        );
        return {
          payload: {
            isUnlocked: isUnlocked,
            profile: {
              uuid,
              name,
              accentColor,
              authMode: profile.options?.authMode,
            },
            accounts: accountsToSend,
            keySources: keySources.map(({ uuid, source, keys }) => ({
              uuid,
              source,
              keys,
            })),
            networks,
            activeNetwork,
          },
        };
      }),
      handle('GET_NETWORK_LIST', async () => {
        return {
          payload: isUnlocked ? networks : [],
        };
      }),
      handle('GET_ACCOUNTS', async () => {
        return {
          payload: isUnlocked
            ? accounts.map(
                ({ address, alias, overallBalance, chains, guard }) => ({
                  address,
                  alias,
                  overallBalance,
                  chains,
                  guard,
                }),
              )
            : [],
        };
      }),
    ];
    return () => {
      handlers.forEach((unsubscribe) => unsubscribe());
    };
  }, [
    loadUiComponent,
    requests,
    isUnlocked,
    accounts,
    profile,
    networks,
    activeNetwork,
    setOrigin,
    handle,
    keySources,
  ]);

  return (
    <communicationContext.Provider value={requests}>
      {children}
    </communicationContext.Provider>
  );
};
