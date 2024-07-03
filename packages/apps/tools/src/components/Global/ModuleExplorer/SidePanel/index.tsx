import {
  MonoArrowDropDown,
  MonoArrowRight,
  MonoMenuOpen,
  MonoSearch,
  MonoVerticalSplit,
} from '@kadena/kode-icons/system';

import type { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import { Button, Heading, Stack } from '@kadena/kode-ui';
import React, { useState } from 'react';
import CustomAccordion from '../../CustomAccordion/CustomAccordion';
import type { ICustomTreeProps, TreeItem } from '../../CustomTree/CustomTree';
import CustomTree from '../../CustomTree/CustomTree';
import type { ISearchBarProps } from './search-bar';
import Search from './search-bar';
import {
  containerStyle,
  customAccordionItemStyle,
  headingStyles,
  iconStyles,
  itemStyle,
} from './styles.css';

export interface ISidePanelProps<T> {
  items: ICustomTreeProps<T>['items'];
  isLoading?: boolean;
  onReload: ICustomTreeProps<T>['onReload'];
  onModuleClick: (module: TreeItem<T>) => void;
  onExpandCollapse: (item: TreeItem<T>, expanded: boolean) => void;
  onSearch: ISearchBarProps['onSearch'];
  searchHitsCount: number;
}

function SidePanel<T>({
  items,
  onReload,
  onModuleClick,
  onExpandCollapse,
  onSearch,
  searchHitsCount,
}: ISidePanelProps<T>) {
  const [showSearch, setShowSearch] = useState(false);
  return (
    <CustomAccordion
      items={items}
      defaultExpandedKey="explorer"
      className={containerStyle}
      itemProps={{ fillHeight: true, className: customAccordionItemStyle }}
    >
      {(item) => (
        <>
          <Stack
            backgroundColor="surface.default"
            justifyContent="space-between"
            alignItems={'center'}
            gap={'xxs'}
            role="button"
            onClick={item.toggleExpandCollapse}
            className={itemStyle}
          >
            {item.data.title === 'Explorer' ? (
              <MonoVerticalSplit className={iconStyles} />
            ) : (
              <MonoMenuOpen className={iconStyles} />
            )}
            <Heading variant="h6" className={headingStyles}>
              {item.data.title}
            </Heading>
            {item.data.supportsSearch ? (
              <Button
                isCompact
                variant="transparent"
                onPress={() => {
                  setShowSearch(!showSearch);
                }}
              >
                <MonoSearch />
              </Button>
            ) : null}
            <Button
              isCompact
              variant="transparent"
              onPress={item.toggleExpandCollapse}
            >
              {item.isExpanded ? <MonoArrowDropDown /> : <MonoArrowRight />}
            </Button>
          </Stack>
          {item.isExpanded ? (
            <>
              {item.data.supportsSearch && showSearch ? (
                <Search
                  networks={item.data.children.map(
                    (x) => x.key as ChainwebNetworkId,
                  )}
                  onSearch={onSearch}
                  hitsCount={searchHitsCount}
                />
              ) : null}
              <CustomTree
                items={item.data.children}
                onReload={onReload}
                onItemClick={onModuleClick}
                onExpandCollapse={onExpandCollapse}
                {...item.accessibilityProps}
              />
            </>
          ) : null}
        </>
      )}
    </CustomAccordion>
  );
}

export default SidePanel;
