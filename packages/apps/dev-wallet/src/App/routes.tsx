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

import { CommunicationProvider } from '@/modules/communication/communication.provider';
import { AccountDiscovery } from '@/pages/account-discovery/account-dsicovery';
import { Connect } from '@/pages/connect/connect';
import { ImportWallet } from '@/pages/import-wallet/import-wallet';
import { CreateNetwork } from '@/pages/networks/create-network';
import { Networks } from '@/pages/networks/networks';
import { Ready } from '@/pages/ready/ready';
import { SignatureBuilder } from '@/pages/signature-builder/signature-builder';
import { Heading } from '@kadena/react-ui';
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

const Redirect: FC<
  PropsWithChildren<{
    if: boolean;
    to: string;
  }>
> = ({ if: condition, to: redirectPath, children }) => {
  if (!condition) {
    return <Navigate to={redirectPath} replace />;
  }

  return <> {children ? children : <Outlet />}</>;
};

export const Routes: FC = () => {
  const { isUnlocked } = useWallet();
  const isLocked = !isUnlocked;

  const routes = createRoutesFromElements(
    <Route element={<CommunicationProvider children={<Outlet />} />}>
      <Route element={<LayoutMini />}>
        <Route element={<Redirect if={!isLocked} to="/" />}>
          <Route path="/select-profile" element={<SelectProfile />} />
          <Route path="/create-profile/*" element={<CreateProfile />} />
          <Route
            path="/unlock-profile/:profileId"
            element={<UnlockProfile />}
          />
          <Route path="/import-wallet" element={<ImportWallet />} />
        </Route>
      </Route>
      <Route element={<Redirect if={isLocked} to="/select-profile" />}>
        <Route element={<LayoutMini />}>
          <Route path="/" element={<HomePage />} />
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
        <Route element={<Layout />}>
          <Route path="/accounts/:account" element={<p>Account</p>} />
          <Route path="/sig-builder" element={<SignatureBuilder />} />
          <Route path="/networks" element={<Networks />} />
          <Route path="/networks/create" element={<CreateNetwork />} />
          <Route path="/connect/:requestId" element={<Connect />} />
        </Route>
      </Route>
      <Route path="/ready" element={<Ready />} />
      <Route path="*" element={<Heading>Not found!</Heading>} />
    </Route>,
  );

  const handler =
    getScriptType() === 'POPUP' ? createMemoryRouter : createBrowserRouter;

  return <RouterProvider router={handler(routes)}></RouterProvider>;
};
