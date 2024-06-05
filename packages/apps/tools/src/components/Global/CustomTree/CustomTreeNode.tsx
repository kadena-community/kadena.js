import { MonoArrowDropDown, MonoArrowRight } from '@kadena/react-icons/system';
import { Badge, Button, Stack, Text } from '@kadena/react-ui';
import { ellipsis, monospaceSmallestRegular } from '@kadena/react-ui/styles';
import classNames from 'classnames';
import React from 'react';
import type { ICustomAccordionProps } from '../CustomAccordion/CustomAccordion';
import CustomAccordion from '../CustomAccordion/CustomAccordion';
import type { TreeItem } from './CustomTree';
import {
  firstLevelTreeNodeStyles,
  itemBadgeStyle,
  itemContainerStyle,
  itemTitleStyle,
} from './CustomTree.css';

export interface INodeProps<T>
  extends Omit<ICustomAccordionProps<T>, 'data' | 'children'> {
  data: TreeItem<T>[];
  level: number;
  onItemClick: (item: TreeItem<T>) => void;
  onExpandCollapse: (item: TreeItem<T>, expanded: boolean) => void;
}

function Node<T>({
  data,
  level,
  onItemClick,
  onExpandCollapse,
  ...rest
}: INodeProps<T>) {
  return (
    <CustomAccordion
      {...rest}
      data={data}
      itemProps={{
        className: classNames({ [firstLevelTreeNodeStyles]: level === 1 }),
      }}
    >
      {(child) => {
        const hasChildren = !!child.data.children.length;
        return (
          <>
            <Stack
              alignItems={'center'}
              justifyContent={'space-between'}
              onClick={() => {
                if (child.data.children.length) {
                  child.toggleExpandCollapse();

                  // We "toggle" the expanded state ourselves since this is still the previous state
                  onExpandCollapse(child.data, !child.isExpanded);
                } else {
                  onItemClick(child.data);
                }
              }}
              role="button"
              className={itemContainerStyle}
              style={{
                paddingInlineStart: `${level * 20 + (!hasChildren ? 20 : 0)}px`,
                cursor: hasChildren ? 'default' : 'pointer',
              }}
            >
              {hasChildren ? (
                <Button
                  variant="transparent"
                  onClick={() => {
                    child.toggleExpandCollapse();

                    // We "toggle" the expanded state ourselves since this is still the previous state
                    onExpandCollapse(child.data, !child.isExpanded);
                  }}
                >
                  {child.isExpanded ? (
                    <MonoArrowDropDown />
                  ) : (
                    <MonoArrowRight />
                  )}
                </Button>
              ) : null}
              <Text className={itemTitleStyle}>{child.data.title}</Text>
              {child.data.label ? (
                <Badge
                  size="sm"
                  className={classNames(
                    monospaceSmallestRegular,
                    ellipsis,
                    itemBadgeStyle,
                  )}
                >
                  {child.data.label}
                </Badge>
              ) : null}
              {hasChildren ? (
                <Badge size="sm" style={'highContrast'}>
                  {child.data.children.length}
                </Badge>
              ) : null}
            </Stack>
            {child.isExpanded && hasChildren ? (
              <Node
                data={child.data.children}
                level={level + 1}
                onItemClick={onItemClick}
                onExpandCollapse={onExpandCollapse}
                {...child.accessibilityProps}
              />
            ) : null}
          </>
        );
      }}
    </CustomAccordion>
  );
}

export default Node;
