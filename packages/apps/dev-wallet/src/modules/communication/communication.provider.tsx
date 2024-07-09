import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../wallet/wallet.hook';

type Message = {
  id: string;
  type: RequestType;
  payload: unknown;
};

type RequestType =
  | 'CONNECTION_REQUEST'
  | 'SIGN_REQUEST'
  | 'PAYMENT_REQUEST'
  | 'UNLOCK_REQUEST';
type Request = Message & {
  resolve: (data: unknown) => void;
  reject: (error: unknown) => void;
};

const handle = (
  type: string,
  handler: (
    message: Message,
  ) => Promise<{ payload: unknown } | { error: unknown }>,
) => {
  const cb = async (event: MessageEvent) => {
    if (event.data.type === type && event.source) {
      const payload = await handler(event.data);
      event.source.postMessage(
        { id: event.data.id, type: event.data.type, ...payload },
        { targetOrigin: event.origin },
      );
      window.opener.focus();
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
  PropsWithChildren<{ setOrigin: (pathname: string) => void }>
> = ({ setOrigin, children }) => {
  const [requests] = useState(() => new Map<string, Request>());
  const navigate = useNavigate();
  const { isUnlocked, accounts, profile } = useWallet();

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
      handleRequest('SIGN_REQUEST', '/sign'),
      handleRequest('PAYMENT_REQUEST', '/payment'),
      handle('GET_STATUS', async () => {
        return {
          payload: {
            isUnlocked: isUnlocked,
            ...(isUnlocked ? { profile, accounts } : {}),
          },
        };
      }),
    ];
    return () => {
      handlers.forEach((unsubscribe) => unsubscribe());
    };
  }, [navigate, requests, isUnlocked]);

  return (
    <communicationContext.Provider value={requests}>
      {children}
    </communicationContext.Provider>
  );
};
