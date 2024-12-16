import { createContext, PropsWithChildren, useContext, useState } from 'react';

interface IGlobalState {
  origin: string;
  setOrigin: (origin: string) => void;
}

const context = createContext<IGlobalState>({
  origin: '/',
  setOrigin: () => {},
});

export const useGlobalState = () => {
  return useContext(context);
};

export const GlobalStateProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [origin, setOrigin] = useState<string>('/');
  return (
    <context.Provider value={{ origin, setOrigin }}>
      {children}
    </context.Provider>
  );
};
