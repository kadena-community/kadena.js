import type { ITreeProps } from '@kadena/kode-ui';
import type { ReactElement } from 'react';

export interface IMenuItem {
  title: string;
  href: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
}

export interface ISidebarSubMenuItem {
  title: string;
  href: string;
  items?: ITreeProps[];
}
export interface ISidebarToolbarItem {
  title: string;
  href?: string;
  active?: boolean;
  icon: ReactElement;
  items?: ISidebarSubMenuItem[];
}
