import type { FC, PropsWithChildren } from 'react';
import React, { createContext, useContext, useState } from 'react';
import type { PressEvent } from 'react-aria';

export interface IAppContextProps {
  visual: React.ReactElement;
  label: string;
  onPress: () => void;
}
export interface ISideBarContext {
  isExpanded: boolean;
  handleToggleExpand: (e: PressEvent) => void;
  appContext?: IAppContextProps;
  setAppContext: (context: IAppContextProps) => void;
}
export const SideBarContext = createContext<ISideBarContext>({
  isExpanded: true,
  handleToggleExpand: () => {},
  appContext: undefined,
  setAppContext: () => {},
});
export const useSideBar = (): ISideBarContext => useContext(SideBarContext);

export interface ISideBarProvider extends PropsWithChildren {}

export const SideBarProvider: FC<ISideBarProvider> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [appContext, setAppContextState] = useState<
    IAppContextProps | undefined
  >();

  const handleToggleExpand = (e: PressEvent) => {
    setIsExpanded((v) => !v);
  };

  const setAppContext = (context: IAppContextProps) => {
    setAppContextState(context);
  };
  return (
    <SideBarContext.Provider
      value={{ isExpanded, handleToggleExpand, appContext, setAppContext }}
    >
      {children}
    </SideBarContext.Provider>
  );
};
