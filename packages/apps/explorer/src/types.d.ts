interface IMenuConfigItem {
  label: string;
  children: { url: string; label: string }[];
}

type IMenuConfig = IMenuConfigItem[];

interface IDataRenderComponentField {
  type?: 'text' | 'code';
  key: string;
  id?: string;
  canCopy?: boolean;
  value: string | string[] | JSX.Element | JSX.Element[];
  link?: string;
}
