import { ReactNode } from 'react';

export type TagNameType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type LayoutType = 'full' | 'code' | 'landing';

export interface ISubHeaderElement {
  tag: TagNameType;
  title?: string;
  slug?: string;
  children: ISubHeaderElement[];
}

export interface IMenuItem {
  root: string;
  title: string;
  menu?: string;
  header?: string;
  order?: number;
  label: string;
  isActive: boolean;
  isMenuOpen: boolean;
  description: string;
  layout: LayoutType;
  children: IMenuItem[];
}

export interface ILayout {
  children?: ReactNode;
}
