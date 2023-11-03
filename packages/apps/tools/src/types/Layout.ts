import type { ITreeProps, SystemIcon } from '@kadena/react-ui';

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
  icon: keyof typeof SystemIcon;
  items?: ISidebarSubMenuItem[];
}
