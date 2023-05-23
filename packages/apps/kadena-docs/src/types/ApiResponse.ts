export interface IResponse<T> {
  status: number;
  message: string;
  body?: T;
}

export interface ITopDoc {
  label: string;
  url: string;
}
