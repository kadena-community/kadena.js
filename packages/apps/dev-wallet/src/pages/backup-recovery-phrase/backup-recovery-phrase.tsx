import { AuthCard } from '@/Components/AuthCard/AuthCard';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { Button, Heading, MaskedValue, Stack, Text } from '@kadena/react-ui';
import { Link, useParams } from 'react-router-dom';

declare const PasswordCredential: {
  new (passwordCredentialInit: { id: string; password: string }): Credential;
};

export function BackupRecoveryPhrase() {
  const supportPasswordCredential = 'PasswordCredential' in window;
  const wallet = useWallet();
  const { keySourceId } = useParams();
  const storeRecoveryPhrase: React.MouseEventHandler<HTMLAnchorElement> = (
    e,
  ) => {
    e.preventDefault();
    if (supportPasswordCredential) {
      const passwordCredential = new PasswordCredential({
        id: `${wallet.profile}-dev-wallet-secret`,
        password: 'my recovery phrase',
      });

      navigator.credentials.store(passwordCredential);
    }
  };
  return (
    <>
      <AuthCard backButtonLink="/create-profile">
        <Heading variant="h5">Save your recovery key</Heading>
        <Text>
          Secure your assets by writing down or exporting 
          your recovery phrase. Otherwise you will lose 
          your assets if this wallet is deleted.
        </Text>
        <Heading as="h6">Recovery phrase</Heading>
        <Link to={`/backup-recovery-phrase/${keySourceId}/write-down`}>
          Write down the phrase
        </Link>
        <br />
        <Link to={`/backup-recovery-phrase/${keySourceId}/export-encrypted`}>
          Export encrypted phrase
        </Link>
        <br />
        {supportPasswordCredential && (
          <>
            <a onClick={storeRecoveryPhrase} href="#">
              Store encrypted in password storage
            </a>
            <br />
          </>
        )}
        <MaskedValue
          maskCharacter="*"
          maskLength={5}
          title="1"
          value="wordfd"
          startUnmaskedValues={0}
          endUnmaskedValues={0}
        />
        <Stack flexDirection="column" gap="md">
          <Button variant="outlined">Export encrypted file</Button>
          <Button variant="primary">Write it down</Button>
        </Stack>
      </AuthCard>
      <Link to="/">Skip step</Link>
    </>
  );
}
