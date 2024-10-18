import { IAccount } from '@/modules/account/account.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { panelClass } from '@/pages/home/style.css';
import { linkClass } from '@/pages/select-profile/select-profile.css';
import { getAccountName } from '@/utils/helpers';
import { Box, Heading, Stack, Text } from '@kadena/kode-ui';
import { Link } from 'react-router-dom';
import { ListItem } from '../ListItem/ListItem';
import { listClass, noStyleLinkClass } from './style.css';

export function Accounts({
  accounts,
  contract,
}: {
  accounts: IAccount[];
  contract: string;
}) {
  const { profile, activeNetwork } = useWallet();
  const totalAccounts = accounts.length;
  if (!profile || !activeNetwork) {
    return null;
  }
  return (
    <Box className={panelClass} marginBlockStart="xs">
      <Heading as="h4">{totalAccounts} accounts</Heading>
      <Link to={`/create-account?contract=${contract}`} className={linkClass}>
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
          </ul>
        </Box>
      ) : null}
    </Box>
  );
}
