import { FC, PropsWithChildren, useEffect } from 'react';
import {
  createBrowserRouter,
  createMemoryRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  useLocation,
} from 'react-router-dom';

import { CommunicationProvider } from '@/modules/communication/communication.provider';
import { AccountDiscovery } from '@/pages/account-discovery/account-dsicovery';
import { AccountPage } from '@/pages/account/account';
import { MigrateAccount } from '@/pages/account/migrate-account/migrate-account';
import { ActivitiesPage } from '@/pages/activities/activities';
import { ConnectPage } from '@/pages/connect/connect';
import { Contacts } from '@/pages/contacts/contacts';
import { CreateAccountPage } from '@/pages/create-account/create-account';
import { NotFound } from '@/pages/errors/404';
import { KeysPage } from '@/pages/keys/keys-page';
import { Keyset } from '@/pages/keyset/keyset';
import { Networks } from '@/pages/networks/networks';
import { Plugins } from '@/pages/plugins/plugins';
import { Ready } from '@/pages/ready/ready';
import { ChangePassword } from '@/pages/settings/change-password/change-password';
import { ExportData } from '@/pages/settings/export-data/export-data';
import { ImportData } from '@/pages/settings/import-data/import-data';
import { KeepPasswordPolicy } from '@/pages/settings/keep-password-policy/keep-password-policy';
import { RevealPhrase } from '@/pages/settings/reveal-phrase/reveal-phrase';
import { Settings } from '@/pages/settings/settings';
import { SignatureBuilder } from '@/pages/signature-builder/signature-builder';
import { SignRequestPage } from '@/pages/transaction/sign-request';
import { TransactionPage } from '@/pages/transaction/Transaction';
import { Transfer } from '@/pages/transfer/transfer';
import { RecoverFromMnemonic } from '@/pages/wallet-recovery/recover-from-mnemonic/recover-from-mnemonic';
import { WalletRecovery } from '@/pages/wallet-recovery/wallet-recovery';
import { useWallet } from '../modules/wallet/wallet.hook';
import { CreateProfile } from '../pages/create-profile/create-profile';
import { HomePage } from '../pages/home/home-page';
import { SelectProfile } from '../pages/select-profile/select-profile';
import { UnlockProfile } from '../pages/unlock-profile/unlock-profile';
import { getScriptType } from '../utils/window';
import { FocussedPageLayout } from './FocussedPageLayout/Layout';
import { Layout } from './Layout/Layout';
import { LandingPageLayout } from './LayoutLandingPage/Layout';
import { useGlobalState } from './providers/globalState';

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
      setOrigin(
        `${location.pathname}${location.hash ? location.hash : ''}${location.search ? location.search : ''}`,
      );
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
  const { isUnlocked, profile } = useWallet();
  const isLocked = !isUnlocked;
  const { origin, setOrigin } = useGlobalState();

  const routes = createRoutesFromElements(
    <Route element={<CommunicationProvider children={<Outlet />} />}>
      <Route element={<RouteContext />}>
        <Route
          element={
            <Redirect
              if={isLocked}
              to="/select-profile"
              setOrigin={setOrigin}
            />
          }
        >
          <Route element={<FocussedPageLayout />}>
            <Route path="/transfer" element={<Transfer />} />
            <Route
              path="/transaction/:transactionId"
              element={<TransactionPage />}
            />
            <Route
              path="/sign-request/:requestId"
              element={<SignRequestPage />}
            />
          </Route>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/sig-builder" element={<SignatureBuilder />} />
            <Route path="/networks" element={<Networks />} />

            <Route path="/key-management/:tab" element={<KeysPage />} />
            <Route path="/create-account" element={<CreateAccountPage />} />

            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/keyset/:keysetId" element={<Keyset />} />
            <Route
              path="/account/:accountId/migrate"
              element={<MigrateAccount />}
            />
            <Route path="/account/:accountId" element={<AccountPage />} />

            <Route path="/contacts" element={<Contacts />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/export-data" element={<ExportData />} />
            <Route path="/settings/import-data" element={<ImportData />} />
            <Route
              path="/settings/keep-password-policy"
              element={<KeepPasswordPolicy />}
            />
            <Route
              element={
                <Redirect
                  if={!profile || !profile.showExperimentalFeatures}
                  to="/"
                />
              }
            >
              <Route path="/plugins" element={<Plugins />} />
            </Route>
          </Route>
        </Route>
        <Route element={<LandingPageLayout />}>
          <Route element={<Redirect if={isUnlocked} to={origin} />}>
            <Route path="/select-profile" element={<SelectProfile />} />
            <Route path="/create-profile/*" element={<CreateProfile />} />
            <Route
              path="/wallet-recovery/recover-from-mnemonic"
              element={<RecoverFromMnemonic />}
            />
            <Route path="/wallet-recovery" element={<WalletRecovery />} />
          </Route>
          <Route path="/account-discovery" element={<AccountDiscovery />} />
          <Route
            path="/unlock-profile/:profileId"
            element={<UnlockProfile origin={origin} />}
          />
          <Route
            element={
              <Redirect
                if={isLocked}
                to="/select-profile"
                setOrigin={setOrigin}
              />
            }
          >
            <Route path="/connect/:requestId" element={<ConnectPage />} />
            <Route
              path="/settings/change-password"
              element={<ChangePassword />}
            />
            <Route path="/settings/reveal-phrase" element={<RevealPhrase />} />
          </Route>
          <Route path="/ready" element={<Ready />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Route>,
  );

  const handler =
    getScriptType() === 'POPUP' ? createMemoryRouter : createBrowserRouter;

  return <RouterProvider router={handler(routes)}></RouterProvider>;
};
