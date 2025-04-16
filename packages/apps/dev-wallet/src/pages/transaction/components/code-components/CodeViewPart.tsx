import { Heading, Stack, Text } from '@kadena/kode-ui';
import { FC } from 'react';
import { breakAllClass } from '../style.css';
import { CodeViewAccount } from './CodeViewAccount';

export const CodeViewPart: FC<{
  label: string;
  senderAddress: string;
  receiverAddress: string;
  contract: string;
  amount: string;
}> = ({ label, senderAddress, receiverAddress, contract, amount }) => {
  return (
    <>
      <Heading variant="h5">{label}</Heading>
      <Stack gap={'sm'} flexWrap="wrap">
        <Text>from</Text>
        <Text bold color="emphasize">
          <CodeViewAccount address={senderAddress} contract={contract} />
        </Text>
      </Stack>
      <Stack gap={'sm'} flexWrap="wrap">
        <Text>to</Text>
        <Text bold color="emphasize">
          <CodeViewAccount address={receiverAddress} contract={contract} />
        </Text>
      </Stack>
      <Stack gap={'sm'} flexWrap="wrap">
        <Text>amount</Text>
        <Text bold color="emphasize" className={breakAllClass}>
          {amount}
        </Text>
      </Stack>
    </>
  );
};
