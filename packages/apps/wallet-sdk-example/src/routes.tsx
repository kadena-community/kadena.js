import { RouteObject } from 'react-router-dom';

import MarkdownPage from './pages/Home';
import { KadenaNames } from './pages/kadenaNames/KadenaNamesResolver';
import { Transfer } from './pages/Transfer';
import { Transfers } from './pages/Transfers';
import { Wallet } from './pages/Wallet';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <MarkdownPage />,
  },
  {
    path: '/wallet',
    element: <Wallet />,
  },
  {
    path: '/list',
    element: <Transfers />,
  },
  {
    path: '/transfer',
    element: <Transfer />,
  },
  {
    path: '/kadenanames',
    element: <KadenaNames />,
  },
];

export default routes;
