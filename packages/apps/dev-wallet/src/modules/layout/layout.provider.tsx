import { useWallet } from '@/modules/wallet/wallet.hook.tsx';
import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

export const defaultAccentColor: string = '#42CEA4';
export type LayoutContextType = {
  accentColor: string;
};

interface ILayoutContext {
  layoutContext: LayoutContextType;
  setLayoutContext: Dispatch<SetStateAction<LayoutContextType>>;
}

export const LayoutContext = createContext<ILayoutContext>({
  layoutContext: {
    accentColor: '',
  },
  setLayoutContext: () => {},
});

export const LayoutProvider: FC<PropsWithChildren> = ({ children }) => {
  const { profile } = useWallet();
  const [layoutContext, setLayoutContext] = useState<LayoutContextType>({
    accentColor: defaultAccentColor,
  });

  useEffect(() => {
    setLayoutContext({
      accentColor: profile?.accentColor ?? defaultAccentColor,
    });
  }, [profile]);

  return (
    <LayoutContext.Provider value={{ layoutContext, setLayoutContext }}>
      {children}
    </LayoutContext.Provider>
  );
};
