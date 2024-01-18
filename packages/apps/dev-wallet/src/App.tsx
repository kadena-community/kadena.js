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

import { ThemeProvider } from 'next-themes';
import { rootLayout } from './App.css';
import HomePage from './pages/home/HomePage';
import { CreateWallet } from './pages/on-boarding/create-wallet';
import { WalletContextProvider, useWallet } from './service/wallet.context';
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

const Routes: FC = () => {
  const { isUnlocked } = useWallet();
  const routes = createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/create-wallet" element={<CreateWallet />} />
      <Route element={<ProtectedRoute isAllowed={isUnlocked} />}>
        <Route path="/accounts/:account" element={<p>Account</p>} />,
      </Route>
    </Route>,
  );

  const handler =
    getScriptType() === 'POPUP' ? createMemoryRouter : createBrowserRouter;

  return <RouterProvider router={handler(routes)} />;
};

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      enableSystem={true}
      defaultTheme="light"
      value={{
        light: 'light',
      }}
    >
      <WalletContextProvider>{children}</WalletContextProvider>
    </ThemeProvider>
  );
}

export const App = () => (
  <Providers>
    <Routes />
  </Providers>
);
