import type { FC, PropsWithChildren, ReactElement } from 'react';
import { createContext, useContext, useState } from 'react';

export interface ICardContentProps {
  label: string;
  id?: string;
  description: string;
  visual?: ReactElement;
  supportingContent?: ReactElement;
}

export interface ILayoutContext {
  content: ICardContentProps;
  setContent: (state: ICardContentProps) => void;
  footerContentRef?: HTMLDivElement | null;
  setFooterContentRef: (value?: HTMLDivElement | null) => void;
}
export const LayoutContext = createContext<ILayoutContext>({
  content: {
    label: '',
    description: '',
  },
  setContent: () => {},
  setFooterContentRef: () => {},
});

export const useCardLayout = () => useContext(LayoutContext);

export interface ILayoutProvider extends PropsWithChildren {}

export const CardLayoutProvider: FC<ILayoutProvider> = ({ children }) => {
  const [content, setContentState] = useState({ label: '', description: '' });
  const [footerContentRef, setFooterContentRefState] =
    useState<HTMLDivElement | null>(null);

  const setFooterContentRef = (value?: HTMLDivElement | null) => {
    setFooterContentRefState(value ? value : null);
  };

  const setContent = (stateProps: ICardContentProps) => {
    setContentState(stateProps);
  };

  return (
    <LayoutContext.Provider
      value={{
        content,
        setContent,
        footerContentRef,
        setFooterContentRef,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
