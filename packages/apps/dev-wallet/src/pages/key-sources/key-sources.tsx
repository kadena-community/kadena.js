import { usePrompt } from '@/Components/PromptProvider/Prompt.tsx';
import { useHDWallet } from '@/modules/key-source/hd-wallet/hd-wallet.tsx';
import { keySourceManager } from '@/modules/key-source/key-source-manager';
import { WebAuthnService } from '@/modules/key-source/web-authn/webauthn';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { kadenaGenMnemonic } from '@kadena/hd-wallet';
import {
  Button,
  Card,
  Dialog,
  Heading,
  Stack,
  Text,
  TextField,
} from '@kadena/kode-ui';
import { passwordDialog } from './style.css.ts';

function PasswordPrompt({
  resolve,
  reject,
}: {
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}) {
  return (
    <Dialog
      size="sm"
      className={passwordDialog}
      isOpen={true}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          reject("User didn't provide password");
        }
      }}
    >
      <Stack gap={'md'} flexDirection={'column'}>
        <Heading variant="h1">Choose a password</Heading>
        <Text>
          You can use the same password as your profile password or new one, the
          sensitive data will be encrypted with this password
        </Text>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const password = new FormData(event.target as HTMLFormElement).get(
              'password',
            ) as string;
            resolve(password);
          }}
        >
          <Stack flexDirection={'column'} gap={'md'}>
            <TextField name="password" type="password" />
            <Button type="submit">Create KeySource</Button>
          </Stack>
        </form>
      </Stack>
    </Dialog>
  );
}

export function KeySources() {
  const { keySources, profile } = useWallet();
  const prompt = usePrompt();
  const { createHDWallet } = useHDWallet();
  async function createWebAuthn() {
    if (!profile) {
      throw new Error('No profile found');
    }
    if (keySources.find((keySource) => keySource.source === 'web-authn')) {
      // basically its possible to have multiple web-authn sources
      // but for now just for simplicity we will only allow one
      alert('WebAuthn already created');
      throw new Error('WebAuthn already created');
    }
    const service = (await keySourceManager.get(
      'web-authn',
    )) as WebAuthnService;

    await service.register(profile.uuid);
  }

  const registerHDWallet =
    (type: 'HD-BIP44' | 'HD-chainweaver') => async () => {
      const password = (await prompt((resolve, reject) => (
        <PasswordPrompt resolve={resolve} reject={reject} />
      ))) as string;
      if (!password || !profile) {
        return;
      }
      const mnemonic = kadenaGenMnemonic();
      await createHDWallet(profile?.uuid, type, password, mnemonic);
    };

  return (
    <>
      <Stack flexDirection={'column'} gap={'sm'}>
        <Stack flexDirection={'column'} gap={'sm'}>
          <Heading variant="h1">Available Key Sources</Heading>
          <p>Choose the type of key source you want to enable</p>
          <Stack gap={'sm'}>
            <Button
              variant="outlined"
              isDisabled={Boolean(
                keySources.find((k) => k.source === 'HD-BIP44'),
              )}
              onPress={registerHDWallet('HD-BIP44')}
            >
              HD-BIP44
            </Button>
            <Button
              variant="outlined"
              isDisabled={Boolean(
                keySources.find((k) => k.source === 'HD-chainweaver'),
              )}
              onPress={registerHDWallet('HD-chainweaver')}
            >
              HD-chainweaver
            </Button>
            <Button
              variant="outlined"
              onPress={createWebAuthn}
              isDisabled={Boolean(
                keySources.find((k) => k.source === 'web-authn'),
              )}
            >
              web-authn
            </Button>
          </Stack>
        </Stack>
        <Heading variant="h1">Created key sources</Heading>
        <Stack flexDirection={'column'} gap="md">
          {keySources.map((keySource) => (
            <Card fullWidth key={keySource.uuid}>
              <Heading variant="h3">{keySource.source}</Heading>
              <p>{keySource.uuid}</p>
              <div>
                <Heading variant="h4">created Keys</Heading>
                {keySource.keys.map((key) => (
                  <div key={key.index}>
                    <p>Index: {key.index}</p>
                    <p>Public key: {key.publicKey}</p>
                  </div>
                ))}
                {(!keySource.keys || keySource.keys.length === 0) && (
                  <p>No keys created yet</p>
                )}
              </div>
            </Card>
          ))}
        </Stack>
      </Stack>
    </>
  );
}
