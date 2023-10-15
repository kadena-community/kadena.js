import { vars } from '@kadena/react-ui/theme';

import { paragraphWrapperClass } from '../Paragraph/styles.css';

import { getClassName } from '@/utils/getClassName';
import { globalStyle, style } from '@vanilla-extract/css';

export const notificationWrapperClass = style({});

// NOTIFICATION PARAGRAPHS

globalStyle(
  `article
    ${getClassName(notificationWrapperClass)}
    ${getClassName(paragraphWrapperClass)}
    `,
  {
    margin: 0,
  },
);

globalStyle(
  `article
    ${getClassName(notificationWrapperClass)}
    ${getClassName(paragraphWrapperClass)}:first-of-type p
    `,
  {
    marginTop: '0 !important',
  },
);

globalStyle(
  `article
    ${getClassName(notificationWrapperClass)}
    ${getClassName(paragraphWrapperClass)} :not(p:empty)
    `,
  {
    marginTop: vars.sizes.$5,
  },
);
