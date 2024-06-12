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

type RequestType = 'CONNECTION_REQUEST' | 'SIGN_REQUEST' | 'PAYMENT_REQUEST';
type Request = {
  payload: unknown;
  resolve: (data: unknown) => void;
  reject: (error: unknown) => void;
};

const handle = (
  type: string,
  handler: (
    message: unknown & {
      id: string;
      type: RequestType;
    },
  ) => unknown,
) => {
  const cb = async (event: MessageEvent) => {
    if (event.data.type === type && event.source) {
      console.log('Received message', event.data, event.origin);
      const payload = await handler(event.data);
      console.log('Sending response', {
        id: event.data.id,
        type: event.data.type,
        payload,
      });
      event.source.postMessage(
        { id: event.data.id, type: event.data.type, payload },
        { targetOrigin: event.origin },
      );
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

export const CommunicationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [requests] = useState(
    new Map<
      string,
      {
        payload: unknown;
        resolve: (data: unknown) => void;
        reject: (error: unknown) => void;
      }
    >(),
  );
  const navigate = useNavigate();
  const wallet = useWallet();

  useEffect(() => {
    console.log('CommunicationProvider mounted');
    const createRequest = (payload: { id: string }) =>
      new Promise((resolve) => {
        const request = {
          payload,
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
        requests.set(payload.id, request);
      }).finally(() => {
        console.log('Removing request', payload.id);
        requests.delete(payload.id);
      });

    const handleRequest = (type: RequestType, route: string) =>
      handle(type, async (payload) => {
        if (!wallet.isUnlocked) {
          const unlock = {
            id: 'unlock',
            type: 'UNLOCK_REQUEST',
          };
          const unlockRequest = createRequest(unlock);
          navigate(`/select-profile`);
          await unlockRequest;
        }
        const request = createRequest(payload);
        navigate(`${route}?requestId=${payload.id}`);
        return request;
      });
    const handlers = [
      handleRequest('CONNECTION_REQUEST', '/connect'),
      handleRequest('SIGN_REQUEST', '/sign'),
      handleRequest('PAYMENT_REQUEST', '/payment'),
      handle('IS_UNLOCKED', () => {
        return {
          isUnlocked: wallet.isUnlocked,
        };
      }),
    ];
    return () => {
      handlers.forEach((unsubscribe) => unsubscribe());
    };
  }, [navigate, requests, wallet.isUnlocked]);

  useEffect(() => {
    const run = async () => {
      if (wallet.isUnlocked && requests.has('unlock')) {
        requests.get('unlock')?.resolve({});
        requests.delete('unlock');
      }
    };
    run();
  }, [requests, wallet.isUnlocked]);

  return (
    <communicationContext.Provider value={requests}>
      {children}
    </communicationContext.Provider>
  );
};
