import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useMedia } from 'react-use';
import { Stack } from './../../../components';
import { breakpoints } from './../../../styles';
import { useLayout } from './LayoutProvider';
import type { ISideBarItemProps } from './SideBarItem';
import { SideBarItem } from './SideBarItem';
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
}) => {
  const { isExpanded, handleSetExpanded } = useLayout();

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
    if (!isExpanded) {
      setTreeIsExpanded(false);
    } else {
      setTreeIsExpanded(getLocalStorageToggle(label));
    }
  }, [isExpanded]);

  const toggleTree = () => {
    if (!isExpanded) handleSetExpanded(true);

    const innerExpanded = !treeisExpaned;
    setLocalStorageToggle(label, innerExpanded);
    setTreeIsExpanded(innerExpanded);
  };

  return (
    <Stack onClick={toggleTree}>
      <SideBarItem
        visual={visual}
        label={label}
        tree={
          !!(children && isExpanded && treeisExpaned) && (
            <ul className={sidebartreeListClass}>{children}</ul>
          )
        }
      ></SideBarItem>
    </Stack>
  );
};
