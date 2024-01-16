import { Stack, Text } from '@kadena/react-ui';
import { FC, PropsWithChildren } from 'react';
import {
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createMemoryRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import { rootLayout } from './App.css';
import HomePage from './pages/home/HomePage';
import Providers from './providers';
import { getScriptType } from './utils/window';

const Layout: FC = () => {
  return (
    <div className={rootLayout}>
      <Stack
        as="nav"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        padding={'sm'}
        backgroundColor="base.default"
      >
        <Stack gap="sm" padding="sm">
          <Text bold>DX-Wallet</Text>
        </Stack>
      </Stack>
      <Outlet />
      <div id="modalportal"></div>
    </div>
  );
};

const ProtectedRoute: FC<
  PropsWithChildren<{
    isAllowed: boolean;
    redirectPath?: string;
  }>
> = ({ isAllowed, redirectPath = '/signin', children }) => {
  if (!isAllowed) {
    console.log('not allowed, redirecting to', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  return <> {children ? children : <Outlet />}</>;
};

export const RootLayout: FC = () => {
  const logedIn = false;
  const routes = createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<p>SignIn</p>} />
      <Route element={<ProtectedRoute isAllowed={logedIn} />}>
        <Route path="/accounts/:account" element={<p>Account</p>} />,
      </Route>
    </Route>,
  );

  const handler =
    getScriptType() === 'POPUP' ? createMemoryRouter : createBrowserRouter;

  return <RouterProvider router={handler(routes)} />;
};

export const App = () => (
  <Providers>
    <RootLayout />
  </Providers>
);
