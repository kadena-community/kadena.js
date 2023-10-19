import { ICryptoService, cryptoService } from "@/service/crypto.service";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAccounts } from "./accounts.hook";
import { useLocalStorage } from "usehooks-ts";

export const KEY_LENGTH = "key_length";
export const SEED = "kadena_seed";

const CryptoContext = createContext<
  | (Omit<ICryptoService, "restoreWallet"> & {
      publicKeys: string[];
      loaded: boolean;
      hasEncryptedSeed: () => boolean;
      restoreWallet: (password: string) => Promise<boolean>;
      reset: () => void;
    })
  | null
>(null);

interface CryptoContextProps {
  children: React.ReactNode;
}

export const useCrypto = () => {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error("useCrypto must be used within a CryptoContextProvider");
  }
  return context;
};

const devPassword = import.meta.env.VITE_DEVELOPMENT_PASSWORD;

export const CryptoContextProvider = ({ children }: CryptoContextProps) => {
  const [loading, setLoading] = useState(!!devPassword);
  const [keyLength, setKeyLength] = useLocalStorage(KEY_LENGTH, 0);
  const [seed, setSeed] = useLocalStorage<string | null>(SEED, "");

  const { clear: clearAccounts } = useAccounts();

  const [seedBuffer, setSeedBuffer] = useState<Uint8Array | null>(null);
  const [publicKeys, setPublicKeys] = useState<string[]>([]);

  console.log("seed", seed);

  const wallet = useMemo(
    () =>
      cryptoService({
        set: (patch) => {
          if ("publicKeys" in patch) {
            setKeyLength(patch.publicKeys?.length ?? 0);
            setPublicKeys(patch.publicKeys ?? []);
          }
          if ("seed" in patch) {
            setSeed(patch.seed ?? null);
            clearAccounts();
          }
          if ("seedBuffer" in patch) {
            setSeedBuffer(patch.seedBuffer ?? null);
          }
        },
        get: () => ({
          seed,
          seedBuffer,
          publicKeys,
        }),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed, seedBuffer, publicKeys]
  );

  useEffect(() => {
    if (devPassword) {
      wallet.restoreWallet(devPassword, keyLength).then(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <CryptoContext.Provider
      value={{
        ...wallet,
        publicKeys,
        loaded: Boolean(seedBuffer),
        hasEncryptedSeed: () => Boolean(seed),
        reset: () => {
          setSeedBuffer(null);
        },
        restoreWallet: async (password: string) =>
          wallet.restoreWallet(password, keyLength),
      }}
    >
      {!loading ? children : "Loading..."}
    </CryptoContext.Provider>
  );
};
