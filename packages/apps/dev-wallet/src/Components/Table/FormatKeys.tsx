import { IKeySet } from '@/modules/account/account.repository';
import { shorten } from '@/utils/helpers';
import { MonoKey } from '@kadena/kode-icons/system';
import { Stack, Text } from '@kadena/kode-ui';
import { ICompactTableFormatterProps } from '@kadena/kode-ui/patterns';
import type { FC } from 'react';

export const FormatKeys: () => FC<ICompactTableFormatterProps> =
  () =>
  ({ value }) => {
    console.log(1111, value);
    const keyset: string[] = value.length > 1 ? (value[1] as string) : [];

    console.log(keyset);
    return (
      <Stack gap={'sm'} alignItems={'center'}>
        {value[0]}:
        {keyset.map((key) => (
          <Stack gap={'sm'} alignItems={'center'}>
            <Text variant="code">
              <MonoKey />
            </Text>
            <Text variant="code">{shorten(key)}</Text>{' '}
          </Stack>
        ))}
      </Stack>
    );
  };
