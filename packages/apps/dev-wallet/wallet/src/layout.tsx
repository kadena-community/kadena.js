import {
  createBrowserRouter,
  createMemoryRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Link,
  Outlet,
  Navigate,
} from "react-router-dom";
import Providers from "./providers.js";
import HomePage from "./pages/page.js";
import SignInPage from "./pages/signin/signin.js";
import TransferPage from "./pages/transfer/page.js";
import KeysPage from "./pages/keys/page.js";
import PactPage from "./pages/pact/page.js";
import { getScriptType } from "./utils/window.js";
import AccountsList from "./pages/accounts-list/AccountsList.js";
import { useCrypto } from "./hooks/crypto.context.js";
import { IconButton, Stack } from "@kadena/react-ui";
import { FC, PropsWithChildren } from "react";
import CreateAccount from "./pages/create-account/CreateAccount.js";
import Account from "./pages/account/Account.js";
import RegisterName from "./pages/register-name/RegisterName.js";
import TransferWithName from "./pages/transfer-with-name/TransferWithName.js";

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
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack gap="$sm" padding="$sm">
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
> = ({ isAllowed, redirectPath = "/signin", children }) => {
  if (!isAllowed) {
    console.log("not allowed, redirecting to", redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  return <> {children ? children : <Outlet />}</>;
};

export const RootLayout: FC = () => {
  const wallet = useCrypto();
  const routes = createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route element={<ProtectedRoute isAllowed={wallet.loaded} />}>
        <Route path="/keys" element={<KeysPage />} />
        <Route path="/transfer" element={<TransferPage />} />
        <Route path="/pact" element={<PactPage />} />
        <Route path="/accounts" element={<AccountsList />} />,
        <Route path="/accounts/:account" element={<Account />} />,
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/register-name/:account" element={<RegisterName />} />,
        <Route
          path="/accounts/:account/transfer"
          element={<TransferWithName />}
        />
      </Route>
    </Route>
  );

  const handler =
    getScriptType() === "POPUP" ? createMemoryRouter : createBrowserRouter;

  return <RouterProvider router={handler(routes)} />;
};

export const App = () => (
  <Providers>
    <RootLayout />
  </Providers>
);
