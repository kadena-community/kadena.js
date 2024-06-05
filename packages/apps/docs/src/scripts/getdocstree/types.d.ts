interface IConvertFileResult {
  lastModifiedDate: string | undefined;
  title: string;
  description: string;
  menu: string;
  label: string;
  order: number;
  layout: LayoutType;
  tags: string[];
  wordCount: number;
  readingTimeInMinutes: number;
  isMenuOpen: boolean;
  isActive: boolean;
  isIndex: boolean;
}

interface IParent extends IConvertFileResult {
  children: IParent[];
  root: string;
  subtitle: string;
}
