import type { IFile } from './../../types';
import { getFileFromNameOfUrl } from './../../utils/getFileFromNameOfUrl';
import { getUrlFromFilePath } from './../../utils/getUrlFromFilePath';
import { getFileNameInPackage } from './getFileNameInPackage';

export const createEditLink = async (file: IFile): Promise<string> => {
  const filePath = getFileNameInPackage(file);

  const pageItem = await getFileFromNameOfUrl(getUrlFromFilePath(filePath));
  if (!pageItem) return '';

  if (pageItem.repo) {
    return `${pageItem.repo}/tree/main${pageItem.file}`;
  }

  return `${process.env.NEXT_PUBLIC_GIT_EDIT_ROOT}/packages/apps/docs/src/docs${pageItem.file}`;
};
