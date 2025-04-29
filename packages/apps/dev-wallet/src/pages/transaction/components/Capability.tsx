import { CopyButton } from '@/Components/CopyButton/CopyButton';
import { ICap, parseAsPactValue } from '@kadena/client';
import { MonoSecurity } from '@kadena/kode-icons/system';
import { Heading, Stack, Text } from '@kadena/kode-ui';
import { FC } from 'react';
import { breakAllClass } from './style.css';
import { capabilityClass } from './TxPipeLine/style.css';

interface IProps {
  capability: ICap;
  isSigned: boolean;
  idx: number;
}

export const Capability: FC<IProps> = ({
  capability,
  isSigned = false,
  idx,
}) => {
  const data = [
    capability.name,
    ...capability.args.map((data) =>
      typeof data === 'number' ? data : parseAsPactValue(data),
    ),
  ].join(' ');
  return (
    <Stack
      key={`${capability.name}${capability.args.toString()}`}
      gap={'sm'}
      flexDirection="column"
      justifyContent={'space-between'}
      className={capabilityClass({ isSigned })}
    >
      <Stack gap="sm" alignItems="center">
        <Stack flex={1} gap="sm" alignItems="center">
          <MonoSecurity width={16} height={16} />
          <Heading as="h5">Capbility {idx}</Heading>
        </Stack>
        <CopyButton data={data} />
      </Stack>
      <Stack paddingInlineStart="lg">
        <Text variant="code" className={breakAllClass}>
          {data}
        </Text>
      </Stack>
    </Stack>
  );
};
