import { ingest } from './ingestion/cli/command/ingest';
import remarkAdmonitions from './remarkAdmonition';
import remarkCheckForCodeTitle from './remarkCheckForCodeTitle';
import remarkFigureOutOfParagraph from './remarkFigureOutOfParagraph';
import remarkFrontmatterToProps from './remarkFrontmatterToProps';
import remarkHeadersToProps from './remarkHeadersToProps';
import remarkPropsToStaticRender from './remarkPropsToStaticRender';
import remarkSideMenuToProps from './remarkSideMenuToProps';
import remarkTwitter from './remarkTwitter';
import remarkYoutube from './remarkYoutube';
import { getReadTime } from './utils';
import { getUrlNameOfPageFile } from './utils/config/getUrlNameOfPageFile';
import { getFileExtension } from './utils/getFileExtension';
import { getFileFromNameOfUrl } from './utils/getFileFromNameOfUrl';
import { getFrontmatterFromTsx } from './utils/getFrontmatter';
import { getHeaderMenuItems } from './utils/getHeaderMenuItems';
import { getParentTreeFromPage } from './utils/getParentTreeFromPage';
import { isMarkDownFile } from './utils/markdown/isMarkdownFile';
import {
  checkSubTreeForActive,
  getPathName,
} from './utils/staticGeneration/checkSubTreeForActive';
import {
  flatPosts,
  flattenData,
  getFlatData,
} from './utils/staticGeneration/flatPosts';
import {
  cleanupPages,
  getData as getMenuData,
  getPages,
} from './utils/staticGeneration/getData';

export {
  checkSubTreeForActive,
  cleanupPages,
  flatPosts,
  flattenData,
  getFileExtension,
  getFileFromNameOfUrl,
  getFlatData,
  getFrontmatterFromTsx,
  getHeaderMenuItems,
  getMenuData,
  getPages,
  getParentTreeFromPage,
  getPathName,
  getReadTime,
  getUrlNameOfPageFile,
  ingest,
  isMarkDownFile,
  remarkAdmonitions,
  remarkCheckForCodeTitle,
  remarkFigureOutOfParagraph,
  remarkFrontmatterToProps,
  remarkHeadersToProps,
  remarkPropsToStaticRender,
  remarkSideMenuToProps,
  remarkTwitter,
  remarkYoutube,
};

export type * from './types';
