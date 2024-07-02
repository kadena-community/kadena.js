import { useWallet } from '@/modules/wallet/wallet.hook';
import { Box, Heading, Text } from '@kadena/kode-ui';
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
      <Box margin="md">
        <Heading variant="h5">Backup the recovery phrase</Heading>
        <Text>
          With recovery phrase you can recover your wallet; you should consider
          everyone with the phrase have access to your assets
        </Text>
        <Heading variant="h5">Choose a method</Heading>
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
        <Link to="/">Skip for now</Link>
      </Box>
    </>
  );
}
