import type { StreamMetaData } from '@7-docs/edge';

export interface IFrontmatterData {
  title?: string;
  description?: string;
}

export interface IQueryResult extends StreamMetaData {
  content?: string;
  description?: string;
}
