import { MonoArrowDropDown, MonoArrowRight } from '@kadena/kode-icons/system';
import { Badge, Button, Stack, Text } from '@kadena/kode-ui';
import { ellipsis, monospaceSmallestRegular } from '@kadena/kode-ui/styles';
import classNames from 'classnames';
import React from 'react';
import type { ICustomAccordionProps } from '../CustomAccordion/CustomAccordion';
import CustomAccordion from '../CustomAccordion/CustomAccordion';
import type { TreeItem } from './CustomTree';
import {
  activeItemContainerStyle,
  activeItemStyles,
  firstLevelTreeNodeStyles,
  itemBadgeStyle,
  itemContainerStyle,
  itemTitleStyle,
} from './CustomTree.css';

export interface INodeProps<T>
  extends Omit<ICustomAccordionProps<T>, 'items' | 'children'> {
  items: TreeItem<T>[];
  level: number;
  onItemClick: (item: TreeItem<T>) => void;
  onExpandCollapse: (item: TreeItem<T>, expanded: boolean) => void;
  isActive?: boolean;
}

function Node<T>({
  items,
  level,
  onItemClick,
  onExpandCollapse,
  isActive,
  ...rest
}: INodeProps<T>) {
  return (
    <CustomAccordion
      {...rest}
      items={items}
      itemProps={{
        className: classNames({
          [firstLevelTreeNodeStyles]: level === 1,
          [activeItemStyles]: isActive,
        }),
      }}
    >
      {(child) => {
        const hasChildren = !!child.data.children.length;
        const hasActiveChild = child.data.children.some(
          (item) => item.isActive,
        );
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
              className={classNames(itemContainerStyle, {
                [activeItemContainerStyle]: hasActiveChild,
              })}
              style={{
                paddingInlineStart: `${level * 20 + (!hasChildren ? 40 : 0)}px`,
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
              <Text className={itemTitleStyle} bold={hasActiveChild}>
                {child.data.title}
              </Text>
              {child.data.label ? (
                <Badge
                  size="sm"
                  className={classNames(
                    monospaceSmallestRegular,
                    ellipsis,
                    itemBadgeStyle,
                  )}
                  style={child.data.isActive ? 'info' : undefined}
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
                items={child.data.children}
                level={level + 1}
                onItemClick={onItemClick}
                onExpandCollapse={onExpandCollapse}
                isActive={child.data.isActive || hasActiveChild}
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
