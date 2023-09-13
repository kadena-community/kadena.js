import { sprinkles } from '@kadena/react-ui/theme';

import { paragraphWrapperClass } from './Paragraph/styles.css';

import { globalStyle, style } from '@vanilla-extract/css';

const getClassName = (str: string): string => {
  return `.${str.split(' ').splice(0, 1)}`;
};

export const wrapperClass = style([
  sprinkles({
    marginY: '$5',
    marginX: 0,
  }),
  {},
]);

globalStyle(
  `${getClassName(wrapperClass)} ${getClassName(paragraphWrapperClass)}`,
  {
    marginTop: 0,
    marginBottom: 0,
  },
);

globalStyle(
  `${getClassName(wrapperClass)} ${getClassName(
    paragraphWrapperClass,
  )} p:empty`,
  {
    display: 'none',
  },
);
