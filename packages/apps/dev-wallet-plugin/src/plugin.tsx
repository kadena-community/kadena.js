import '@kadena/kode-ui/global';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { INetwork } from './network';
import { PactConsole } from './pact-console';

export function createApp(
  domElement: HTMLElement,
  config: { networks: INetwork[] },
) {
  ReactDOM.createRoot(domElement).render(
    <React.StrictMode>
      <PactConsole networks={config.networks} />
    </React.StrictMode>,
  );
}
