import {
  IAccordionSectionProps,
  ITreeProps,
  SystemIcon,
} from '@kadena/react-ui';

export interface IMenuItem {
  title: string;
  href: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
}

export interface ISidebarSubMenuItem
  extends Omit<IAccordionSectionProps, 'isOpen' | 'onToggle' | 'children'> {
  items: ITreeProps[];
}
export interface ISidebarToolbarItem {
  title: string;
  href?: string;
  active?: boolean;
  icon: (typeof SystemIcon)[keyof typeof SystemIcon];
  items?: ISidebarSubMenuItem[];
}
