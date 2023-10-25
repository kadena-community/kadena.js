import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { articleMetaDataItemClass } from './styles.css';

export const ArticleMetadataItem: FC<PropsWithChildren> = ({ children }) => (
  <span className={articleMetaDataItemClass}>{children}</span>
);
