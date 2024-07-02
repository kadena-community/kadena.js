import {
  bodyBaseBold,
  bodyBaseRegular,
  bodySmallBold,
  bodySmallRegular,
  bodySmallestBold,
  bodySmallestRegular,
  monospaceBaseBold,
  monospaceBaseRegular,
  monospaceSmallBold,
  monospaceSmallRegular,
  monospaceSmallestBold,
  monospaceSmallestRegular,
  uiBaseBold,
  uiBaseRegular,
  uiSmallBold,
  uiSmallRegular,
  uiSmallestBold,
  uiSmallestRegular,
} from '../../../styles';

export const fontMap = {
  code: {
    smallest: {
      regular: monospaceSmallestRegular,
      bold: monospaceSmallestBold,
    },
    small: { regular: monospaceSmallRegular, bold: monospaceSmallBold },
    base: {
      regular: monospaceBaseRegular,
      bold: monospaceBaseBold,
    },
  },
  ui: {
    smallest: { regular: uiSmallestRegular, bold: uiSmallestBold },
    small: { regular: uiSmallRegular, bold: uiSmallBold },
    base: { regular: uiBaseRegular, bold: uiBaseBold },
  },
  body: {
    smallest: { regular: bodySmallestRegular, bold: bodySmallestBold },
    small: { regular: bodySmallRegular, bold: bodySmallBold },
    base: { regular: bodyBaseRegular, bold: bodyBaseBold },
  },
};
