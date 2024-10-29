import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { listItemClass } from '../sidebar.css';
import type { PressEvent } from './../../../components/Button';
import { Button } from './../../../components/Button';
import { Media } from './../../../components/Media';
import { useSideBar } from './SideBarProvider';

export interface ISideBarItemProps extends PropsWithChildren {
  visual: React.ReactElement;
  label: string;
  onPress: (e: PressEvent) => void;
  isAppContext?: boolean;
}
export const SideBarItem: FC<ISideBarItemProps> = ({
  visual,
  isAppContext = false,
  label,
  onPress,
  children,
}) => {
  const { isExpanded } = useSideBar();

  return (
    <li className={listItemClass}>
      {children ? (
        children
      ) : (
        <>
          <Media lessThan="md">
            <Button aria-label={label} onPress={onPress} startVisual={visual} />
          </Media>
          <Media greaterThanOrEqual="md">
            {!isExpanded ? (
              <Button
                variant="outlined"
                aria-label={label}
                onPress={onPress}
                startVisual={visual}
                isCompact
              />
            ) : (
              <Button
                aria-label={label}
                onPress={onPress}
                startVisual={visual}
                variant="outlined"
              >
                {label}
              </Button>
            )}
          </Media>
        </>
      )}
    </li>
  );

  //     return (
  //     <Button
  //       {...props}
  //       startVisual={startVisual}
  //       variant={isAppContext ? 'primary' : 'transparent'}
  //     />
  //     );
  //     <Media lessThan="md">{children}</Media>
  //     <Media greaterThanOrEqual="md">
  //       {!isExpanded ? (
  //         <Button variant="transparent" startVisual={visual} />
  //       ) : (
  //         children
  //       )}
  //     </Media>
  //   </li>
  // );
};
