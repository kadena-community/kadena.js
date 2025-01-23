import '@kadena/kode-ui/global';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { PactConsole } from './pact-console';

export function createApp(
  domElement: HTMLElement,
  { sessionId }: { sessionId: string },
  target: Window,
) {
  ReactDOM.createRoot(domElement).render(
    <React.StrictMode>
      <PactConsole sessionId={sessionId} target={target} />
    </React.StrictMode>,
  );
}
