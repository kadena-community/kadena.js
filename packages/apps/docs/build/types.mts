export type ErrorsReturn = string[];
export type SucccessReturn = string[];

export interface BuildReturn {
  errors: ErrorsReturn;
  success: SucccessReturn;
}

export interface ImportReadMe {
  file: string;
  destination: string;
  title: string;
  options: {
    RootOrder: number;
    tags: string[];
    hideEditLink?: boolean;
  };
}
