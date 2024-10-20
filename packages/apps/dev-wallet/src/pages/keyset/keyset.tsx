import { accountRepository } from '@/modules/account/account.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';
import { useAsync } from '@/utils/useAsync';

import { MonoKey } from '@kadena/kode-icons/system';
import { Heading, Stack, Text } from '@kadena/kode-ui';
import { useParams } from 'react-router-dom';

export function Keyset() {
  const { keysetId } = useParams();
  const { profile } = useWallet();
  const [keyset] = useAsync(
    (id) => (id ? accountRepository.getKeyset(id) : Promise.reject('no ide')),
    [keysetId],
  );
  const [accounts] = useAsync(
    (id) =>
      id ? accountRepository.getAccountByKeyset(id) : Promise.reject('no id'),
    [keysetId],
  );

  if (!keyset || !accounts || !profile || keyset.profileId !== profile.uuid) {
    return null;
  }

  return (
    <Stack flexDirection={'column'} gap={'sm'}>
      {!!keyset.alias && <Heading variant="h3">{keyset.alias}</Heading>}
      <Stack justifyContent={'space-between'}>
        <Heading variant="h2">{shorten(keyset.principal, 15)}</Heading>
      </Stack>
      <Stack flexWrap="wrap" flexDirection={'row'} gap="md">
        <Text>{keyset.guard.pred}:</Text>
        {keyset.guard.keys.map((key) => (
          <Stack key={key} gap="sm" alignItems={'center'}>
            <Text>
              <MonoKey />
            </Text>
            <Text variant="code">{shorten(key)}</Text>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
