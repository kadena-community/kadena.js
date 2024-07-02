import {
  MonoArrowDropDown,
  MonoArrowRight,
  MonoCached,
} from '@kadena/react-icons/system';
import { Badge, Button, Stack, Text } from '@kadena/kode-ui';
import classNames from 'classnames';
import React, { useCallback } from 'react';
import type { ICustomAccordionProps } from '../CustomAccordion/CustomAccordion';
import CustomAccordion from '../CustomAccordion/CustomAccordion';
import {
  containerStyle,
  itemContainerStyle,
  itemTitleStyle,
  reloadButtonStyles,
  reloadIconStyles,
  reloadLoadingStyles,
  topLevelItemContainerStyle,
} from './CustomTree.css';
import CustomTreeNode from './CustomTreeNode';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type TreeItem<T> = {
  title: string;
  key: React.Key;
  children: TreeItem<T>[];
  data: T;
  isLoading?: boolean;
  supportsReload?: boolean;
  supportsSearch?: boolean;
  label?: string | number;
  isActive?: boolean;
};

export interface ICustomTreeProps<T>
  extends Omit<ICustomAccordionProps<T>, 'children' | 'items'> {
  items: TreeItem<T>[];
  onReload: (item: TreeItem<T>) => void;
  onItemClick: (item: TreeItem<T>) => void;
  onExpandCollapse: (item: TreeItem<T>, expanded: boolean) => void;
}

function CustomTree<T>({
  items,
  onReload,
  onItemClick,
  onExpandCollapse,
  className,
  ...rest
}: ICustomTreeProps<T>) {
  return (
    <CustomAccordion
      {...rest}
      items={items}
      className={classNames(containerStyle, className)}
    >
      {(item) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const toggleHandler = useCallback(() => {
          item.toggleExpandCollapse();

          // We "toggle" the expanded state ourselves since this is still the previous state
          onExpandCollapse(item.data, !item.isExpanded);
        }, [item]);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const onReloadCallback = useCallback(() => {
          onReload(item.data);
        }, [item]);

        return (
          <>
            <Stack
              alignItems={'center'}
              justifyContent={'space-between'}
              onClick={toggleHandler}
              role="button"
              className={classNames(
                itemContainerStyle,
                topLevelItemContainerStyle,
              )}
            >
              <Button variant="transparent" onPress={toggleHandler}>
                {item.isExpanded ? <MonoArrowDropDown /> : <MonoArrowRight />}
              </Button>
              <Text className={itemTitleStyle} bold>
                {item.data.title}
              </Text>
              {item.data.supportsReload && !item.data.isLoading ? (
                <Button
                  variant="transparent"
                  isCompact
                  onPress={onReloadCallback}
                  className={reloadButtonStyles}
                >
                  <MonoCached
                    className={classNames(reloadIconStyles, {
                      [reloadLoadingStyles]: item.data.isLoading,
                    })}
                  />
                </Button>
              ) : null}
              {!item.data.isLoading && item.data.label ? (
                <Badge size="sm" style={'highContrast'}>
                  {item.data.label}
                </Badge>
              ) : null}
              {item.data.isLoading ? (
                <Badge size="sm" style={'highContrast'}>
                  Loading
                </Badge>
              ) : null}
            </Stack>
            {item.isExpanded ? (
              <CustomTreeNode
                items={item.data.children}
                level={1}
                onItemClick={onItemClick}
                onExpandCollapse={onExpandCollapse}
                {...item.accessibilityProps}
              />
            ) : null}
          </>
        );
      }}
    </CustomAccordion>
  );
}

export default CustomTree;
