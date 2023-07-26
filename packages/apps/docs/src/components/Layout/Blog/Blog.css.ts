import { style, styleVariants } from '@vanilla-extract/css';

export const bottomWrapperClass = style([
  {
    display: 'flex',

    border: '1px solid purple',
  },
]);

export const bottomWrapperVariants = styleVariants({
  left: [
    bottomWrapperClass,
    {
      justifyContent: 'flex-start',
    },
  ],
  right: [
    bottomWrapperClass,
    {
      justifyContent: 'flex-end',
    },
  ],
});
