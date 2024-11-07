import { Button, Heading, Stack, Text, TextField } from '@kadena/kode-ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function ConfirmRecoveryPhrase({
  mnemonic,
  onConfirm,
}: {
  mnemonic: string;
  onConfirm: () => void;
}) {
  const { register, handleSubmit } = useForm<{ phrase: string }>();
  const [error, setError] = useState('');
  async function confirm({ phrase }: { phrase: string }) {
    if (phrase.trim() !== mnemonic.trim()) {
      setError("Phrase doesn't match");
      return;
    }
    onConfirm();
  }

  return (
    <>
      <Stack width="100%" gap="md">
        <Heading as="h4">Confirm you wrote it down</Heading>
        <form onSubmit={handleSubmit(confirm)}>
          <label htmlFor="phrase">Enter phrase in the same order</label>
          <TextField type="password" id="phrase" {...register('phrase')} />
          <Button type="submit">Confirm</Button>
        </form>
        {error && <Text>{error}</Text>}
      </Stack>
    </>
  );
}
