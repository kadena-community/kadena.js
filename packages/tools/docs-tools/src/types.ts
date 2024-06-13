import type {
  Code,
  Heading,
  Html,
  InlineCode,
  Root,
  RootContent,
  RootContentMap,
  Text,
  Yaml,
} from 'mdast';
import type { ReactNode } from 'react';

export interface ITopDoc {
  label: string;
  url: string;
}

export type TagNameType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface IStartArray {
  type: 'heading';
  tag: TagNameType;
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  children: IStartArray[];
  title?: string;
  slug: string;
}

export type LayoutType = 'full' | 'landing' | 'home' | 'redocly' | 'code';

export interface ISubHeaderElement {
  tag: TagNameType;
  title?: string;
  parentTitles?: string[];
  slug?: string;
  children: ISubHeaderElement[];
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

export interface IFrontMatterYaml extends IBasePageMeta {
  publishDate?: string;
}

export interface IPageMeta extends IBasePageMeta {
  editLink: string;
  navigation: INavigation;
  publishDate?: string;
  headerImage?: string;
  tags?: string[];
  readingTimeInMinutes?: number;
  wordCount?: number;
  canonicalURL: string;
}

export interface IMenuItem {
  root: string;
  title: string;
  menu: string;
  label: string;
  isActive: boolean; // checks that the actual item is active in the menu
  isMenuOpen: boolean; // makes sure that the parent slide menu is open
  children: IMenuItem[];
  isIndex?: boolean;
}

export interface ILayout {
  children?: ReactNode;
  isAsideOpen?: boolean;
  aSideMenuTree?: ISubHeaderElement[];
  editLink?: string;
  navigation?: INavigation;
  publishDate?: string;
}

export type LevelType = 0 | 1 | 2 | 3;

export interface IPageProps {
  headerMenuItems: IMenuItem[];
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
  description?: string;
  menu: string;
  label: string;
  order: number;
  layout: LayoutType;
  isMenuOpen: boolean;
  isActive: boolean;
  publishDate?: string;
  headerImage?: string;
  tags?: string[];
  wordCount?: number;
  readingTimeInMinutes?: number;
  lastModifiedDate?: Date;
}

export interface ITag {
  tag: string;
  count: number;
  links: IMenuData[];
}

interface IPropsData {
  frontmatter: IPageMeta;
}

interface ILeftMenuTreeData {
  leftMenuTree: IMenuItem[];
}

interface IAsideMenuData {
  aSideMenuTree: ISubHeaderElement[];
}

export interface IFile {
  data: Record<string, any>;
  messages: string[];
  history: string[];
  value: string;
}

export interface IPropsType {
  type: 'props';
  children: [];
  data: IPropsData | IAsideMenuData | ILeftMenuTreeData;
}

export type TypeWithValue = InlineCode | Text | Yaml | Html | Code;

export type ChildrenWithValues = TypeWithValue[];

export interface IElementType {
  type: 'element';
  value?: string;
  children: TypeWithValue[];
  data: {
    hName: string;
    hProperties: {
      [key: string]: any;
    };
  };
}

export interface IEsTree {
  type: 'Program';
  sourceType: 'module';
  body: Record<string, any>[];
}

export interface IMdxJSEsm {
  type: 'mdxjsEsm';
  data: {};
}

export interface IDocsRootContentMap extends RootContentMap {
  props: IPropsType;
  element: IElementType;
  mdxjsEsm: IMdxJSEsm;
}

export type DocsRootContent = IDocsRootContentMap[keyof IDocsRootContentMap];

export interface ITree extends Omit<Root, 'children'> {
  children: DocsRootContent[];
}

export interface IPropsTree extends Omit<Root, 'children'> {
  children: IPropsType[];
}

export interface IHeadingTree extends Omit<Root, 'children'> {
  children: Heading[];
}

export type Plugin = (
  tree: ITree,
  file: any,
) => Promise<ITree | void | IPropsTree>;

export { Root, RootContent };

//config

export type IConfigMenu = string[];

export interface IConfigTreeItem {
  id: string;
  url: string;
  file: string;
  repo?: string;
  children?: IConfigTreeItem[];
  destination?: string;
}
export interface IConfig {
  menu: IConfigMenu;
  pages: IConfigTreeItem[];
}

export interface IScriptResult {
  success: string[];
  errors: string[];
}
