import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

/*
   Words logic is separated because a wallet normally would not store this, ever.
  This example wallet stores it for testing purposes.
*/
const mnemonicWordsAtom = atomWithStorage<null | string>(
  'mnemonic_words',
  null,
);

export const useMnemonicWords = () => {
  const [mnemonicWords, setMnemonicWords] = useAtom(mnemonicWordsAtom);

  return {
    mnemonicWords,
    setMnemonicWords,
  };
};
