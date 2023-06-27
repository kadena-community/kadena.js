'use client';

import styles from './vertical-tabs.module.scss';

import React, { ReactNode, useState } from 'react';

interface IVerticalTab {
  title: string;
  description: string;
  content: ReactNode;
};

interface IProps {
  tabs: Array<IVerticalTab>;
}

export function VerticalTabs({ tabs }: IProps) : JSX.Element {

  const [selectedTab, setSelectedTab] = useState<number>(0);

  const onTabChange = (index: number): void => {
    setSelectedTab(index);
  };

  return (
    <div className={styles.tabs}>
      <div className={styles['tabs-panel']}>
        {tabs.map((tab, index) => (
          <div 
            key={index}
            className={`${styles['tab-selector']} ${
              selectedTab === index ? styles['tab-selector-active'] : ''
            }`}
            onMouseEnter={() => onTabChange(index)}
          >
            <p className={styles['tab-title']}>{tab.title}</p>
            {tab.description}
          </div>
        ))}
      </div>
      <div className={`content-block ${styles['tab-content']}`}>
        {tabs[selectedTab].content}
      </div>
    </div>
  )
};