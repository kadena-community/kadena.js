import { atoms } from '@kadena/react-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

export const dropdownClass = style([
  atoms({
    position: 'absolute',
    display: 'none',
    justifyContent: 'flex-end',
  }),
  {
    top: '50px',

    listStyle: 'none',
    paddingInline: 0,
    zIndex: 999,
  },
]);

export const dropdownItemClass = style([
  atoms({
    display: 'block',
    paddingBlock: 'xs',
    paddingInline: 'sm',
    fontFamily: 'bodyFont',
    fontSize: 'sm',
  }),
  {
    textDecoration: 'none',
    textAlign: 'right',
    minWidth: '150px',
    background: 'transparent',
    border: 0,
    color: 'white',
  },
]);

export const avatarClass = style([
  atoms({
    display: 'flex',
    fontSize: '2xl',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'secondaryFont.bold',
  }),
  {
    background: 'green',
    textTransform: 'capitalize',
    color: 'white',
    borderRadius: '50%',
    border: 0,
    width: '50px',
    aspectRatio: '1/1',
  },
]);

export const avatarWrapperClass = style([
  atoms({
    position: 'absolute',
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  }),
  {
    right: 10,
  },
]);

globalStyle(`${avatarWrapperClass}:hover ${dropdownClass}`, {
  display: 'block',
});
