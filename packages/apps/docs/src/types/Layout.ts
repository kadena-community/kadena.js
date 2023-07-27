import { ProductIcon } from '@kadena/react-ui';

import { ITopDoc } from '@/data/getTopDocs';
import { ReactNode } from 'react';

export type TagNameType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type LayoutType =
  | 'full'
  | 'landing'
  | 'home'
  | 'redocly'
  | 'blog'
  | 'code';

export interface ISubHeaderElement {
  tag: TagNameType;
  title?: string;
  slug?: string;
  children: ISubHeaderElement[];
  index?: number;
  parentTitle?: string;
}

export interface INavigation {
  previous?: IMenuItem;
  next?: IMenuItem;
}

export interface IRelatedPage {
  root: string;
  title: string;
}

export interface IPageMeta {
  title: string; // title of the HEAD info
  subTitle?: string;
  menu: string; // name in the main menu
  order?: number;
  label: string; // name of the pagdescription: string;
  layout: LayoutType;
  description: string;
  editLink: string;
  lastModifiedDate?: Date;
  icon?: ProductIconNames;
  navigation: INavigation;
  publishDate?: string;
  author?: string;
  readingTimeInMinutes?: number;
  wordCount?: number;
  related?: IRelatedPage[];
}
export interface IMenuItem extends IPageMeta {
  root: string;
  isActive: boolean; // checks that the actual item is active in the menu
  isMenuOpen: boolean; // makes sure that the parent slide menu is open
  children: IMenuItem[];
}

export interface ILayout {
  children?: ReactNode;
  isAsideOpen?: boolean;
  aSideMenuTree?: ISubHeaderElement[];
  editLink?: string;
  navigation?: INavigation;
  publishDate?: string;
  author?: string;
}

export type LevelType = 1 | 2 | 3;

export type ProductIconNames = keyof typeof ProductIcon;

export interface IPageProps {
  children?: ReactNode;
  menuItems: IMenuItem[];
  aSideMenuTree: ISubHeaderElement[];
  frontmatter: IPageMeta;
  leftMenuTree: IMenuItem[];
  topDocs: ITopDoc[];
}

export interface IMenuData {
  children: IMenuData[];
  root: string;
  title: string;
  description: string;
  menu: string;
  label: string;
  order: number;
  layout: LayoutType;
  isMenuOpen: boolean;
  isActive: boolean;
  publishDate?: string;
  author?: string;
  wordCount?: number;
  readingTimeInMinutes?: number;
}
