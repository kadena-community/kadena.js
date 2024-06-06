import { MonoArrowOutward } from '@kadena/react-icons';
import { Stack, Text } from '@kadena/react-ui';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';
import {
  dataFieldClass,
  linkClass,
  linkIconClass,
  linkWrapperClass,
} from '../styles.css';

interface IProps {
  value: string;
}

export const FormatLink: FC<IProps> = ({ value }) => (
  <Stack alignItems="center" className={linkWrapperClass}>
    <Link href={`/transaction/${value}`} className={linkClass}>
      <Text variant="code" className={dataFieldClass}>
        {value}
      </Text>
    </Link>
    <Link href={`/transaction/${value}`} className={value}>
      <MonoArrowOutward className={linkIconClass} />
    </Link>
  </Stack>
);
