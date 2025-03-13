import { InDevelopment } from '@/pages/in-development/in-development';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

const LOCALSTORAGE_KEY = 'isInDevelopmentMessageShown';

const context = createContext<{
  showInDevelopmentMessage: boolean;
  hideMessage: () => void;
}>({
  showInDevelopmentMessage: false,
  hideMessage: () => {},
});

export const useIsInDevelopment = () => {
  const contextProps = useContext(context);
  return contextProps;
};

export const InDevelopmentProvider: FC<PropsWithChildren> = ({ children }) => {
  const [showInDevelopmentMessage, setShowInDevelopmentMessage] =
    useState(false);

  useEffect(() => {
    const isMessageShown = window.localStorage.getItem(LOCALSTORAGE_KEY);

    setShowInDevelopmentMessage(!isMessageShown);
  }, []);

  const hideMessage = () => {
    setShowInDevelopmentMessage(false);
    window.localStorage.setItem(LOCALSTORAGE_KEY, 'true');
  };

  return (
    <context.Provider value={{ hideMessage, showInDevelopmentMessage }}>
      {showInDevelopmentMessage ? <InDevelopment /> : children}
    </context.Provider>
  );
};
