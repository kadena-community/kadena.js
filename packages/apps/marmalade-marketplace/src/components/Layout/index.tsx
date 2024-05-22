import React from 'react';
import { MarketplaceHeader } from '@/components/MarketplaceHeader';
import * as styles from "@/styles/layout.css"
import * as globalStyles from "@/styles/global.css"

interface LayoutProps {
  children: React.ReactNode; // Using React.ReactNode to type the children prop
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
      <div className={globalStyles.mainWrapperClass}>
          <div className={styles.stickyHeader}>
            <MarketplaceHeader />
          </div>
          <main className={styles.mainContainer}>{children}</main>
      </div>
  );
};

export default Layout;