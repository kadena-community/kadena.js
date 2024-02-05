import { useWallet } from '@/modules/wallet/wallet.hook';
import { Box, Heading, Text } from '@kadena/react-ui';
import { Link } from 'react-router-dom';

declare const PasswordCredential: {
  new (passwordCredentialInit: { id: string; password: string }): Credential;
};

export function BackupRecoveryPhrase() {
  const supportPasswordCredential = 'PasswordCredential' in window;
  const wallet = useWallet();
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
    <main>
      <Box margin="md">
        <Heading variant="h5">Backup the recovery phrase</Heading>
        <Text>
          With recovery phrase you can recover your wallet; you should consider
          everyone with the phrase have access to your assets
        </Text>
        <Heading variant="h5">Choose a method</Heading>
        <Link to="/backup-recovery-phrase/write-down">
          Write down the phrase
        </Link>
        <br />
        <Link to="/backup-recovery-phrase/export-encrypted">
          Export encrypted phrase
        </Link>
        <br />
        {supportPasswordCredential && (
          <>
            <a
              onClick={storeRecoveryPhrase}
              href="/backup-recovery-phrase/export-encrypted"
            >
              Store encrypted in password storage
            </a>
            <br />
          </>
        )}
        <Link to="/">Skip for now</Link>
      </Box>
    </main>
  );
}
