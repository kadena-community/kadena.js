import type { FC, PropsWithChildren } from 'react';
import React, { useEffect } from 'react';
import { useMedia } from 'react-use';
import { listItemClass } from '../sidebar.css';
import type { PressEvent } from './../../../components/Button';
import { Button } from './../../../components/Button';
import { Media } from './../../../components/Media';
import { breakpoints } from './../../../styles';
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
  const { isExpanded, handleSetExpanded } = useSideBar();
  const isMediumDevice = useMedia(breakpoints.md, true);

  useEffect(() => {
    handleSetExpanded(isMediumDevice ? true : false);
  }, [isMediumDevice]);

  return (
    <li className={listItemClass}>
      {children ? (
        <>
          <Media greaterThanOrEqual="md" style={{ flex: 1, display: 'flex' }}>
            {children}
          </Media>
          <Media lessThan="md" style={{ flex: 1, display: 'flex' }}>
            {children}
          </Media>
        </>
      ) : (
        <>
          <Media lessThan="md" style={{ flex: 1, display: 'flex' }}>
            <Button
              variant="outlined"
              aria-label={label}
              onPress={onPress}
              startVisual={visual}
            >
              {label}
            </Button>
          </Media>
          <Media greaterThanOrEqual="md" style={{ flex: 1, display: 'flex' }}>
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
