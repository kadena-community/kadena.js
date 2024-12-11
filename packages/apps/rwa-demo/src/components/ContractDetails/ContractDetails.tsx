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
}

export const ContractDetails: FC<IProps> = ({ label, value }) => {
  return (
    <Stack
      className={contractDetailsClass}
      flexDirection="column"
      alignItems="center"
      gap="sm"
    >
      <Heading as="h6" className={contractDetailsHeaderClass}>
        {label}
      </Heading>
      <Text className={contractDetailsBodyClass}>{value}</Text>
    </Stack>
  );
};
