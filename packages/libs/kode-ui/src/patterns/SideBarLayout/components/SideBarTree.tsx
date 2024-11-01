import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useMedia } from 'react-use';
import { listItemClass } from '../sidebar.css';
import type { PressEvent } from './../../../components/Button';
import { Button } from './../../../components/Button';
import { Link } from './../../../components/Link';
import { Media } from './../../../components/Media';
import { breakpoints } from './../../../styles';
import type { ISideBarItemProps } from './SideBarItem';
import { useSideBar } from './SideBarProvider';
import { sidebartreeListClass } from './sidebartree.css';

const LOCALSTORAGEKEY = 'sidemenu';

const setLocalStorageToggle = (label: string, isExpanded: boolean) => {
  const storage = JSON.parse(localStorage.getItem(LOCALSTORAGEKEY) ?? '{}');
  storage[`${label}`] = isExpanded;
  localStorage.setItem(LOCALSTORAGEKEY, JSON.stringify(storage));
};
const getLocalStorageToggle = (label: string) => {
  const storage = JSON.parse(localStorage.getItem(LOCALSTORAGEKEY) ?? '{}');
  return storage[`${label}`] ?? true;
};

export type ISideBarTreeProps = Omit<ISideBarItemProps, 'onPress'>;
export const SideBarTree: FC<ISideBarTreeProps> = ({
  visual,
  label,
  children,
  href,
  component,
}) => {
  const { isExpanded, handleSetExpanded } = useSideBar();

  const [isMounted, setIsMounted] = useState(false);
  const [treeisExpaned, setTreeIsExpanded] = useState(true);
  const isMediumDevice = useMedia(breakpoints.md, true);

  useEffect(() => {
    handleSetExpanded(isMediumDevice ? true : false);
    setTreeIsExpanded(isMediumDevice ? true : false);
  }, [isMediumDevice]);

  useEffect(() => {
    if (!isMounted) {
      setTreeIsExpanded(getLocalStorageToggle(label));
      setIsMounted(true);
      return;
    }
    if (!isExpanded) setTreeIsExpanded(false);
  }, [isExpanded]);

  const toggleTree = (e: PressEvent) => {
    if (!isExpanded) handleSetExpanded(true);

    const innerExpanded = !treeisExpaned;
    setLocalStorageToggle(label, innerExpanded);
    setTreeIsExpanded(innerExpanded);
  };

  const Component = href ? Link : Button;

  return (
    <li className={listItemClass}>
      <>
        <Media lessThan="md" style={{ flex: 1, display: 'flex' }}>
          <Component
            href={href}
            component={component}
            variant="transparent"
            aria-label={label}
            onPress={toggleTree}
            isCompact
            startVisual={visual}
          >
            {label}
          </Component>
        </Media>
        <Media greaterThanOrEqual="md" style={{ flex: 1, display: 'flex' }}>
          {!isExpanded ? (
            <Component
              href={href}
              component={component}
              variant="transparent"
              aria-label={label}
              onPress={toggleTree}
              isCompact
              startVisual={visual}
            />
          ) : (
            <Component
              href={href}
              component={component}
              aria-label={label}
              onPress={toggleTree}
              startVisual={visual}
              isCompact
              variant="transparent"
            >
              {label}
            </Component>
          )}
        </Media>

        {children && isExpanded && treeisExpaned && (
          <ul className={sidebartreeListClass}>{children}</ul>
        )}
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
