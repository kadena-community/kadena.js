import '@kadena/kode-ui/global';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { WalletConnect } from './component/WalletConnect';

/**
 *
 * The dapp version of the app
 */
export async function createApp(
  domElement: HTMLElement,
  { sessionId }: { sessionId: string },
  target: Window,
) {
  ReactDOM.createRoot(domElement).render(
    <React.StrictMode>
      <WalletConnect sessionId={sessionId} target={target} />
    </React.StrictMode>,
  );
}

/**
 * Fullscreen version of the dapp without the Wallets menu, topbar
 * TODO: figure out if we need this
 */

/**
 * Minimized version of the plugin to support background process
 * @TODO figure out the name
 */
export function createMinimizedDapp() {
  return <></>;
}
