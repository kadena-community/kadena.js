import { MarketplaceHeader } from '@/components/MarketplaceHeader';
import * as globalStyles from '@/styles/global.css';
import * as styles from '@/styles/layout.css';
import { Notification, NotificationHeading } from '@kadena/kode-ui';
import React from 'react';
import { isMobile } from 'react-device-detect';

interface LayoutProps {
  children: React.ReactNode; // Using React.ReactNode to type the children prop
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={globalStyles.mainWrapperClass}>
      {isMobile ? (
        <div
          style={{
            position: 'absolute',
            top: '65px',
            backgroundColor: '#ffffff',
          }}
        >
          <Notification role="none">
            <NotificationHeading>Limited Mobile Support</NotificationHeading>
            For an optimal experience, please visit this site using a desktop
            browser. Mobile support is limited.
          </Notification>
        </div>
      ) : (
        <></>
      )}
      <div className={styles.stickyHeader}>
        <MarketplaceHeader />
      </div>
      <div className={styles.mainContainer}>{children}</div>
    </div>
  );
};

export default Layout;
