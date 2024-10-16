import { MonoArrowOutward } from '@kadena/kode-icons/system';
import type { FC } from 'react';
import React from 'react';
import {
  dataFieldClass,
  linkClass,
  linkIconClass,
  linkWrapperClass,
} from '../styles.css';
import { Stack, Text } from './../../../components';

export interface IProps {
  value: string;
}

export interface IOptions {
  url: string;
  Wrapper?: React.ReactElement;
}

export const FormatLink = ({ url }: IOptions): FC<IProps> => {
  const Component: FC<IProps> = ({ value }) => (
    <a href={url} className={linkClass}>
      <Stack alignItems="center" className={linkWrapperClass}>
        <Text variant="code" className={dataFieldClass}>
          {value}
        </Text>

        <MonoArrowOutward className={linkIconClass} />
      </Stack>
    </a>
  );

  return Component;
};

export const FormatJsonParse = (): FC<IProps> => {
  const Component: FC<IProps> = ({ value }) => (
    <Text variant="code" className={dataFieldClass}>
      {!!value && value?.length > 0 ? JSON.parse(value) : value}
    </Text>
  );
  return Component;
};
