import { shorten } from '@/utils/helpers';
import { MonoKey } from '@kadena/kode-icons/system';
import { Stack, Text } from '@kadena/kode-ui';

export function Key({
  publicKey,
  shortening,
}: {
  publicKey: string;
  shortening?: number;
}) {
  return (
    <Stack gap={'sm'}>
      <Text>
        <MonoKey />
      </Text>
      <Text>{shortening ? shorten(publicKey, shortening) : publicKey}</Text>
    </Stack>
  );
}
