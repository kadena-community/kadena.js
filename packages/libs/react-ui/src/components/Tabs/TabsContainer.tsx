'use client';
import type { FC, ReactNode } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { Tab } from './Tab';
import { TabContent } from './TabContent';
import { selectorLine, tabsContainer, tabsContainerWrapper } from './Tabs.css';

export interface ITabsContainerProps {
  children?: ReactNode;
  initialTab?: string;
  currentTab?: string;
}

export const TabsContainer: FC<ITabsContainerProps> = ({
  children,
  initialTab = undefined,
  currentTab = undefined,
}) => {
  const [_activeTab, setActiveTab] = useState(initialTab);
  const activeTab = currentTab || _activeTab;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedUnderlineRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !selectedUnderlineRef.current) return;
    //find the selectedTab
    let selected = containerRef.current.querySelector(
      '[data-selected="true"]',
    ) as HTMLButtonElement;

    if (selected === undefined || selected === null) {
      selected = containerRef.current.querySelectorAll(
        'button',
      )[0] as HTMLButtonElement;
    }

    // set position of the bottom line
    selectedUnderlineRef.current.style.setProperty(
      'transform',
      `translateX(${selected.offsetLeft}px)`,
    );
    selectedUnderlineRef.current.style.setProperty(
      'width',
      `${selected.offsetWidth}px`,
    );
  }, [containerRef, activeTab, selectedUnderlineRef]);

  const handleClick = (tabId: string): void => {
    setActiveTab(tabId);
  };

  return (
    <section>
      <div className={tabsContainerWrapper}>
        <div ref={containerRef} className={tabsContainer}>
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return null;

            if (child.type === Tab) {
              const props = {
                ...child.props,
                key: child.props.id,
                selected: activeTab === child.props.id,
                handleClick,
              };
              return React.cloneElement(child, props);
            }
            return null;
          })}

          <span ref={selectedUnderlineRef} className={selectorLine}></span>
        </div>
      </div>

      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;

        if (child.type === TabContent) {
          const props = {
            selected: activeTab === child.props.id,
          };
          return React.cloneElement(child, props);
        }

        return null;
      })}
    </section>
  );
};
