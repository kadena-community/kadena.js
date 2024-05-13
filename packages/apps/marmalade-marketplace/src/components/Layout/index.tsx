import React from 'react';
import { MarketplaceHeader } from '@/components/MarketplaceHeader';
import * as styles from "@/styles/layout.css"

interface LayoutProps {
  children: React.ReactNode; // Using React.ReactNode to type the children prop
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
      <div>
          <div className={styles.stickyHeader}>
            <MarketplaceHeader />
          </div>
          <main>{children}</main>
      </div>
  );
};

export default Layout;