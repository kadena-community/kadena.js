import { useLayoutContext } from '@/context';
import { Accordion, IconButton, Tree } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import { gridItemMenuStyle, subMenuTitleClass } from './styles.css';

export const Menu: FC = () => {
  const { activeMenu, setActiveMenuIndex } = useLayoutContext();
  if (!activeMenu) return null;

  return (
    <div className={gridItemMenuStyle}>
      <div className={subMenuTitleClass}>
        <span>{activeMenu.title}</span>
        <IconButton
          icon={'Close'}
          onClick={() => setActiveMenuIndex(undefined)}
          title={activeMenu.title}
        />
      </div>
      <Accordion.Root>
        {activeMenu.items?.map((item, index) => (
          <Accordion.Section title="" key={index}>
            <Tree isOpen={true} items={item.items} />
          </Accordion.Section>
        ))}
      </Accordion.Root>
    </div>
  );
};
