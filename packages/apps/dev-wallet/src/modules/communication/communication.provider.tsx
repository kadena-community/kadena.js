import { useGlobalState } from '@/App/providers/globalState';
import { usePatchedNavigate } from '@/utils/usePatchedNavigate';
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useWallet } from '../wallet/wallet.hook';

type Message = {
  id: string;
  type: RequestType;
  payload: unknown;
};

type RequestType =
  | 'GET_STATUS'
  | 'CONNECTION_REQUEST'
  | 'SIGN_REQUEST'
  | 'PAYMENT_REQUEST'
  | 'UNLOCK_REQUEST'
  | 'GET_NETWORK_LIST';
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
    if (event.data.type === type && event.source) {
      const payload = await handler(event.data);
      event.source.postMessage(
        { id: event.data.id, type: event.data.type, ...payload },
        // TODO: use sessionId of plugins, since 'null' happens for the iframe plugins that we need more proper handling
        { targetOrigin: event.origin === 'null' ? '*' : event.origin },
      );
      if (window.opener && event.origin && event.origin !== 'null') {
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
    uiLoader?: (route: string) => void;
  }>
> = ({ children, handle = messageHandle, uiLoader }) => {
  const { setOrigin } = useGlobalState();
  const [requests] = useState(() => new Map<string, Request>());
  const routeNavigate = usePatchedNavigate();
  const navigate =
    uiLoader ||
    ((route: string) => {
      setOrigin(route);
      routeNavigate(route);
    });
  const { isUnlocked, accounts, profile, networks, activeNetwork } =
    useWallet();

  useEffect(() => {
    console.log('CommunicationProvider mounted', isUnlocked);
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

    const handleRequest = (type: RequestType, route: string) =>
      handle(type, async (payload) => {
        console.log('handleRequest', type, payload);
        const request = createRequest(payload);
        setOrigin(`${route}/${payload.id}`);
        navigate(`${route}/${payload.id}`);
        return request;
      });
    const handlers = [
      handleRequest('CONNECTION_REQUEST', '/connect'),
      handleRequest('PAYMENT_REQUEST', '/payment'),
      handleRequest('SIGN_REQUEST', '/sign-request'),
      handle('GET_STATUS', async () => {
        return {
          payload: {
            isUnlocked: isUnlocked,
            ...(isUnlocked ? { profile, accounts } : {}),
          },
        };
      }),
      handle('GET_NETWORK_LIST', async () => {
        return {
          payload: isUnlocked ? networks : [],
        };
      }),
    ];
    return () => {
      handlers.forEach((unsubscribe) => unsubscribe());
    };
  }, [
    navigate,
    requests,
    isUnlocked,
    accounts,
    profile,
    networks,
    activeNetwork,
    setOrigin,
  ]);

  return (
    <communicationContext.Provider value={requests}>
      {children}
    </communicationContext.Provider>
  );
};
