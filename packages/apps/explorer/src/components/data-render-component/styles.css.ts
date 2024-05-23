import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

// TODO: Define this somewhere, or make this dynamic.
const mobileBreakpoint = 380;

export const sectionClass = style([
  atoms({
    padding: 'n6',
    backgroundColor: 'base.default',
    marginBlockEnd: 'md',
  }),
]);

export const headingClass = style([
  atoms({
    marginBlockEnd: 'sm',
  }),
]);

export const descriptionListClass = style([
  atoms({
    gap: 'sm',
  }),
  {
    display: 'grid',
    justifyContent: 'start',
  },
]);

export const descriptionListIndentClass = style([
  atoms({
    marginInlineStart: 'md',
  }),
  {
    '@media': {
      [`(max-width: ${mobileBreakpoint - 1}px)`]: {
        marginBlockEnd: '0',
      },
    },
  },
]);

export const descriptionTermClass = style({
  fontWeight: 'bold',
});

export const descriptionDetailsClass = style({
  margin: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  '@media': {
    [`(min-width: ${mobileBreakpoint}px)`]: {
      gridColumnStart: 2,
    },
  },
});
