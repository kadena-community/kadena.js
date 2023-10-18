import type { FC } from 'react';
import { useState } from 'react';
import {
  body,
  bodyLeft,
  bodyRight,
  closeClass,
  container,
  footer,
  footerButton,
  header,
  tabClass,
  tabsClass,
} from './ModalContent.css';

interface ModalContentProps {
  onClose: () => void;
  tabs: {
    label: string;
    content: JSX.Element;
    sidebar: JSX.Element;
  }[];
}

export const ModalContent: FC<ModalContentProps> = ({ onClose, tabs }) => {
  const [tab, setTab] = useState(0);
  if (!open) return null;

  return (
    <div className={container}>
      <div className={header}>
        <div className={tabsClass}>
          {tabs.map((tab, i) => (
            <div key={i} onClick={() => setTab(i)} className={tabClass}>
              {tab.label}
            </div>
          ))}
        </div>
        <div onClick={() => onClose()} className={closeClass}>
          close
        </div>
      </div>
      <div className={body}>
        <div className={bodyLeft}>{tabs.at(tab)?.content}</div>
        <div className={bodyRight}>{tabs.at(tab)?.sidebar}</div>
      </div>
      {tabs.length > 1 && (
        <div className={footer}>
          {tab > 0 && (
            <div className={footerButton} onClick={() => setTab(tab - 1)}>
              &lt;
            </div>
          )}
          {tab < tabs.length - 1 && (
            <div className={footerButton} onClick={() => setTab(tab + 1)}>
              &gt;
            </div>
          )}
        </div>
      )}
    </div>
  );
};
