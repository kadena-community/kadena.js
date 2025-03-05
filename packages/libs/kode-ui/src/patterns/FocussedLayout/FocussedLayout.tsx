import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { NotificationSlot } from '..';
import { Stack } from './../../components';
import { Header } from './components/Header/Header';
import { HeaderContentLeft } from './components/Header/HeaderContentLeft';
import { cardWrapperClass, wrapperClass } from './style.css';

export const FocussedLayout: FC<PropsWithChildren> = ({ children }) => {
  let headerContentLeft;
  const content = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return null;

    console.log(child.displayName);
    if (child.type === HeaderContentLeft) {
      console.log(1111);
      headerContentLeft = child;
      return;
    }

    content.push(child);
  });

  return (
    <Stack
      width="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      className={wrapperClass}
    >
      <NotificationSlot />
      <Stack flexDirection="column" className={cardWrapperClass}>
        <Header />
        {content}
      </Stack>
    </Stack>
  );
};
