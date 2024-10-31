import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useMedia } from 'react-use';
import { listItemClass } from '../sidebar.css';
import type { PressEvent } from './../../../components/Button';
import { Button } from './../../../components/Button';
import { Media } from './../../../components/Media';
import { breakpoints } from './../../../styles';
import type { ISideBarItemProps } from './SideBarItem';
import { useSideBar } from './SideBarProvider';

export type ISideBarTreeProps = Omit<ISideBarItemProps, 'onPress'>;
export const SideBarTree: FC<ISideBarTreeProps> = ({
  visual,
  label,
  children,
}) => {
  const { isExpanded, handleSetExpanded } = useSideBar();
  const [treeisExpaned, setTreeIsExpanded] = useState(true);
  const isMediumDevice = useMedia(breakpoints.md, true);

  useEffect(() => {
    handleSetExpanded(isMediumDevice ? true : false);
    setTreeIsExpanded(isMediumDevice ? true : false);
  }, [isMediumDevice]);

  useEffect(() => {
    if (!isExpanded) setTreeIsExpanded(false);
  }, [isExpanded]);

  const toggleTree = (e: PressEvent) => {
    if (!isExpanded) handleSetExpanded(true);
    setTreeIsExpanded((v) => !v);
  };
  return (
    <li className={listItemClass}>
      <>
        <Media lessThan="md" style={{ flex: 1, display: 'flex' }}>
          <Button
            variant="transparent"
            aria-label={label}
            onPress={toggleTree}
            startVisual={visual}
          >
            {label}
          </Button>
        </Media>
        <Media greaterThanOrEqual="md" style={{ flex: 1, display: 'flex' }}>
          {!isExpanded ? (
            <Button
              variant="transparent"
              aria-label={label}
              onPress={toggleTree}
              startVisual={visual}
              isCompact
            />
          ) : (
            <Button
              aria-label={label}
              onPress={toggleTree}
              startVisual={visual}
              variant="transparent"
            >
              {label}
            </Button>
          )}
        </Media>

        {children && isExpanded && treeisExpaned && <ul>{children}</ul>}
      </>
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
