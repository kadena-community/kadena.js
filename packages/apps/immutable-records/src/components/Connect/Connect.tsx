'use client';

import { useWalletConnect } from '@/connect/connect.hook';
import { Button, Tooltip } from '@kadena/react-ui';

import { FC, useRef, useState } from 'react';
import {
  container,
  debugContainer,
  debugContainerButton,
  tooltipContainer,
} from './Connect.css';

// Fix Tooltip handler not being able to tell mouseenter from mouseleave
const useTooltipHandler = () => {
  const [isHovering, setIsHovering] = useState(false);
  const handler =
    (ref: React.RefObject<HTMLDivElement>) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // fix for Tooltip.handler not using `currentTarget`
      if ((e.target as any).tagName !== 'BUTTON') return;

      const shouldHover = e.type === 'mouseenter';
      if (shouldHover !== isHovering) {
        setIsHovering(!isHovering);
        try {
          Tooltip.handler(e, ref);
        } catch (e) {
          // ok
        }
      }
    };
  return handler;
};

export const Connect: FC = () => {
  const buttonRef = useRef(null);
  const tooltipHandler = useTooltipHandler();
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

  const state = hasSession
    ? likelyInvalidSession
      ? 'invalid'
      : 'connected'
    : 'disconnected';
  const icons = {
    connected: 'Link',
    disconnected: 'Link',
    invalid: 'AlertBox',
  } as const;
  const label = {
    connected: 'Disconnect wallet',
    disconnected: 'Connect wallet',
    invalid: 'Disconnect wallet',
  };

  return (
    <div className={container}>
      <div ref={buttonRef}>
        <Button
          onClick={onConnect}
          disabled={!initialized}
          icon={icons[state]}
          onMouseEnter={tooltipHandler(buttonRef)}
          onMouseLeave={tooltipHandler(buttonRef)}
        >
          {label[state]}
        </Button>
      </div>

      {likelyInvalidSession && (
        <div className={tooltipContainer}>
          <Tooltip.Root placement={'bottom'} ref={buttonRef}>
            Your session was interupted
            <br />
            from the wallet side,
            <br />
            please reconnect.
          </Tooltip.Root>
        </div>
      )}
    </div>
  );
};

export const ConnectDebug: FC = () => {
  const [showDebug, setShowDebug] = useState(false);
  const [showAccounts, setShowAccounts] = useState(false);
  const { sessionTopic, initialized, accounts, network } = useWalletConnect();
  const onShowDebug = () => setShowDebug(!showDebug);
  const onShowAccounts = () => setShowAccounts(!showAccounts);
  if (!showDebug) {
    return (
      <button className={debugContainerButton} onClick={onShowDebug}>
        show debug info
      </button>
    );
  }
  return (
    <div className={debugContainer}>
      <div>
        initialized: {initialized ? 'true' : 'false'}
        <button onClick={onShowDebug} style={{ float: 'right' }}>
          hide
        </button>
      </div>
      <div>sessionTopic: {sessionTopic ?? 'null'}</div>
      <div>network: {network ?? 'null'}</div>
      <div>
        accounts: {Object.keys(accounts).length}{' '}
        <button onClick={onShowAccounts}>
          {showAccounts ? 'hide' : 'show'} accounts
        </button>
      </div>
      {showAccounts && (
        <ul>
          {accounts.map((account) => {
            return <li key={account}>{account}</li>;
          })}
        </ul>
      )}
    </div>
  );
};
