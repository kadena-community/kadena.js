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
  value: string | string[] | React.JSX.Element | React.JSX.Element[];
  link?: string;
}
