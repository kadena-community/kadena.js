import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App/app';
import './App/globals.css.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
