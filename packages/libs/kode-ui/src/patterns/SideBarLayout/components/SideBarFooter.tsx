import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { footerWrapperClass } from '../sidebar.css';
import { SideBarFooterItem } from './SideBarFooterItem';
import { useSideBar } from './SideBarProvider';

interface IProps extends PropsWithChildren {}

export const SideBarFooter: FC<IProps> = ({ children }) => {
  const { appContext } = useSideBar();
  const buttonCount = React.Children.count(children);

  return (
    <footer className={footerWrapperClass}>
      {buttonCount === 0 && appContext && (
        <SideBarFooterItem {...appContext} isAppContext />
      )}
      {React.Children.map(children, (child, idx) => {
        if (idx === Math.floor(buttonCount / 2) && appContext) {
          return (
            <>
              <SideBarFooterItem {...appContext} isAppContext />
              <>{child}</>
            </>
          );
        }
        return child;
      })}
    </footer>
  );
};
