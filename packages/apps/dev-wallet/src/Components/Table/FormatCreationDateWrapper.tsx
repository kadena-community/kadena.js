import { IPactCommand } from '@kadena/client';
import { ICompactTableFormatterProps } from '@kadena/kode-ui/patterns';
import type { FC } from 'react';

export const FormatCreationDateWrapper: () => FC<ICompactTableFormatterProps> =
  () =>
  ({ value }) => {
    const date = new Date(
      ((JSON.parse(value) as IPactCommand).meta.creationTime || 0) * 1000,
    ).toLocaleString();

    return date;
  };
