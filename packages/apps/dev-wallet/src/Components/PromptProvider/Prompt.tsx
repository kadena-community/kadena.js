import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

const context = createContext<(elm: JSX.Element | null) => void>(() => {
  throw new Error('PromptProvider not found');
});

export const PromptProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [prompt, setPrompt] = useState<JSX.Element | null>(null);
  return (
    <context.Provider value={setPrompt}>
      {prompt && <div className="prompt-container">{prompt}</div>}
      {children}
    </context.Provider>
  );
};

export type PromptFunction = (
  render: (
    resolve: (data?: any) => void,
    reject: (data?: any) => void,
  ) => JSX.Element,
) => Promise<unknown>;

export const usePrompt = () => {
  const setPrompt = useContext(context);
  return useCallback(
    (
      render: (
        resolve: (data?: any) => void,
        reject: (data?: any) => void,
      ) => JSX.Element,
    ) => {
      return new Promise((resolve, reject) => {
        setPrompt(render(resolve, reject));
      }).finally(() => {
        setPrompt(null);
      });
    },
    [setPrompt],
  );
};
