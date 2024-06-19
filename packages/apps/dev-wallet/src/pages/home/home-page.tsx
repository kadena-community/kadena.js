import { useWallet } from '@/modules/wallet/wallet.hook';
import {
  listClass,
  listItemClass,
  panelClass,
} from '@/pages/home/style.css.ts';
import { getAccountName } from '@/utils/helpers';
import { Box, Heading, Stack, Text } from '@kadena/react-ui';

export function HomePage() {
  const { accounts, profile } = useWallet();

  // const createAccount = async (keySource: IKeySource) => {
  //   if (!profile || !activeNetwork) {
  //     throw new Error('Profile or activeNetwork not found!!');
  //   }
  //   const key = await createKey(keySource);
  //   if (key) {
  //     await createKAccount(
  //       profile.uuid,
  //       activeNetwork.networkId,
  //       key.publicKey,
  //     );
  //   }
  // };

  return (
    <Box>
      <Text>Welcome back</Text>
      <Heading as="h1">{profile?.name}</Heading>
      <Box className={panelClass} marginBlockStart="xl">
        <Heading as="h4">Your assets</Heading>
        <Box marginBlockStart="md">
          <Text>Tokens</Text>
        </Box>
      </Box>
      {/*TODO: Move to other pages*/}
      {/*<div className={panelClass}>*/}
      {/*  <Heading as="h3">Available key sources</Heading>*/}
      {/*  {keySources?.map((ks) => (*/}
      {/*    <div key={ks.source}>*/}
      {/*      <Heading as="h6">{ks.source}</Heading>*/}
      {/*      <Button onPress={() => createAccount(ks)}>Add k account</Button>*/}
      {/*      <br />*/}
      {/*      <Link to={`/backup-recovery-phrase/${ks.uuid}`}>*/}
      {/*        Back up recovery phrase*/}
      {/*      </Link>*/}
      {/*    </div>*/}
      {/*  ))}*/}
      {/*</div>*/}
      <Box className={panelClass} marginBlockStart="xs">
        <Heading as="h4">{accounts.length} accounts</Heading>
        <Box marginBlockStart="md">
          <Text>Owned ({accounts.length})</Text>
          {accounts.length ? (
            <ul className={listClass}>
              {' '}
              {accounts.map(({ address, overallBalance }) => (
                <li key={address} className={listItemClass}>
                  <Stack justifyContent="space-between">
                    <Text>{getAccountName(address) ?? 'No Address ;(!'}</Text>
                    <Text>{overallBalance} KDA</Text>
                  </Stack>
                </li>
              ))}
            </ul>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
