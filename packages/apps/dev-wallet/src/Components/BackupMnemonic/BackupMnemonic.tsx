import { Badge, Button, Heading, Stack, Text } from '@kadena/kode-ui';
import { useMemo, useState } from 'react';
import { wordClass } from './style.css';

export function BackupMnemonic({
  mnemonic,
  onSkip,
  onConfirm,
  onDecrypt,
}: {
  mnemonic: string;
  onSkip: () => void;
  onConfirm: () => void;
  onDecrypt: () => Promise<void>;
}) {
  const [step, setStep] = useState<'start' | 'view' | 'confirm'>('start');
  const [copied, setCopied] = useState(false);
  const words = useMemo(() => mnemonic.split(' '), [mnemonic]);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(mnemonic);
    setCopied(true);
  };
  const randomizeMnemonic = () =>
    mnemonic.split(' ').sort(() => Math.random() * 3 - 1.5);
  const [randomizedMnemonic, setRandomizedMnemonic] = useState<string[]>(() =>
    randomizeMnemonic(),
  );
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [randomIndexes, setRandomIndexes] = useState<number[]>([]);
  return (
    <>
      {step === 'start' && (
        <Stack flexDirection={'column'} gap={'lg'}>
          <Stack flexDirection={'column'} gap={'sm'}>
            <Heading variant="h5">Write your recovery phrase down</Heading>
            <Text>
              Make sure no one is watching you; consider some malware might take
              screenshot of your screen
            </Text>
          </Stack>
          <Text>
            you should consider everyone with the phrase have access to your
            assets
          </Text>
          {
            <Button
              type="submit"
              onClick={async () => {
                await onDecrypt();
                setStep('view');
              }}
            >
              Show Phrase
            </Button>
          }
        </Stack>
      )}
      {step === 'view' && (
        <Stack flexDirection={'column'} gap={'sm'}>
          <Heading variant="h5">Write down your recovery phrase</Heading>
          <Text size="small">
            Your recovery phrase is the key to your account. Write it down and
            keep it safe.
          </Text>
          <Stack flexDirection={'column'} gap={'lg'} marginBlockStart={'sm'}>
            <Stack flexWrap="wrap" gap={'sm'}>
              {words.map((word, index) => (
                <Stack
                  key={word}
                  gap={'sm'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  style={{
                    minWidth: '120px',
                  }}
                >
                  <Stack
                    style={{
                      minWidth: '25px',
                    }}
                    justifyContent={'flex-end'}
                  >
                    {index + 1}:
                  </Stack>{' '}
                  <Badge size="lg" className={wordClass}>
                    {word}
                  </Badge>
                </Stack>
              ))}
            </Stack>

            <Stack
              gap={'sm'}
              flex={1}
              alignItems={'center'}
              flexDirection={'row'}
            >
              <Stack flex={1}>
                <Button
                  onClick={copyToClipboard}
                  isDisabled={copied}
                  variant="outlined"
                >
                  {copied ? 'Copied' : 'Copy to clipboard'}
                </Button>
              </Stack>
              <Stack>
                <Button
                  onClick={() => {
                    setRandomizedMnemonic(randomizeMnemonic());
                    setRandomIndexes(
                      Array.from({ length: words.length }, (_, i) => i)
                        .sort(() => Math.random() * 4 - 2)
                        .splice(0, 3),
                    );
                    setSelectedWords([]);
                    setStep('confirm');
                  }}
                >
                  Confirm
                </Button>
                <Button variant="transparent" onClick={onSkip}>
                  Skip
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      )}
      {step === 'confirm' && (
        <Stack flexDirection={'column'} gap={'lg'}>
          <Stack>
            <Button
              variant="outlined"
              isCompact
              type="button"
              onPress={() => {
                setStep('view');
              }}
            >
              Back
            </Button>
          </Stack>
          <Stack flexDirection={'column'} gap={'sm'}>
            <Heading variant="h5">Confirm you have the phrases</Heading>
            <Text>
              Select the correct words in the correct order to confirm you have
            </Text>
          </Stack>
          <Stack flexWrap="wrap" gap={'sm'}>
            {randomIndexes.map((idx, index) => (
              <Stack
                key={idx}
                gap={'sm'}
                alignItems={'center'}
                justifyContent={'center'}
                style={{
                  minWidth: '120px',
                }}
              >
                <Stack
                  style={{
                    minWidth: '25px',
                  }}
                  justifyContent={'flex-end'}
                >
                  {idx + 1}:
                </Stack>{' '}
                <Badge size="lg" className={wordClass}>
                  {selectedWords[index] || ''}
                </Badge>
              </Stack>
            ))}
          </Stack>
          <Stack flexDirection={'column'} gap={'lg'} marginBlockStart={'sm'}>
            <Stack flexWrap="wrap" gap={'sm'}>
              {randomizedMnemonic.map((word) => (
                <Stack
                  key={word}
                  gap={'sm'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  style={{
                    minWidth: '120px',
                  }}
                >
                  <Stack
                    style={{
                      minWidth: '25px',
                    }}
                    justifyContent={'flex-end'}
                  ></Stack>{' '}
                  <Button
                    isCompact
                    className={wordClass}
                    variant="outlined"
                    onClick={() => {
                      setSelectedWords((prev) => [...prev, word]);
                    }}
                  >
                    {word}
                  </Button>
                </Stack>
              ))}
            </Stack>
          </Stack>
          <Button
            isDisabled={
              selectedWords.length !== 3 ||
              selectedWords.every(
                (word, index) => word !== words[randomIndexes[index]],
              )
            }
            onClick={onConfirm}
          >
            Continue
          </Button>
        </Stack>
      )}
    </>
  );
}
