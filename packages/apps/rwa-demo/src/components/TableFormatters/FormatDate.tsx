import type { ICompactTableFormatterProps } from '@kadena/kode-ui/patterns';

export interface IActionProps {}

export const FormatDate = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    const innerValue = value as string;

    if (!innerValue) return null;
    const date = new Date(innerValue);
    return date.toLocaleString();
  };
  return Component;
};
