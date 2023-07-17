import { SystemIcon } from '../Icon';

import {
  treeBranchWrapperVariant,
  treeTitleClass,
  treeTitleClassWrapper,
  treeTitleVariant,
  treeToggleClass,
  treeToggleVariant,
  treeWrapperClass,
} from './TreeList.css';

import classNames from 'classnames';
import React, { FC, useState } from 'react';

export interface ITreeListProps {
  title?: React.ReactNode;
  items?: ITreeListProps[];
  isOpen?: boolean;
}

export const TreeList: FC<ITreeListProps> = ({
  title,
  items,
  isOpen: initialOpenStatus,
}) => {
  const hasTitle = !!title;
  const hasChildren = !!items?.length;

  const [isOpen, setIsOpen] = useState(
    hasTitle ? initialOpenStatus ?? false : true,
  );

  return (
    <div className={treeWrapperClass} data-testid="kda-tree-list" role="tree">
      {hasTitle && (
        <div
          className={classNames(treeTitleClassWrapper, { isOpen })}
          onClick={() => setIsOpen(!isOpen)}
          role="treeitem"
          aria-selected={isOpen}
          data-testid="kda-tree-title"
        >
          <span
            className={classNames(
              treeToggleClass,
              treeToggleVariant[isOpen ? 'opened' : 'closed'],
            )}
          >
            {hasChildren ? (
              <SystemIcon.ChevronDown size="md" />
            ) : (
              <SystemIcon.Circle size="md" />
            )}
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
            <TreeList
              key={index}
              title={item.title}
              items={item?.items ?? []}
            />
          ))}
        </div>
      )}
    </div>
  );
};
