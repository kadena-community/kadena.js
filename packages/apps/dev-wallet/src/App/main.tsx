import { Version } from '@kadena/kode-ui';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app.tsx';
import './globals.css.ts';

export function renderApp() {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Version
        sha={process.env.VERCEL_GIT_COMMIT_SHA}
        SSRTime={import.meta.env.VITE_BUILD_TIME}
        repo="https://github.com/kadena-community/kadena.js/tree/main/packages/apps/dev-wallet"
      />
      <App />
    </React.StrictMode>,
  );
}
