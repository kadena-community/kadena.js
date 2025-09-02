export interface ITextNode {
  type: 'text' | 'number';
  value: string | number;
  propName: string;
  label: string;
  id: string;
  shouldLocalizeFormat?: boolean;
  order: string;
}

export interface IBoolean {
  type: 'boolean';
  value: boolean;
  propName: string;
  label: string;
  id: string;
  shouldLocalizeFormat?: boolean;
  order: string;
}
export interface IImageNode {
  type: 'image';
  value: string;
  propName: string;
  label: string;
  id: string;
  order: string;
}

export interface IListNode {
  type: 'list';
  value: (string | ITextNode | IImageNode)[];
  propName: string;
  label: string;
  id: string;
  order: string;
}

export interface IKeyValueNode {
  type: 'key-value';
  value: (ITextNode | IImageNode)[];
  propName: string;
  label: string;
  id: string;
  order: string;
}

export type INode =
  | ITextNode
  | IImageNode
  | IListNode
  | IKeyValueNode
  | IBoolean
  | string;
