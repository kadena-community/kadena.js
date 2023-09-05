import type { IAccordionProps, ITreeProps, SystemIcon } from '@kadena/react-ui';

export interface IMenuItem {
  title: string;
  href: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
}

export interface ISidebarSubMenuItem
  extends Omit<IAccordionProps, 'isOpen' | 'onToggle' | 'children'> {
  items: ITreeProps[];
}
export interface ISidebarToolbarItem {
  title: string;
  href?: string;
  active?: boolean;
  icon: keyof typeof SystemIcon;
  items?: ISidebarSubMenuItem[];
}
