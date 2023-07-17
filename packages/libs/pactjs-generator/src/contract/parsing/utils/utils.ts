export const trim = (str: string, term: string): string => {
  let value = str;
  if (value.startsWith(term)) {
    value = value.substring(term.length);
  }
  if (value.endsWith(term)) {
    value = value.substring(0, value.length - term.length);
  }
  return value;
};

type Primitive = string | boolean | undefined | number;
export const pushUnique = (arr: Primitive[], item: Primitive): void => {
  if (!arr.includes(item)) {
    arr.push(item);
  }
};

export interface IModuleLike {
  name: string;
  namespace?: string;
}

export const getModuleFullName = ({
  name,
  namespace = '',
}: IModuleLike): string => (namespace !== '' ? `${namespace}.${name}` : name);
