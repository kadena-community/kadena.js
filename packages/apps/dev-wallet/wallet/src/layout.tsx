import { IconButton, Stack } from '@kadena/react-ui';
import { FC, PropsWithChildren } from 'react';
import {
  Link,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createMemoryRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { useCrypto } from './hooks/crypto.context';
import { rootLayout } from './layout.css';
import HomePage from './pages/home/HomePage';
import Providers from './providers';
import { getScriptType } from './utils/window';

const Layout: FC = () => {
  const wallet = useCrypto();

  const links = (
    <>
      <Link to="/">Home</Link>
      {!wallet.loaded && <Link to="/signin">Sign-In</Link>}
      {wallet.loaded && (
        <>
          <Link to="/keys">Keys</Link>
          {/* <Link to="/transfer">Transfer</Link> */}
          <Link to="/pact">Pact</Link>
          <Link to="/accounts">Accounts</Link>
        </>
      )}
    </>
  );

  return (
    <>
      <Stack
        as="nav"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack gap="sm" padding="sm">
          {links}
        </Stack>
        {wallet.loaded && (
          <IconButton
            icon="ExitToApp"
            title="Sign out"
            onClick={() => wallet.reset()}
          />
        )}
      </Stack>
      <hr />
      <Outlet />
      <div id="modalportal"></div>
    </>
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
  const wallet = useCrypto();
  const routes = createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<p>SignIn</p>} />
      <Route element={<ProtectedRoute isAllowed={wallet.loaded} />}>
        <Route path="/accounts/:account" element={<p>Account</p>} />,
      </Route>
    </Route>,
  );

  const handler =
    getScriptType() === 'POPUP' ? createMemoryRouter : createBrowserRouter;

  return (
    <div className={rootLayout}>
      <RouterProvider router={handler(routes)} />;
    </div>
  );
};

export const App = () => (
  <Providers>
    <RootLayout />
  </Providers>
);
