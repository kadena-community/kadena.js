import { FC, PropsWithChildren, useEffect, useState } from 'react';
import {
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createMemoryRouter,
  createRoutesFromElements,
  useLocation,
} from 'react-router-dom';

import { CommunicationProvider } from '@/modules/communication/communication.provider';
import { AccountDiscovery } from '@/pages/account-discovery/account-dsicovery';
import { AccountPage } from '@/pages/account/account';
import { Connect } from '@/pages/connect/connect';
import { Contacts } from '@/pages/contacts/contacts';
import { CreateAccount } from '@/pages/create-account/create-account';
import { FungiblePage } from '@/pages/fungible/fungible';
import { ImportChainweaverExport } from '@/pages/import-chainweaver-export/import-chainweaver-export';
import { ImportWallet } from '@/pages/import-wallet/import-wallet';
import { KeysPage } from '@/pages/keys/keys-page';
import { Keyset } from '@/pages/keyset/keyset';
import { Networks } from '@/pages/networks/networks';
import { Ready } from '@/pages/ready/ready';
import { SignatureBuilder } from '@/pages/signature-builder/signature-builder';
import { TransactionPage } from '@/pages/transaction/Transaction';
import { Transactions } from '@/pages/transactions/transactions';
import { TransferV2 } from '@/pages/transfer-v2/transfer-v2';
import { Heading } from '@kadena/kode-ui';
import { useWallet } from '../modules/wallet/wallet.hook';
import { BackupRecoveryPhrase } from '../pages/backup-recovery-phrase/backup-recovery-phrase';
import { WriteDownRecoveryPhrase } from '../pages/backup-recovery-phrase/write-down/write-down-recovery-phrase';
import { CreateProfile } from '../pages/create-profile/create-profile';
import { HomePage } from '../pages/home/home-page';
import { SelectProfile } from '../pages/select-profile/select-profile';
import { UnlockProfile } from '../pages/unlock-profile/unlock-profile';
import { getScriptType } from '../utils/window';
import { Layout } from './Layout/Layout';
import { LayoutMini } from './layout-mini';

const Redirect: FC<
  PropsWithChildren<{
    if: boolean;
    to: string;
    setOrigin?: (pathname: string) => void;
  }>
> = ({ if: condition, to, children, setOrigin }) => {
  const location = useLocation();

  if (condition) {
    if (setOrigin) {
      setOrigin(location.pathname);
    }
    return <Navigate to={to} replace />;
  }

  return <> {children ? children : <Outlet />}</>;
};
const RouteContext: FC = () => {
  const { isUnlocked, syncAllAccounts } = useWallet();
  const location = useLocation();

  // listen to general route changes and sync all accounts
  useEffect(() => {
    if (isUnlocked && syncAllAccounts) {
      syncAllAccounts();
    }
  }, [location.pathname, isUnlocked, syncAllAccounts]);

  return <Outlet />;
};

export const Routes: FC = () => {
  const { isUnlocked } = useWallet();
  const isLocked = !isUnlocked;
  const [origin, setOrigin] = useState('/');

  const routes = createRoutesFromElements(
    <Route
      element={
        <CommunicationProvider children={<Outlet />} setOrigin={setOrigin} />
      }
    >
      <Route element={<RouteContext />}>
        <Route element={<LayoutMini />}>
          <Route element={<Redirect if={!isLocked} to={origin} />}>
            <Route path="/select-profile" element={<SelectProfile />} />
            <Route path="/create-profile/*" element={<CreateProfile />} />
            <Route
              path="/import-wallet"
              element={<ImportWallet setOrigin={setOrigin} />}
            />
            <Route
              path="/import-chainweaver"
              element={<ImportChainweaverExport />}
            />
          </Route>
        </Route>
        <Route
          element={
            <Redirect
              if={isLocked}
              to="/select-profile"
              setOrigin={setOrigin}
            />
          }
        >
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/sig-builder" element={<SignatureBuilder />} />
            <Route path="/networks" element={<Networks />} />
            <Route path="/connect/:requestId" element={<Connect />} />
            <Route path="/key-management/:tab" element={<KeysPage />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/transaction/:groupId" element={<TransactionPage />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/keyset/:keysetId" element={<Keyset />} />
            <Route path="/fungible/:contract" element={<FungiblePage />} />
            <Route path="/account/:accountId" element={<AccountPage />} />
            <Route path="/transfer" element={<TransferV2 />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route
              path="/backup-recovery-phrase"
              element={<BackupRecoveryPhrase />}
            />
            <Route
              path="/backup-recovery-phrase/write-down"
              element={<WriteDownRecoveryPhrase />}
            />
            <Route
              path="/account-discovery/:keySourceId"
              element={<AccountDiscovery />}
            />
          </Route>
        </Route>
        <Route element={<LayoutMini />}>
          <Route
            path="/unlock-profile/:profileId"
            element={<UnlockProfile origin={origin} />}
          />
          <Route path="/ready" element={<Ready />} />
          <Route path="*" element={<Heading>Not found!</Heading>} />
        </Route>
      </Route>
    </Route>,
  );

  const handler =
    getScriptType() === 'POPUP' ? createMemoryRouter : createBrowserRouter;

  return <RouterProvider router={handler(routes)}></RouterProvider>;
};
