import { Heading, Stack, Text } from '@kadena/kode-ui';
import type { FC, ReactElement } from 'react';
import {
  contractDetailsBodyClass,
  contractDetailsClass,
  contractDetailsHeaderClass,
} from './style.css';

interface IProps {
  label: string;
  value?: ReactElement | string;
  ['data-testid']?: string;
}

export const ContractDetails: FC<IProps> = ({
  label,
  value,
  'data-testid': dataTestId,
}) => {
  return (
    <Stack
      className={contractDetailsClass}
      flexDirection="column"
      alignItems="center"
      gap="sm"
      data-testid={dataTestId}
    >
      <Heading as="h6" className={contractDetailsHeaderClass}>
        {label}
      </Heading>
      <Text className={contractDetailsBodyClass}>{value}</Text>
    </Stack>
  );
};
