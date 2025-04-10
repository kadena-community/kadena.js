import { CardContent } from '@/App/LayoutLandingPage/components/CardContent';
import { CardFooterContent } from '@/App/LayoutLandingPage/components/CardFooterContent';
import { wrapperClass } from '@/pages/errors/styles.css';
import { MonoPassword } from '@kadena/kode-icons/system';
import { Badge, Button, Stack, Text } from '@kadena/kode-ui';
import { CardFooterGroup } from '@kadena/kode-ui/patterns';
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
        <>
          <CardContent
            label="Write your recovery phrase down"
            id="recoveryphrase"
            description="Make sure no one is watching you; consider some malware might take
              screenshot of your screen"
            visual={<MonoPassword width={40} height={40} />}
          />
          <Stack flexDirection={'column'} gap="lg" className={wrapperClass}>
            <Text>
              you should consider everyone with the phrase have access to your
              assets
            </Text>
          </Stack>

          <CardFooterContent>
            <CardFooterGroup>
              <Button variant="transparent" onClick={onSkip}>
                Skip
              </Button>
              <Button
                type="submit"
                onClick={async () => {
                  await onDecrypt();
                  setStep('view');
                }}
              >
                Show Phrase
              </Button>
            </CardFooterGroup>
          </CardFooterContent>
        </>
      )}
      {step === 'view' && (
        <>
          <CardContent
            refreshDependencies={[copied]}
            label="Write down your recovery phrase"
            id="recoveryphrase"
            description="Your recovery phrase is the key to your account. Write it down and
            keep it safe."
            visual={<MonoPassword width={40} height={40} />}
            supportingContent={
              <>
                <Button
                  onClick={copyToClipboard}
                  isDisabled={copied}
                  isCompact
                  variant="outlined"
                >
                  {copied ? 'Copied' : 'Copy to clipboard'}
                </Button>
              </>
            }
          />
          <Stack flexDirection={'column'} gap={'lg'} className={wrapperClass}>
            <Stack flexDirection={'column'} gap={'lg'} marginBlockStart={'sm'}>
              <Stack justifyContent="center" flexWrap="wrap" gap={'sm'}>
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
                      <Text>{index + 1}:</Text>
                    </Stack>{' '}
                    <Badge size="lg" className={wordClass}>
                      {word}
                    </Badge>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Stack>
          <CardFooterContent>
            <CardFooterGroup>
              <Button variant="transparent" onClick={onSkip}>
                Skip
              </Button>
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
            </CardFooterGroup>
          </CardFooterContent>
        </>
      )}
      {step === 'confirm' && (
        <>
          <CardContent
            label="Confirm you have the phrases"
            id="recoveryphrase"
            description="Select the correct words in the correct order to confirm you have"
            visual={<MonoPassword width={40} height={40} />}
          />
          <Stack flexDirection={'column'} gap={'lg'} className={wrapperClass}>
            <Stack flexWrap="wrap" gap={'xs'} justifyContent="center">
              {randomIndexes.map((idx, index) => (
                <Stack
                  key={idx}
                  gap={'sm'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  style={{
                    minWidth: '10px',
                  }}
                >
                  <Stack
                    style={{
                      minWidth: '25px',
                    }}
                    justifyContent={'flex-end'}
                  >
                    <Text>{idx + 1}:</Text>
                  </Stack>{' '}
                  <Badge size="lg" className={wordClass}>
                    {selectedWords[index] || ''}
                  </Badge>
                </Stack>
              ))}
            </Stack>
            <Stack flexDirection={'column'} gap={'lg'} marginBlockStart={'sm'}>
              <Stack flexWrap="wrap" gap={'sm'} justifyContent="center">
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
                        setSelectedWords((prev) => {
                          if (prev.length === 3) {
                            return [word];
                          }
                          return [...prev, word];
                        });
                      }}
                    >
                      {word}
                    </Button>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Stack>

          <CardFooterContent>
            <Stack width="100%">
              <Button
                variant="outlined"
                type="button"
                onPress={() => {
                  setCopied(false);
                  setStep('view');
                }}
              >
                Back
              </Button>
            </Stack>

            <CardFooterGroup>
              <Button
                isDisabled={
                  selectedWords.length !== 3 ||
                  !selectedWords.every(
                    (word, index) => word === words[randomIndexes[index]],
                  )
                }
                onClick={onConfirm}
              >
                Continue
              </Button>
            </CardFooterGroup>
          </CardFooterContent>
        </>
      )}
    </>
  );
}
