'use client';

import { useWalletConnect } from '@/connect/connect.hook';

import { FC } from 'react';

export const Connect: FC = () => {
  const { connect, disconnect, sessionTopic, initialized, accounts } =
    useWalletConnect();
  const hasSession = !!sessionTopic;

  const onConnect = () => {
    if (hasSession) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <div>
      <div>initialized: {initialized ? 'true' : 'false'}</div>
      <div>sessionTopic: {sessionTopic ?? 'null'}</div>

      <button onClick={onConnect} disabled={!initialized}>
        {hasSession ? 'disconnect' : 'connect'}
      </button>
    </div>
  );
};
