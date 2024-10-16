import { Link } from '@/components/Routing/Link';
import type {
  ICompactTableFormatterLinkProps,
  ICompactTableFormatterProps,
} from '@kadena/kode-ui/patterns';
import { CompactTableFormatters } from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import React from 'react';

const formatURL = (url: string, value: string): string => {
  if (url.includes(':value')) {
    return url.replace(/:value/g, value);
  }
  return url;
};

export const FormatLinkWrapper = ({
  url,
}: ICompactTableFormatterLinkProps): FC<ICompactTableFormatterProps> => {
  const Component: FC<ICompactTableFormatterProps> = ({ value }) => (
    <Link href={formatURL(url, value)} passHref legacyBehavior>
      {CompactTableFormatters.FormatLink({ url })({ value })}
    </Link>
  );

  return Component;
};
