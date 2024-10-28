import type { FC, PropsWithChildren } from 'react';
import React, { createContext, useContext, useState } from 'react';
import type { PressEvent } from 'react-aria';

export interface ISideBarContext {
  isExpanded: boolean;
  handleToggleExpand: (e: PressEvent) => void;
}
export const SideBarContext = createContext<ISideBarContext>({
  isExpanded: true,
  handleToggleExpand: () => {},
});
export const useSideBar = (): ISideBarContext => useContext(SideBarContext);

export interface ISideBarProvider extends PropsWithChildren {}

export const SideBarProvider: FC<ISideBarProvider> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggleExpand = (e: PressEvent) => {
    setIsExpanded((v) => !v);
  };
  return (
    <SideBarContext.Provider value={{ isExpanded, handleToggleExpand }}>
      {children}
    </SideBarContext.Provider>
  );
};
