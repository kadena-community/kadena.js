import { Accordion, IconButton, Tree } from '@kadena/react-ui';

import { gridItemMenuStyle, subMenuTitleClass } from './styles.css';

import { useLayoutContext } from '@/context';
import { FC } from 'react';

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
      <Accordion
        sections={
          activeMenu.items?.map((item) => ({
            title: '', // @todo: fix Type error: Property 'title' does not exist on type 'ISidebarSubMenuItem'.
            children: <Tree isOpen={true} items={item.items} />,
          })) ?? []
        }
      />
    </div>
  );
};
