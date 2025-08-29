interface IProps {
  style?: React.CSSProperties;
}

export interface IStackNode {
  type: 'stack';
  direction: 'row' | 'column';
  id: string;
  label?: string;
  props?: IProps;
  propName: string;
  children: INode[];
}

export interface ITextNode {
  type: 'text' | 'number';
  value: string | number;
  propName: string;
  label: string;
  id: string;
  props?: IProps;
}

export interface IListNode {
  type: 'list';
  value: string[];
  propName: string;
  label: string;
  id: string;
  props?: IProps;
}

export interface IKeyValueNode {
  type: 'key-value';
  value: Record<string, string | number>;
  propName: string;
  label: string;
  id: string;
  props?: IProps;
}
export interface IKeyValueListNode {
  type: 'key-value-list';
  value: Record<string, string | number>[];
  propName: string;
  label: string;
  id: string;
  props?: IProps;
}

export type INode =
  | IStackNode
  | ITextNode
  | IListNode
  | IKeyValueNode
  | IKeyValueListNode;
