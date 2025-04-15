import {
  CommunicationProvider,
  Message,
  RequestType,
} from '@/modules/communication/communication.provider';
import { ReactNode, useMemo, useState } from 'react';
import { ConnectionRequest } from './components/ConnectionRequest';
import { SignRequestDialog } from './components/SignRequestDialog';
import { Permission, Plugin } from './type';

const messageHandle =
  (activeSessions: string[], permissions: Permission[]) =>
  (
    type: RequestType,
    handler: (
      message: Message,
    ) => Promise<{ payload: unknown } | { error: unknown }>,
  ) => {
    const cb = async (event: MessageEvent) => {
      if (
        event.data.type === type &&
        event.source &&
        (event.origin === 'null' || event.data.pluginId) &&
        event.data.sessionId
      ) {
        const msgPermission:Permission = `MSG:${type}`;
        if (!permissions.includes(msgPermission)) {
          event.source.postMessage(
            {
              id: event.data.id,
              type: event.data.type,
              error:
                `PERMISSION_DENIED: the plugin does not have the permission to perform this action - Missing permission: "${msgPermission}"`,
            },
            { targetOrigin: '*' },
          );
          return;
        }
        if (!activeSessions.includes(event.data.sessionId)) {
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
        const payload = await handler(event.data);
        event.source.postMessage(
          { id: event.data.id, type: event.data.type, ...payload },
          // TODO: use sessionId of plugins, since 'null' happens for the iframe plugins that we need more proper handling
          { targetOrigin: '*' },
        );
      }
    };
    window.addEventListener('message', cb);
    return () => window.removeEventListener('message', cb);
  };

export function PluginCommunicationProvider({
  children,
  sessionId,
  plugin,
}: {
  children: ReactNode;
  sessionId?: string;
  plugin: Plugin;
}) {
  const handle = useMemo(
    () => messageHandle(sessionId ? [sessionId] : [], plugin.permissions),
    [sessionId, plugin.permissions],
  );
  const [uiComponent, setUiComponent] = useState<ReactNode | null>(null);
  return (
    <CommunicationProvider
      handle={handle}
      uiLoader={(requestId, type) => {
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
      }}
    >
      {children}
      {uiComponent}
    </CommunicationProvider>
  );
}
