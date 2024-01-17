import { getClassName } from '@/utils/getClassName';
import { tokens } from '@kadena/react-ui/theme';
import { globalStyle, style } from '@vanilla-extract/css';
import { paragraphWrapperClass } from '../Paragraph/styles.css';

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
    marginBlockStart: '0 !important',
  },
);

globalStyle(
  `article
    ${getClassName(notificationWrapperClass)}
    ${getClassName(paragraphWrapperClass)} :not(p:empty)
    `,
  {
    marginBlockStart: tokens.kda.foundation.size.n5,
  },
);
