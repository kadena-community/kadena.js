import { useNetwork } from '@/modules/network/network.hook';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { IKeySource } from '@/modules/wallet/wallet.repository';
import { Box, Button, Card, Heading } from '@kadena/react-ui';
import { Link, Navigate } from 'react-router-dom';

export function HomePage() {
  const {
    accounts,
    isUnlocked,
    createKey,
    createKAccount,
    keySources,
    profile,
  } = useWallet();
  const { activeNetwork } = useNetwork();

  if (!isUnlocked) {
    return <Navigate to="/select-profile" replace />;
  }
  const createAccount = async (keySource: IKeySource) => {
    if (!profile || !activeNetwork) {
      throw new Error('Profile or activeNetwork not found!!');
    }
    const key = await createKey(keySource);
    if (key) {
      await createKAccount(
        profile.uuid,
        activeNetwork.networkId,
        key.publicKey,
      );
    }
  };
  console.log('keySources', keySources);
  return (
    <>
      <Box margin="md">
        <Heading as="h1">Welcome to Chainweaver 3.0</Heading>
        <Heading as="h3">Available key sources</Heading>
        {keySources.map((ks, index) => (
          <Card key={index}>
            <Heading as="h6">{ks.source}</Heading>
            <Button onPress={() => createAccount(ks)}>Add k account</Button>
            <br />
            <Link to={`/backup-recovery-phrase/${ks.uuid}`}>
              Back up recovery phrase
            </Link>
          </Card>
        ))}
        <Heading as="h6">Accounts</Heading>
        {accounts.length ? (
          <ul>
            {accounts.map(({ address, overallBalance }, index) => (
              <li key={index}>
                <Box>
                  {address ?? 'No Address ;(!'} : {overallBalance}
                </Box>
              </li>
            ))}
          </ul>
        ) : null}
      </Box>
      <Box>
        <Link to="/sig-builder">Sig Builder</Link>
      </Box>
    </>
  );
}
