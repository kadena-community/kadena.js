import { Stack } from '@kadena/kode-ui';
import { FC, PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';
import { FocussedPageLayout } from '../FocussedPageLayout/Layout';
import { focussedLayoutChildrenWrapperClass } from './../layout.css';
import { CardLayoutProvider } from './components/CardLayoutProvider';
import { InnerContent } from './components/InnerContent';

export const LandingPageLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <FocussedPageLayout>
      <CardLayoutProvider>
        <Stack className={focussedLayoutChildrenWrapperClass}>
          <InnerContent>{children ? children : <Outlet />}</InnerContent>
        </Stack>
      </CardLayoutProvider>
    </FocussedPageLayout>
  );
};
