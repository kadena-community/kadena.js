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

import { ImportWallet } from '@/pages/import-wallet/import-wallet';
import { CreateNetwork } from '@/pages/networks/create-network';
import { Networks } from '@/pages/networks/networks';
import { useWallet } from '../modules/wallet/wallet.hook';
import { BackupRecoveryPhrase } from '../pages/backup-recovery-phrase/backup-recovery-phrase';
import { WriteDownRecoveryPhrase } from '../pages/backup-recovery-phrase/write-down/write-down-recovery-phrase';
import { CreateWallet } from '../pages/create-wallet/create-wallet';
import { HomePage } from '../pages/home/home-page';
import { SelectProfile } from '../pages/select-profile/select-profile';
import { UnlockWallet } from '../pages/unlock-wallet/unlock-wallet';
import { getScriptType } from '../utils/window';
import { Layout } from './layout';

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
    <Route element={<Layout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/select-profile" element={<SelectProfile />} />
      <Route path="/networks" element={<Networks />} />
      <Route path="/networks/create" element={<CreateNetwork />} />
      <Route path="/create-wallet" element={<CreateWallet />} />
      <Route path="/import-wallet" element={<ImportWallet />} />
      <Route path="/unlock-wallet/:profileId" element={<UnlockWallet />} />
      <Route element={<ProtectedRoute isAllowed={isUnlocked} />}>
        <Route
          path="/backup-recovery-phrase"
          element={<BackupRecoveryPhrase />}
        />
        <Route
          path="/backup-recovery-phrase/write-down"
          element={<WriteDownRecoveryPhrase />}
        />
        <Route path="/accounts/:account" element={<p>Account</p>} />,
      </Route>
      <Route path="*" element={<p>Permission Denied!</p>} />
    </Route>,
  );

  const handler =
    getScriptType() === 'POPUP' ? createMemoryRouter : createBrowserRouter;

  return <RouterProvider router={handler(routes)} />;
};
