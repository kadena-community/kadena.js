import { articleMetaDataItemClass } from './styles.css';

import React, { FC, PropsWithChildren } from 'react';

export const ArticleMetadataItem: FC<PropsWithChildren> = ({ children }) => (
  <span className={articleMetaDataItemClass}>{children}</span>
);
