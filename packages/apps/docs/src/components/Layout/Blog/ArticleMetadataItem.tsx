import { articleMetaDataItemClass } from './styles.css';

import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export const ArticleMetadataItem: FC<PropsWithChildren> = ({ children }) => (
  <span className={articleMetaDataItemClass}>{children}</span>
);
