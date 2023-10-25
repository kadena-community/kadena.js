import type { SystemIcon } from '@kadena/react-ui';
import { IconButton, Text } from '@kadena/react-ui';
import classNames from 'classnames';
import type { ForwardRefExoticComponent, ReactNode } from 'react';
import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import {
  buttonWrapperClass,
  expandedDrawerContentClass,
  expandedDrawerTitleClass,
  gridItemCollapsedSidebarStyle,
} from './styles.css';

export interface IDrawerToolbarSection {
  icon: keyof typeof SystemIcon;
  title: string;
  children: ReactNode;
}
interface IProps {
  initialOpenItem?: number | undefined;
  sections: IDrawerToolbarSection[];
}

export const DrawerToolbar: ForwardRefExoticComponent<
  Omit<IProps, 'ref'> & React.RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, IProps>(function DrawerToolbar(
  { sections, initialOpenItem = undefined },
  ref = null,
) {
  const [visibleSection, setVisibleSection] = useState<number | null>(
    initialOpenItem !== undefined ? initialOpenItem : null,
  );
  const isOpen = visibleSection !== null;

  const handleOpenSection = useCallback(
    (index: number): void => {
      if (sections?.[index]) {
        setVisibleSection(index);
      }
    },
    [sections],
  );

  useEffect(() => {
    if (ref) {
      // @ts-ignore
      ref.openSection = handleOpenSection;
    }
  }, [handleOpenSection, ref]);

  return (
    <aside className={classNames(gridItemCollapsedSidebarStyle, { isOpen })}>
      {!isOpen && (
        <div>
          {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
          {sections.map(({ icon, title }, index) => (
            <div className={buttonWrapperClass} key={title}>
              <IconButton
                icon={icon}
                title={title}
                onClick={() => handleOpenSection(index)}
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
              icon="Close"
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
});

export default DrawerToolbar;
