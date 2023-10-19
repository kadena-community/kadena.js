import {
  Button,
  ContentHeader,
  Heading,
  Notification,
  Stack,
} from "@kadena/react-ui";
import { useState } from "react";
import { useCopyToClipboard } from "usehooks-ts";
import { useCrypto } from "@/hooks/crypto.context";
import { generateWords } from "@/utils/helpers";
import { Word } from "./components/Word";

const getRandomList = (length: number, max: number, init: number[] = []) => {
  const list: number[] = [...init];
  for (let i = list.length; i < length; i++) {
    let random = Math.floor(Math.random() * max);
    while (list.includes(random)) {
      random = Math.floor(Math.random() * max);
    }
    list.push(random);
  }
  return list;
};

export default function Words({ password }: { password: string }) {
  const wallet = useCrypto();
  const [step, setStep] = useState(0); // 0 = words, 1 = confirm, 2 = done
  const [, copy] = useCopyToClipboard();
  const [wordsArray, setWordsArray] = useState<string[]>(() =>
    generateWords().split(" ")
  );
  const [shuffledWords, setShuffledWords] = useState<
    Array<{
      idx: number;
      word: string;
      random: string[];
      selected?: string;
    }>
  >([]);

  function goStepOne() {
    setStep(1);
    const randomItems = getRandomList(4, 12).map((item) => ({
      idx: item,
      word: wordsArray[item],
      random: getRandomList(4, 12, [item])
        // shuffle items
        .sort(() => Math.random() - 0.5)
        .map((i) => wordsArray[i]),
    }));

    setShuffledWords(randomItems);
  }

  const onSubmit = () => {
    if (shuffledWords.some((item) => item.word !== item.selected)) return;
    if (!password) {
      throw Error("No password set");
    }

    wallet.generateSeed(wordsArray.join(" "), password, false);

    setStep(2);
  };

  const onLoadWallet = () => {
    if (password) {
      wallet.restoreWallet(password);
      return;
    }
    throw Error("No password set");
  };

  return (
    <main>
      <Stack direction="column" margin="$md">
        <Heading as="h3">Create wallet</Heading>
        <Stack direction="row" marginY="$md" justifyContent="space-between">
          <ContentHeader
            heading="Mnemonic words"
            icon="ShieldAccountVariantOutline"
            description="With these 12 words you can restore your wallet in the same or different machine. Make sure to copy them to a safe place"
          />
        </Stack>

        {(step === 0 || step === 2) && (
          <Stack gap="$sm" wrap="wrap">
            <Stack gap="$sm" wrap="wrap">
              {wordsArray.map((word, idx) => (
                <>
                  {idx + 1}:<Word key={word}>{word}</Word>
                </>
              ))}
            </Stack>
          </Stack>
        )}

        {step === 1 && (
          <>
            <Stack gap="$sm" wrap="wrap">
              {wordsArray.map((word, idx) => (
                <>
                  {idx + 1}:<Word key={word}>{"*".repeat(7)}</Word>
                </>
              ))}
            </Stack>
            <Stack gap="$md" marginTop="$lg" direction={"column"}>
              <Heading as="h5">Confirm words</Heading>
              <Stack as="ul" gap="$sm" wrap="wrap" direction="column">
                {shuffledWords.map((item, row) => (
                  <Stack key={item.idx} gap={"$sm"}>
                    <div style={{ minWidth: 30 }}>{item.idx + 1}:</div>
                    <Stack gap={"$sm"}>
                      {item.random.map((word) => (
                        <Word
                          disabled={item.selected === word}
                          onClick={() => {
                            shuffledWords[row].selected = word;
                            setShuffledWords([...shuffledWords]);
                          }}
                        >
                          {word}
                        </Word>
                      ))}
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </>
        )}

        {step === 2 && (
          <>
            <Stack marginTop={"$md"}>
              <Notification.Root
                color="positive"
                hasCloseButton
                icon="Information"
                title="Wallet created!"
              >
                <>
                  Your wallet has been created!
                  <p>Make sure to copy your mnemonic to a safe place.</p>
                  <Notification.Actions>
                    <Notification.Button
                      color="positive"
                      icon="ScriptTextKeyNew"
                      onClick={() => {
                        copy(wordsArray.join(" "));
                      }}
                    >
                      Copy
                    </Notification.Button>
                  </Notification.Actions>
                </>
              </Notification.Root>
            </Stack>
            <Stack direction="row" gap="$lg" marginTop="$lg">
              <Button
                title="store seed"
                onClick={onLoadWallet}
                icon="BadgeAccount"
              >
                Load wallet
              </Button>
            </Stack>
          </>
        )}

        {step === 0 && (
          <Stack direction="row" gap="$lg" marginTop="$lg">
            <Button title="store seed" onClick={goStepOne} color="positive">
              Next
            </Button>
            <Button
              title="Copy"
              onClick={() => {
                copy(wordsArray.join(" "));
              }}
              icon="ContentCopy"
            >
              Copy
            </Button>
            <Button
              title="regenerate words"
              onClick={() => {
                setWordsArray(generateWords().split(" "));
              }}
              icon="Refresh"
            >
              regenerate
            </Button>
          </Stack>
        )}
        {step === 1 && (
          <Stack direction="row" gap="$lg" marginTop="$lg">
            <Button
              title="store seed"
              onClick={() => setStep(0)}
              color="positive"
            >
              Back
            </Button>
            <Button
              title="regenerate words"
              disabled={shuffledWords.some(
                (item) => item.word !== item.selected
              )}
              onClick={onSubmit}
              icon="BadgeAccount"
            >
              Create wallet!
            </Button>
          </Stack>
        )}
      </Stack>
    </main>
  );
}
