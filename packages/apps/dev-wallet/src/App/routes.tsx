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

import { AccountDiscovery } from '@/pages/account-discovery/account-dsicovery';
import { ImportWallet } from '@/pages/import-wallet/import-wallet';
import { CreateNetwork } from '@/pages/networks/create-network';
import { Networks } from '@/pages/networks/networks';
import { SignatureBuilder } from '@/pages/signature-builder/signature-builder';
import { useWallet } from '../modules/wallet/wallet.hook';
import { BackupRecoveryPhrase } from '../pages/backup-recovery-phrase/backup-recovery-phrase';
import { WriteDownRecoveryPhrase } from '../pages/backup-recovery-phrase/write-down/write-down-recovery-phrase';
import { CreateProfile } from '../pages/create-profile/create-profile';
import { HomePage } from '../pages/home/home-page';
import { SelectProfile } from '../pages/select-profile/select-profile';
import { UnlockProfile } from '../pages/unlock-profile/unlock-profile';
import { getScriptType } from '../utils/window';
import { Layout } from './layout';
import { LayoutMini } from './layout-mini';

const ProtectedRoute: FC<
  PropsWithChildren<{
    isAllowed: boolean;
    redirectPath?: string;
  }>
> = ({ isAllowed, redirectPath = '/select-profile', children }) => {
  if (!isAllowed) {
    console.log('not allowed, redirecting to', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  return <> {children ? children : <Outlet />}</>;
};

export const Routes: FC = () => {
  const { isUnlocked } = useWallet();
  const routes = createRoutesFromElements(
    <>
      <Route element={<LayoutMini />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/select-profile" element={<SelectProfile />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/unlock-profile/:profileId" element={<UnlockProfile />} />
        <Route path="/import-wallet" element={<ImportWallet />} />
        <Route element={<ProtectedRoute isAllowed={isUnlocked} />}>
          <Route
            path="/backup-recovery-phrase/:keySourceId"
            element={<BackupRecoveryPhrase />}
          />
          <Route
            path="/backup-recovery-phrase/:keySourceId/write-down"
            element={<WriteDownRecoveryPhrase />}
          />
          <Route
            path="/account-discovery/:keySourceId"
            element={<AccountDiscovery />}
          />
        </Route>
        <Route path="*" element={<p>Not found!</p>} />
      </Route>
      <Route element={<Layout />}>
        <Route path="/accounts/:account" element={<p>Account</p>} />,
        <Route path="/sig-builder" element={<SignatureBuilder />} />,
        <Route path="/networks" element={<Networks />} />
        <Route path="/networks/create" element={<CreateNetwork />} />
      </Route>,
    </>
  );

  const handler =
    getScriptType() === 'POPUP' ? createMemoryRouter : createBrowserRouter;

  return <RouterProvider router={handler(routes)} />;
};
