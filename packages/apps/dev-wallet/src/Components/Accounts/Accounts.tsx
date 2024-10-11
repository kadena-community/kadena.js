import {
  accountRepository,
  Fungible,
  IAccount,
  IKeySet,
} from '@/modules/account/account.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { linkClass } from '@/pages/select-profile/select-profile.css';
import { getAccountName } from '@/utils/helpers';
import { Box, Heading, Stack, Text } from '@kadena/kode-ui';
import { Link, useNavigate } from 'react-router-dom';
import { ListItem } from '../ListItem/ListItem';
import {
  listClass,
  noStyleButtonClass,
  noStyleLinkClass,
  panelClass,
} from './style.css';

export function Accounts({
  accounts,
  keysets,
  asset,
}: {
  accounts: IAccount[];
  keysets: IKeySet[];
  asset?: Fungible;
}) {
  const { profile, activeNetwork } = useWallet();
  const navigate = useNavigate();
  const notUsedKeysets = keysets.filter(
    (ks) => !accounts.find((acc) => acc.keysetId === ks.uuid),
  );
  const totalAccounts = accounts.length + notUsedKeysets.length;
  if (!profile || !activeNetwork) {
    return null;
  }
  return (
    <Box className={panelClass} marginBlockStart="xs">
      <Heading as="h4">{totalAccounts} accounts</Heading>
      <Link to="/create-account" className={linkClass}>
        Create Account
      </Link>
      {totalAccounts ? (
        <Box marginBlockStart="md">
          <Text>Owned ({totalAccounts})</Text>
          <ul className={listClass}>
            {accounts.map(({ overallBalance, keyset, uuid }) => (
              <li key={keyset?.principal}>
                <Link to={`/account/${uuid}`} className={noStyleLinkClass}>
                  <ListItem>
                    <Stack flexDirection={'column'} gap={'sm'}>
                      <Text>
                        {keyset?.alias || getAccountName(keyset!.principal)}
                      </Text>
                    </Stack>
                    <Stack alignItems={'center'} gap={'sm'}>
                      <Text>{overallBalance} KDA</Text>
                    </Stack>
                  </ListItem>
                </Link>
              </li>
            ))}
            {notUsedKeysets.map((keyset) => (
              <li key={keyset?.principal}>
                <button
                  className={noStyleButtonClass}
                  onClick={async (e) => {
                    e.preventDefault();
                    const account: IAccount = {
                      uuid: crypto.randomUUID(),
                      profileId: profile.uuid,
                      address: keyset?.principal,
                      keysetId: keyset.uuid,
                      networkUUID: activeNetwork.uuid,
                      contract: asset?.contract ?? 'coin',
                      chains: [],
                      overallBalance: '0',
                    };

                    await accountRepository.addAccount(account);
                    navigate(`/account/${account.uuid}`);
                  }}
                >
                  <ListItem>
                    <Stack flexDirection={'column'} gap={'sm'}>
                      <Text>
                        {keyset?.alias || getAccountName(keyset!.principal)}
                      </Text>
                    </Stack>
                    <Stack alignItems={'center'} gap={'sm'}>
                      <Text>0 {asset?.symbol ?? 'KDA'}</Text>
                    </Stack>
                  </ListItem>
                </button>
              </li>
            ))}
          </ul>
        </Box>
      ) : null}
    </Box>
  );
}
