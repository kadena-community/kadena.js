import { useGlobalState } from '@/App/providers/globalState';
import { usePatchedNavigate } from '@/utils/usePatchedNavigate';
import { IUnsignedCommand } from '@kadena/client';
import { hash as blakeHash } from '@kadena/cryptography-utils';
import {
  FC,
  PropsWithChildren,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { ConnectionRequest } from '../plugins/components/ConnectionRequest';
import { SignRequestDialog } from '../plugins/components/SignRequestDialog';
import { pluginManager } from '../plugins/PluginManager';
import { Permission, Plugin } from '../plugins/type';
import { useWallet } from '../wallet/wallet.hook';

export type Message = {
  id: string;
  sessionId?: string;
  pluginId?: string;
  type: RequestType;
  payload: unknown;
};

export type RequestType =
  | 'CONNECTION_REQUEST'
  | 'SIGN_REQUEST'
  | 'GET_STATUS'
  | 'GET_NETWORK_LIST'
  | 'GET_ACCOUNTS';

type Request = Message & {
  resolve: (data: unknown) => void;
  reject: (error: unknown) => void;
};

const defaultMessageHandle = (
  type: RequestType,
  handler: (
    message: Message,
    plugin?: Plugin,
  ) => Promise<{ payload: unknown } | { error: unknown }>,
) => {
  const cb = async (event: MessageEvent) => {
    if (event.data.type === type && event.source) {
      // request from dApp
      if (!event.data.pluginId) {
        console.log('GLOBAL MESSAGE HANDEL', event.origin);
        const payload = await handler(event.data);
        event.source.postMessage(
          { id: event.data.id, type: event.data.type, ...payload },
          { targetOrigin: event.origin },
        );
        if (window.opener && event.origin) {
          window.opener.focus();
        }
      } else {
        // request from plugin
        const plugins = pluginManager.loadedPluginsList;
        const plugin = plugins.find((p) => p.config.id === event.data.pluginId);
        if (!plugin) {
          event.source.postMessage(
            {
              id: event.data.id,
              type: event.data.type,
              error: `PLUGIN_NOT_FOUND: the plugin is not loaded - pluginId: ${event.data.pluginId}`,
            },
            { targetOrigin: '*' },
          );
          return;
        }
        if (plugin.sessionId !== event.data.sessionId) {
          event.source.postMessage(
            {
              id: event.data.id,
              type: event.data.type,
              error:
                'SESSION_NOT_FOUND: the session is not active in the plugin',
            },
            { targetOrigin: '*' },
          );
          return;
        }
        const msgPermission: Permission = `MSG:${type}`;
        if (!plugin.config.permissions.includes(msgPermission)) {
          event.source.postMessage(
            {
              id: event.data.id,
              type: event.data.type,
              error: `PERMISSION_DENIED: the plugin does not have the permission to perform this action - Missing permission: "${msgPermission}"`,
            },
            { targetOrigin: '*' },
          );
          return;
        }
        const payload = await handler(event.data, plugin.config);
        event.source.postMessage(
          { id: event.data.id, type: event.data.type, ...payload },
          // TODO: use sessionId of plugins, since 'null' happens for the iframe plugins that we need more proper handling
          { targetOrigin: '*' },
        );
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
      handler: (
        message: Message,
        plugin?: Plugin,
      ) => Promise<{ payload: unknown } | { error: unknown }>,
    ) => () => void;
  }>
> = ({ children, handle = defaultMessageHandle }) => {
  const { setOrigin } = useGlobalState();
  const [requests] = useState(() => new Map<string, Request>());
  const routeNavigate = usePatchedNavigate();
  const [uiComponent, setUiComponent] = useState<ReactNode | null>(null);
  const dAppUiLoader = useCallback(
    (requestId: string, requestType: RequestType) => {
      const routeMap: Partial<Record<RequestType, string>> = {
        CONNECTION_REQUEST: '/connect',
        SIGN_REQUEST: '/sign-request',
      };
      const route = routeMap[requestType];
      if (!route) {
        throw new Error(
          `NO_UI_ACTION: No ui action is defined for the request type: ${requestType}`,
        );
      }
      const path = `${route}/${requestId}`;
      setOrigin(path);
      routeNavigate(path);
    },
    [routeNavigate, setOrigin],
  );
  const pluginUiLoader = useCallback(
    (requestId: string, type: RequestType, plugin: Plugin) => {
      if (type === 'CONNECTION_REQUEST') {
        setUiComponent(
          <ConnectionRequest
            requestId={requestId}
            plugin={plugin}
            onDone={() => {
              setUiComponent(null);
            }}
          />,
        );
        return;
      }
      if (type === 'SIGN_REQUEST') {
        setUiComponent(
          <SignRequestDialog
            requestId={requestId}
            plugin={plugin}
            onDone={() => {
              setUiComponent(null);
            }}
          />,
        );
        return;
      }
    },
    [],
  );
  const loadUiComponent = useCallback(
    (requestId: string, requestType: RequestType, plugin?: Plugin) => {
      return plugin
        ? pluginUiLoader(requestId, requestType, plugin)
        : dAppUiLoader(requestId, requestType);
    },
    [dAppUiLoader, pluginUiLoader],
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

    const handleUIRequiredRequest = (
      type: 'CONNECTION_REQUEST' | 'SIGN_REQUEST',
    ) =>
      handle(type, async (payload) => {
        const request = createRequest(payload);
        loadUiComponent(payload.id, type);
        return request;
      });
    const handlers = [
      handleUIRequiredRequest('CONNECTION_REQUEST'),
      handle('SIGN_REQUEST', async (data) => {
        const req = data.payload as Partial<IUnsignedCommand>;
        if (!('hash' in req) && 'cmd' in req && req.cmd) {
          req.hash = blakeHash(req.cmd);
        }
        const request = createRequest(data);
        loadUiComponent(data.id, 'SIGN_REQUEST');
        return request;
      }),
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
                ({
                  address,
                  alias,
                  overallBalance,
                  chains,
                  guard,
                  contract,
                }) => ({
                  address,
                  alias,
                  overallBalance,
                  chains,
                  guard,
                  contract,
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
      {uiComponent}
    </communicationContext.Provider>
  );
};
