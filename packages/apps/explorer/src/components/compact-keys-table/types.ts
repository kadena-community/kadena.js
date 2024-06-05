export interface IKeyProps {
  chainId: string;
  key: string;
  predicate: string;
}

export interface ICompactKeyTableProps {
  keys: IKeyProps[];
}
