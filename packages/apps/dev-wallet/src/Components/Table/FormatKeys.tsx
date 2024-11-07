import { shorten } from '@/utils/helpers';
import { MonoKey } from '@kadena/kode-icons/system';
import { Stack, Text } from '@kadena/kode-ui';
import { ICompactTableFormatterProps } from '@kadena/kode-ui/patterns';

export const FormatKeys =
  () =>
  ({ value }: ICompactTableFormatterProps) => {
    if (typeof value === 'string') return null;
    const keyset: string[] =
      value.length > 1 ? (value[1] as unknown as string[]) : [];

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
