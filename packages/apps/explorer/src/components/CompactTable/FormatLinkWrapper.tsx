import { Link } from '@/components/Routing/Link';
import type {
  ICompactTableFormatterLinkProps,
  ICompactTableFormatterProps,
} from '@kadena/kode-ui/patterns';
import { CompactTableFormatters } from '@kadena/kode-ui/patterns';
import React from 'react';

const formatURL = (url: string, value: string): string => {
  if (url.includes(':value')) {
    return url.replace(/:value/g, value);
  }
  return url;
};

export const valueToString = (value: string | string[]): string => {
  if (typeof value === 'object') {
    return value.reduce((acc, val) => {
      if (!val) return acc;
      return `${acc}${val} `;
    }, '');
  }

  return value;
};

export const FormatLinkWrapper = ({
  url,
  condition,
}: ICompactTableFormatterLinkProps & {
  condition?: (
    value: ICompactTableFormatterProps['value'],
  ) => JSX.Element | false;
}) => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    if (condition) {
      const conditionResult = condition(value);
      if (conditionResult) {
        return conditionResult;
      }
    }
    return (
      <Link href={formatURL(url, valueToString(value))} passHref legacyBehavior>
        {CompactTableFormatters.FormatLink({ url })({ value })}
      </Link>
    );
  };

  return Component;
};
