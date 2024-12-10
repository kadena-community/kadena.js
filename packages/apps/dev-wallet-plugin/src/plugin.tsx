import '@kadena/kode-ui/global';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { PactConsole } from './pact-console';

export function createApp(
  domElement: HTMLElement,
  { sessionId }: { sessionId: string },
) {
  ReactDOM.createRoot(domElement).render(
    <React.StrictMode>
      <PactConsole sessionId={sessionId} />
    </React.StrictMode>,
  );
}
