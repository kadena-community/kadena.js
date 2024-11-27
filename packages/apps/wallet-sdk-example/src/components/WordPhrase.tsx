import { MonoShortText } from '@kadena/kode-icons/system';
import {
  Button,
  Card,
  ContentHeader,
  Divider,
  Stack,
  TextField,
} from '@kadena/kode-ui';
import { useWalletState } from '../state/wallet';
import { useMnemonicWords } from '../state/words';

export const WordPhrase = () => {
  const wallet = useWalletState();
  const { mnemonicWords, setMnemonicWords } = useMnemonicWords();

  const onGenerateMnemonic = () => {
    const words = wallet.generateMnemonic();
    /*
      For demonstration purposes only, the mnemonic is stored locally in this app,
      which is not secure and should never be implemented this way in a production environment.
      In production, only the encrypted seed should be stored if necessary, while the mnemonic should be securely kept by the end user.
    */
    setMnemonicWords(words);
    wallet.changeMnemonicWords(words).catch(console.error);
  };

  const onChangeMnemonic = (words: string) => {
    if (mnemonicWords === words) return;
    setMnemonicWords(words);
    wallet.changeMnemonicWords(words).catch(console.error);
  };

  const hasError = !mnemonicWords || mnemonicWords.trim() === '';

  return (
    <>
      <Card fullWidth>
        <ContentHeader
          heading="Word Phrase"
          description="Manage your wallet's mnemonic phrase. You can either generate a new
            random phrase or enter an existing one to restore your wallet."
          icon={<MonoShortText />}
        />
        <Divider />
        <Stack
          alignItems="flex-start"
          flexDirection="column"
          gap="xs"
          marginBlockEnd="md"
          maxWidth="content.maxWidth"
        ></Stack>
        <Stack alignItems="stretch" flexDirection="column" gap="xs">
          <TextField
            label="Mnemonic Phrase"
            description="Enter or generate a mnemonic phrase."
            value={mnemonicWords ?? ''}
            onValueChange={(e) => onChangeMnemonic(e)}
            placeholder="Enter or generate mnemonic phrase"
            variant="default"
            size="md"
            fontType="ui"
            errorMessage={hasError ? 'Mnemonic phrase cannot be empty.' : ''}
          />
          <Divider />
          <Button onPress={onGenerateMnemonic} variant="primary">
            Generate Random
          </Button>
        </Stack>
      </Card>
    </>
  );
};
