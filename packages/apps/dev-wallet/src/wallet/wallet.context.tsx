import {
  FC,
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from 'react';

import {
  IAccount,
  IProfile,
  createWalletRepository,
} from './wallet.repository';
import { WalletContextType } from './wallet.service';

export type ExtWalletContextType = Partial<
  WalletContextType & {
    accounts: IAccount[];
    profileList: Pick<IProfile, 'name' | 'uuid'>[];
  }
>;

export const WalletContext = createContext<
  | [
      ExtWalletContextType,
      (cb: (prev: ExtWalletContextType) => ExtWalletContextType) => void,
    ]
  | null
>(null);

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const [contextValue, setContextValue] = useState<ExtWalletContextType>({});

  useEffect(() => {
    const wrPromise = createWalletRepository()
      .then(async (walletRepository) => {
        const profileList = (await walletRepository.getAllProfiles()) ?? [];
        setContextValue({
          walletRepository,
          profileList: profileList.map(({ name, uuid }) => ({ name, uuid })),
        });
        return walletRepository;
      })
      .catch((error) => {
        console.error(error);
      });
    return () => {
      wrPromise.then((store) => store?.disconnect());
    };
  }, []);

  return (
    <WalletContext.Provider value={[contextValue, setContextValue]}>
      {children}
    </WalletContext.Provider>
  );
};
