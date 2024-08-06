import React, { useState, FC } from 'react';
import { Button, Badge } from '@kadena/kode-ui';
import SpireKeyKdacolorLogoWhite from '@/components/SpireKeyKdacolorLogoWhite';
import useClickOutside from '@/hooks/useClickOutside';
import * as styles from './style.css';

interface ConnectWalletProps {
  showContextMenu: boolean;  
  account?: string
  accountAlias?: string
  menuItems?: ContextMenuItems[]
}

interface ContextMenuItems {
  title: string;
  onClick: () => void;
  key: string;
  startVisual?: React.ReactNode;  
}

const ConnectWallet: FC<ConnectWalletProps>  = ({ showContextMenu = false, account, accountAlias, menuItems  }) => {
  const ref: React.RefObject<HTMLDivElement> = React.createRef();
  const [isMenuOpen, setIsMenuOpen] = useState(false);  

  useClickOutside<HTMLDivElement>(ref, () => { setIsMenuOpen(false) });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const renderMenuItem = (item: ContextMenuItems) => {
    return (
      <div className={styles.contextMenuItem} onClick={() => {
        toggleMenu();
        item.onClick();
      }}>
        {item.startVisual && <span>{item.startVisual}</span>}
        {item.title}
      </div>
    );
  }  

  return (
    <div className={styles.connectWalletContainer}>
      <Button
        className={styles.walletButton}
        variant="primary"
        isCompact={false}
        startVisual={<SpireKeyKdacolorLogoWhite style={{color: 'black'}}/>}
        endVisual={<Badge style="inverse" size="sm">{account?.slice(0,5) + "..." + account?.slice(-3)}</Badge>}
      >
        {accountAlias}
      </Button>
        {showContextMenu && <Button className={styles.selectButton} onPress={toggleMenu}>
        •••        
      </Button>}
      {isMenuOpen && 
      <div className={styles.contextMenu} ref={ref}>
        {menuItems?.map(renderMenuItem)}        
      </div>}
    </div>
  );
}

export default ConnectWallet;