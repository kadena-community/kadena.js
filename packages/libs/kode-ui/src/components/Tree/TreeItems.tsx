'use client';
import { MonoCake, MonoExpandMore } from '@kadena/react-icons/system';
import classNames from 'classnames';
import type { FC } from 'react';
import React, { useState } from 'react';
import {
  treeBranchWrapperVariant,
  treeTitleClass,
  treeTitleClassWrapper,
  treeTitleVariant,
  treeToggleClass,
  treeToggleVariant,
  treeWrapperClass,
} from './Tree.css';

interface ITreeItemProps {
  title?: React.ReactNode;
  items?: Omit<ITreeItemProps, 'linked'>[];
  isOpen?: boolean;
  linked?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export const TreeItem: FC<ITreeItemProps> = ({
  title,
  items,
  isOpen,
  linked = false,
  onOpen,
  onClose,
}) => {
  const hasTitle = !!title;
  const hasChildren = !!items?.length;
  const initialExpandedChildren: number[] = items
    ?.map((item, index) => (item.isOpen ? index : undefined))
    .filter((item) => item !== undefined) as number[];

  const [expandedChildren, setExpandedChildren] = useState<number[]>(
    initialExpandedChildren,
  );

  const handleExpandChildren = (index: number): void => {
    if (linked) {
      expandedChildren.forEach((childrenIndex) =>
        items?.[childrenIndex]?.onClose?.(),
      );
      setExpandedChildren([index]);
    } else setExpandedChildren([...expandedChildren, index]);

    items?.[index]?.onOpen?.();
  };

  const handleCollapseChildren = (index: number): void => {
    setExpandedChildren(expandedChildren.filter((item) => item !== index));
    items?.[index]?.onClose?.();
  };

  const handleToggle = (): void => {
    if (!hasChildren) return;
    if (isOpen) onClose?.();
    else onOpen?.();
  };

  return (
    <div className={treeWrapperClass} data-testid="kda-tree-item" role="tree">
      {hasTitle && (
        <div
          className={classNames(treeTitleClassWrapper, { isOpen })}
          onClick={handleToggle}
          role="treeitem"
          aria-selected={Boolean(isOpen)}
          data-testid="kda-tree-title"
        >
          <span
            className={classNames(
              treeToggleClass,
              treeToggleVariant[isOpen ? 'opened' : 'closed'],
            )}
          >
            {hasChildren ? <MonoExpandMore /> : <MonoCake />}
          </span>
          <span
            className={classNames(
              treeTitleClass,
              treeTitleVariant[hasChildren ? 'isParent' : 'isChild'],
            )}
          >
            {title}
          </span>
        </div>
      )}

      {isOpen && (
        <div
          className={
            treeBranchWrapperVariant[hasTitle ? 'isChild' : 'isParent']
          }
        >
          {items?.map((item, index) => (
            <TreeItem
              key={String(item.title)}
              title={item.title}
              items={item?.items ?? []}
              isOpen={expandedChildren.includes(index)}
              onOpen={() => handleExpandChildren(index)}
              onClose={() => handleCollapseChildren(index)}
              linked={Boolean(linked)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
