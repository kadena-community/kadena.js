import { createContext, ReactNode, useContext, useState } from 'react';

interface INavigationContext {
  route: string | null;
  navigate: (to: string | null) => void;
}

const context = createContext<INavigationContext>({
  route: null,
  navigate: () => {
    throw new Error('No navigation provider');
  },
});

// the useNavigate hook from react-router-dom doesn't work correctly in some cases so I did this workaround to fix it
export const NavigationContext = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<string | null>(null);
  return (
    <context.Provider
      value={{
        route: state,
        navigate: (to: string | null) => setState(to),
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useTheCorrectNavigateRoute = () => {
  return useContext(context);
};

export const useTheCorrectNavigate = () => {
  return useContext(context).navigate;
};
