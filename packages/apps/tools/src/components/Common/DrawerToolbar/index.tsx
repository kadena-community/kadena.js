import { IconButton, SystemIcon, Text } from '@kadena/react-ui';

import {
  buttonWrapperClass,
  expandedDrawerContentClass,
  expandedDrawerTitleClass,
  gridItemCollapsedSidebarStyle,
} from './styles.css';

import classNames from 'classnames';
import React, {
  type ReactNode,
  forwardRef,
  ForwardRefExoticComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';

export interface IDrawerToolbarSection {
  icon: (typeof SystemIcon)[keyof typeof SystemIcon];
  title: string;
  children: ReactNode;
}
interface IProps {
  initialOpenItem?: boolean;
  sections: IDrawerToolbarSection[];
}

export const DrawerToolbar: ForwardRefExoticComponent<
  Omit<IProps, 'ref'> & React.RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, IProps>(function DrawerToolbar(
  { sections, initialOpenItem = false },
  ref = null,
) {
  const [visibleSection, setVisibleSection] = useState<number | null>(
    initialOpenItem ? 0 : null,
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

  // useEffect(() => {
  //   if (ref) {
  //     // @ts-ignore
  //     ref.openSection = handleOpenSection;
  //   }
  // }, [handleOpenSection, ref]);

  return (
    <aside className={classNames(gridItemCollapsedSidebarStyle, { isOpen })}>
      {!isOpen && (
        <div>
          {sections.map(({ icon: Icon, title }, index) => (
            <div className={buttonWrapperClass} key={title}>
              <IconButton
                icon={Icon}
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
});

export default DrawerToolbar;
