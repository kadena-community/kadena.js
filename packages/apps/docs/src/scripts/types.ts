export interface IScriptResult {
  success: string[];
  errors: string[];
}
//config

export type IMenu = string[];

export interface IPage {
  id: string;
  url: string;
  file: string;
  children?: IPage[];
}

export interface IConfig {
  menu: IMenu;
  pages: IPage[];
}
