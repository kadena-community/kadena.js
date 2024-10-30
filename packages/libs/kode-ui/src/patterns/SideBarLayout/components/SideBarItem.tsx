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
  label,
  onPress,
  children,
}) => {
  const { isExpanded, handleSetExpanded } = useSideBar();
  const isMediumDevice = useMedia(breakpoints.md, true);

  useEffect(() => {
    handleSetExpanded(isMediumDevice ? true : false);
  }, [isMediumDevice]);

  const handlePress = (e: PressEvent) => {
    if (!isMediumDevice) handleSetExpanded(false);

    onPress(e);
  };

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
              onPress={handlePress}
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
                onPress={handlePress}
                startVisual={visual}
                isCompact
              />
            ) : (
              <Button
                aria-label={label}
                onPress={handlePress}
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
};
