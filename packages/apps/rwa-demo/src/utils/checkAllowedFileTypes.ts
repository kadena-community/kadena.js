import { ALLOWEDFILETYPES } from '@/constants';

export const checkAllowedFileTypes = (file: File): boolean => {
  return ALLOWEDFILETYPES().indexOf(file.type) >= 0;
};

export const checkNotAllowedFileTypes = (file: File): boolean => {
  return ALLOWEDFILETYPES().indexOf(file.type) < 0;
};
