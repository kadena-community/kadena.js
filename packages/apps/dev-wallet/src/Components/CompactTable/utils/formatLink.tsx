import { MonoArrowOutward } from '@kadena/kode-icons';
import { Stack, Text } from '@kadena/kode-ui';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  dataFieldClass,
  linkClass,
  linkIconClass,
  linkWrapperClass,
} from '../styles.css';

interface IProps {
  value: string;
}

interface IOptions {
  appendUrl: string;
}

export const FormatLink = ({ appendUrl }: IOptions): FC<IProps> => {
  const Component: FC<IProps> = ({ value }) => (
    <Stack alignItems="center" className={linkWrapperClass}>
      <Link to={`${appendUrl}/${value}`} className={linkClass}>
        <Text variant="code" className={dataFieldClass}>
          {value}
        </Text>
      </Link>
      <Link to={`${appendUrl}/${value}`} className={value}>
        <MonoArrowOutward className={linkIconClass} />
      </Link>
    </Stack>
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
