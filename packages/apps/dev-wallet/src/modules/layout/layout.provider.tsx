import { useWallet } from '@/modules/wallet/wallet.hook.tsx';
import { useTheme } from '@kadena/kode-ui';
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
  // initialize the theme
  useTheme();
  const [layoutContext, setLayoutContext] = useState<LayoutContextType>({
    accentColor: defaultAccentColor,
  });

  const accentColor = profile?.accentColor;
  useEffect(() => {
    setLayoutContext({
      accentColor: accentColor ?? defaultAccentColor,
    });
  }, [accentColor]);

  return (
    <LayoutContext.Provider value={{ layoutContext, setLayoutContext }}>
      {children}
    </LayoutContext.Provider>
  );
};
