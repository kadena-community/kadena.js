import '@kadena/kode-ui/global';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { PactConsole } from './pact-console';

export function renderApp() {
  ReactDOM.createRoot(document.getElementById('plugin-root')!).render(
    <React.StrictMode>
      <PactConsole />
    </React.StrictMode>,
  );
}
