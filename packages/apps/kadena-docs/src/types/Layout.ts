import { ReactNode } from 'react';

export type TagNameType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type LayoutType = 'full' | 'code' | 'landing';

export interface ISubHeaderElement {
  tag: TagNameType;
  title?: string;
  slug?: string;
  children: ISubHeaderElement[];
}

export interface IPageMeta {
  title: string; // title of the HEAD info
  menu?: string; // name in the main menu
  order?: number;
  label: string; // name of the pagdescription: string;
  layout: LayoutType;
  description: string;
}
export interface IMenuItem extends IPageMeta {
  root: string;
  isActive: boolean; // checks that the actual item is active in the menu
  isMenuOpen: boolean; // makes sure that the parent slide menu is open
  children: IMenuItem[];
}

export interface ILayout {
  children?: ReactNode;
}

export type LevelType = 1 | 2 | 3;
