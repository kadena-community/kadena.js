import {
  MonoKey,
  MonoLightMode,
  MonoWifiTethering,
  MonoWorkspaces,
} from '@kadena/kode-icons/system';

import { NetworkSelector } from '@/Components/NetworkSelector/NetworkSelector';
import { SideBarFooter, SideBarFooterItem } from '@kadena/kode-ui/patterns';
import { Link } from 'react-router-dom';

export function FooterNavigation({ toggleTheme }: { toggleTheme: () => void }) {
  return (
    <SideBarFooter>
      <SideBarFooterItem
        href="/"
        component={Link}
        visual={<MonoWifiTethering />}
        label="Profile"
      />

      <SideBarFooterItem
        href="/key-management/keys"
        component={Link}
        visual={<MonoKey />}
        label="Keys"
      />

      <SideBarFooterItem visual={<MonoWorkspaces />} label="Select network">
        <NetworkSelector variant="transparent" showLabel={false} />
      </SideBarFooterItem>
      <SideBarFooterItem
        visual={<MonoLightMode />}
        label="Change theme"
        onPress={toggleTheme}
      />
    </SideBarFooter>
  );
}
