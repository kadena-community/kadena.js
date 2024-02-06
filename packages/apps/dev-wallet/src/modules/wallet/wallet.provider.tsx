import {
  FC,
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from 'react';

import { IAccount, IProfile, walletRepository } from './wallet.repository';

export type ExtWalletContextType = {
  profile?: IProfile;
  accounts?: IAccount[];
  profileList?: Pick<IProfile, 'name' | 'uuid'>[];
};

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
    const fetchProfileList = async () => {
      const profileList = (await walletRepository.getAllProfiles()) ?? [];
      setContextValue({
        profileList: profileList.map(({ name, uuid }) => ({ name, uuid })),
      });
    };

    fetchProfileList();
  }, []);

  return (
    <WalletContext.Provider value={[contextValue, setContextValue]}>
      {children}
    </WalletContext.Provider>
  );
};
