import { Heading, ProductIcon, Stack } from '@kadena/react-ui';

import {
  headerClass,
  headerWrapperClass,
  subheaderClass,
  wrapperClass,
} from './style.css';

import { ProductIconNames } from '@/types/Layout';
import React, { FC } from 'react';

interface IProps {
  title: string;
  subTitle?: string;
  icon?: ProductIconNames;
}

export const TitleHeader: FC<IProps> = ({ title, subTitle, icon }) => {
  const Icon = icon ? ProductIcon[icon] : null;

  return (
    <div data-cy="titleheader" className={headerWrapperClass}>
      <header className={headerClass}>
        <div className={wrapperClass}>
          <Stack alignItems="center">
            {Icon && <Icon size="heroHeader" />}
            <Heading as="h1">{title}</Heading>
          </Stack>
          {subTitle !== undefined && (
            <span className={subheaderClass}>
              <Heading as="h6" bold={false}>
                {subTitle}
              </Heading>
            </span>
          )}
        </div>
      </header>
    </div>
  );
};
