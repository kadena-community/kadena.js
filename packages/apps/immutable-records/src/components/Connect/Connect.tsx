'use client';

import { useWalletConnect } from '@/connect/connect.hook';
import { Button } from '@kadena/react-ui';

import { FC } from 'react';
import { container, invalidSession } from './Connect.css';

export const Connect: FC = () => {
  const {
    connect,
    disconnect,
    sessionTopic,
    initialized,
    likelyInvalidSession,
  } = useWalletConnect();
  const hasSession = !!sessionTopic;

  const onConnect = () => {
    if (hasSession) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <div className={container}>
      <div>initialized: {initialized ? 'true' : 'false'}</div>
      <div>sessionTopic: {sessionTopic ?? 'null'}</div>
      <div>likelyInvalidSession: {String(likelyInvalidSession)}</div>

      <Button onClick={onConnect} disabled={!initialized}>
        {hasSession ? 'disconnect' : 'connect'}
      </Button>

      {likelyInvalidSession === true && (
        <div className={invalidSession}>
          likely invalid session
          <Button onClick={() => disconnect()} disabled={!initialized}>
            disconnect
          </Button>
        </div>
      )}
    </div>
  );
};
