import { atoms, globalStyle, style, token } from './../../styles';

export const contextMenuClass = style([
  atoms({
    flexDirection: 'column',
    borderStyle: 'solid',
    borderRadius: 'sm',
    borderWidth: 'hairline',
  }),
  {
    borderColor: token('color.neutral.n20@alpha80'),
    backgroundColor: token('color.background.overlay.context.default'),
  },
]);

export const menuItemClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'flex-start',
    paddingInlineStart: 'md',
    width: '100%',
  }),
  {
    textAlign: 'start',
    border: 0,
    backgroundColor: 'transparent',
    maxWidth: '250px',
    selectors: {
      '&:hover:not([data-disabled="true"])': {
        backgroundColor: token('color.neutral.n10@alpha80'),
        cursor: 'pointer',
      },
      '&[data-disabled="true"]': {
        opacity: '.4',
      },
    },
  },
]);

export const menuItemLabelClass = style([
  atoms({
    flex: 1,
  }),
  {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    wordWrap: 'normal',
  },
]);
export const menuItemIconClass = style([
  {
    width: '40px',
    aspectRatio: '1/1',
    alignItems: 'center',
    justifyContent: 'center',
  },
]);

globalStyle(`${menuItemIconClass} > svg`, {
  color: token('color.text.base.default'),
});

export const underlayClass = style({
  position: 'fixed',
  inset: 0,
});
