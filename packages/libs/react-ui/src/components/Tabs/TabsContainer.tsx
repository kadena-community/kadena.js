import { Tab } from './Tab';
import { TabContent } from './TabContent';
import { selectorLine, tabsContainer } from './Tabs.css';

import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';

export interface ITabsContainerProps {
  children?: ReactNode;
  defaultSelected?: string;
}

export const TabsContainer: FC<ITabsContainerProps> = ({
  children,
  defaultSelected = '',
}) => {
  const [selectedTab, setSelectedTab] = useState<string>(defaultSelected);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedUnderlineRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !selectedUnderlineRef.current) return;
    //find the selectedTab
    const selected = containerRef.current.querySelector(
      '[data-selected="true"]',
    ) as HTMLButtonElement;
    if (selected === undefined) return;

    // set position of the bottom line
    selectedUnderlineRef.current.style.setProperty(
      'transform',
      `translateX(${selected.offsetLeft}px)`,
    );
    selectedUnderlineRef.current.style.setProperty(
      'width',
      `${selected.offsetWidth}px`,
    );
  }, [containerRef, selectedTab, selectedUnderlineRef]);

  const handleClick = (value: string): void => {
    setSelectedTab(value);
  };

  return (
    <section>
      <div ref={containerRef} className={tabsContainer}>
        {React.Children.map(children, (child, idx) => {
          if (!React.isValidElement(child)) return null;

          if (child.type === Tab) {
            const props = {
              ...child.props,
              selected: selectedTab === child.props.value,
              handleClick,
            };
            return React.cloneElement(child, props);
          }
          return null;
        })}

        <span ref={selectedUnderlineRef} className={selectorLine}></span>
      </div>

      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return null;

        if (child.type === TabContent) {
          const props = {
            selected: selectedTab === child.props.value,
          };
          return React.cloneElement(child, props);
        }

        return null;
      })}
    </section>
  );
};
