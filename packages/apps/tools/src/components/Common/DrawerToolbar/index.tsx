import { IconButton, SystemIcon, Text } from '@kadena/react-ui';

import {
  buttonWrapperClass,
  expandedDrawerContentClass,
  expandedDrawerTitleClass,
  gridItemCollapsedSidebarStyle,
} from './styles.css';

import classNames from 'classnames';
import React, { type ReactNode, FC, useState } from 'react';

export interface IDrawerToolbarSection {
  icon: (typeof SystemIcon)[keyof typeof SystemIcon];
  title: string;
  children: ReactNode;
}
interface IProps {
  sections: IDrawerToolbarSection[];
}

export const DrawerToolbar: FC<IProps> = ({ sections }: IProps) => {
  const [visibleSection, setVisibleSection] = useState<number | null>(null);
  const isOpen = visibleSection !== null;

  return (
    <aside className={classNames(gridItemCollapsedSidebarStyle, { isOpen })}>
      {!isOpen && (
        <div>
          {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
          {sections.map(({ icon: Icon, title }, index) => (
            <div className={buttonWrapperClass} key={title}>
              <IconButton
                icon={Icon}
                title={title}
                onClick={() => setVisibleSection(index)}
              />
            </div>
          ))}
        </div>
      )}
      {isOpen && (
        <>
          <div className={expandedDrawerTitleClass}>
            <Text size="lg" bold>
              {sections[visibleSection].title}
            </Text>
            <IconButton
              onClick={() => setVisibleSection(null)}
              icon={SystemIcon.Close}
              title="close"
            />
          </div>
          <div className={expandedDrawerContentClass}>
            {sections[visibleSection].children}
          </div>
        </>
      )}
    </aside>
  );
};

export default DrawerToolbar;
