import {
  RegistrySignModalContent,
  SignModalContent,
} from '@/components/registry-transfer/registry-transfer';
import { safeJsonParse } from '@/utils/helpers';
import { KadenaRemoteServer, MessagesMap } from '@kadena/lib-kadena-wallet';
import { useModal } from '@kadena/react-ui';
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { useCrypto } from './crypto.context';

interface RemoteConnectionContext {
  server: KadenaRemoteServer;
}

const remoteServerContext = createContext<RemoteConnectionContext>({
  server: new KadenaRemoteServer(),
});
export const useRemoteServer = () => useContext(remoteServerContext);

export const RemoteConnectionContext: FC<PropsWithChildren> = ({
  children,
}) => {
  const [connectionId, setConnectionId] = useLocalStorage<string>(
    'kadena_connection_id',
    '',
  );
  const serverRef = useRef(new KadenaRemoteServer());
  const server = serverRef.current;
  const wallet = useCrypto();
  const { renderModal, clearModal } = useModal();

  useEffect(() => {
    if (import.meta.env.VITE_REMOTE_ENABLED !== 'true') return;
    if (!connectionId) {
      const id = crypto.randomUUID();
      setConnectionId(id);
    }
    if (connectionId && wallet.loaded && !server.connectionId) {
      console.log('setting server connection id');
      server.setConnectionId(connectionId);
      server.listen().catch(console.error);
    }
  }, [connectionId, server, setConnectionId, wallet.loaded]);

  const onSign = useCallback(
    (data: MessagesMap['sign']['payload']) => {
      console.log('onsign', data);
      return new Promise((resolve) => {
        renderModal(
          <SignModalContent
            transaction={data}
            onSign={() => {
              const parsed = safeJsonParse<any>(data.cmd);

              const sigs = [...data.sigs];
              for (const [index, signer] of parsed.signers.entries()) {
                const { sig } = wallet.sign(data.cmd, signer.pubKey);
                sigs[index] = { sig: sig! };
              }
              const signed = { ...data, sigs };
              console.log('signed', signed);
              resolve(signed);
              clearModal();
            }}
          />,
          'sign modal',
        );
      });
    },
    [clearModal, renderModal, wallet],
  );

  const onRegistryTransfer = useCallback(
    (data: MessagesMap['registryTransfer']['payload']) => {
      return new Promise((resolve) => {
        if (data.transactions.length === 0) return resolve(null);
        renderModal(
          <RegistrySignModalContent
            {...data}
            onSign={() => {
              const result = [...data.transactions];
              for (const [index, transaction] of data.transactions.entries()) {
                const parsed = safeJsonParse<any>(transaction.cmd);

                const sigs = [...transaction.sigs];
                for (const [index, signer] of parsed.signers.entries()) {
                  const { sig } = wallet.sign(transaction.cmd, signer.pubKey);
                  sigs[index] = { sig: sig! };
                }

                result[index] = { ...transaction, sigs };
                console.log('signed', transaction);
              }
              resolve(result);
              clearModal();
            }}
          />,
          'sign modal',
        );
      });
    },
    [clearModal, renderModal, wallet],
  );

  const onGetPublicKeys = useCallback(() => {
    return wallet.publicKeys;
  }, [wallet.publicKeys]);

  useEffect(() => {
    console.log('registrer server handlers');
    server.setHandler('sign', onSign);
    server.setHandler('getPublicKeys', onGetPublicKeys);
    server.setHandler('registryTransfer', onRegistryTransfer);
  }, [onGetPublicKeys, onRegistryTransfer, onSign, server]);

  return (
    <remoteServerContext.Provider value={{ server }}>
      {children}
    </remoteServerContext.Provider>
  );
};
