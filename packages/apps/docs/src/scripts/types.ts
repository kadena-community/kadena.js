export type IError = string;
export type ISuccess = string;

export interface IBuildReturn {
  errors: IError[];
  success: ISuccess[];
}

//config

export type IMenu = string[];

export interface IPage {
  id: string;
  title: string;
  url: string;
  file: string;
  children?: IPage[];
}

export interface IConfig {
  menu: IMenu;
  pages: IPage[];
}
