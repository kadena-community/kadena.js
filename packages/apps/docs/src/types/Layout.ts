import type { ITopDoc } from '@/data/getTopDocs';
import type { ReactNode } from 'react';

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
  previous?: INavigationMenuItem;
  next?: INavigationMenuItem;
}

interface INavigationMenuItem {
  title: string;
  root: string;
}

export interface IBasePageMeta {
  title: string;
  menu: string; // name in the main menu
  order: number;
  label: string; // name of the pagdescription: string;
  layout: LayoutType;
  description: string;
  subTitle?: string;
  lastModifiedDate?: Date;
}

export interface IAuthorInfo {
  id: string;
  name: string;
  avatar: string;
  description?: string;
  twitter?: string;
  linkedin?: string;
  posts?: IMenuData[];
}
export interface IPageMeta extends IBasePageMeta {
  editLink: string;
  navigation: INavigation;
  publishDate?: string;
  headerImage?: string;
  tags?: string[];
  author?: string;
  authorId?: string;
  authorInfo?: IAuthorInfo;
  readingTimeInMinutes?: number;
  wordCount?: number;
}

export interface IMenuItem {
  root: string;
  title: string;
  menu: string;
  label: string;
  isActive: boolean; // checks that the actual item is active in the menu
  isMenuOpen: boolean; // makes sure that the parent slide menu is open
  children: IMenuItem[];
  isIndex: boolean;
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

export interface IPageProps {
  children?: ReactNode;
  menuItems: IMenuItem[];
  aSideMenuTree: ISubHeaderElement[];
  frontmatter: IPageMeta;
  leftMenuTree: IMenuItem[];
  topDocs: ITopDoc[];
}

export interface IBasePageProps extends Omit<IPageProps, 'frontmatter'> {
  frontmatter: IBasePageMeta;
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
  headerImage?: string;
  tags?: string[];
  author?: string;
  authorId?: string;
  authorInfo?: IAuthorInfo;
  wordCount?: number;
  readingTimeInMinutes?: number;
}

export interface ITag {
  tag: string;
  count: number;
  links: IMenuData[];
}
