import { createVar, globalStyle, style } from '@vanilla-extract/css';

export const mainRowItem = style([
  {
    flexBasis: '12.5%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
]);

export const mainRowItemUnavailable = style([
  {
    width: '30px',
    height: '30px',
    lineHeight: '30px',
    fontSize: '42px',
    color: '#503E66',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
]);

export const mainRowItemActive = style([
  {
    width: '30px',
    height: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
]);

export const mainRowItemActiveDot = style([
  {
    zIndex: 1,
    background: '#e5207e',
    borderRadius: '50%',
    width: '14px',
    height: '14px',
  },
]);

export const mainRowItemBlock = style([
  {
    position: 'absolute',
    width: '45px',
    height: '45px',
    padding: '0.75rem',
    border: '1px solid #503E66',
    transition: 'all 0.25s ease-in-out',
    selectors: {
      '&:hover': {
        border: '8px solid #503E66',
        padding: '0',
        width: '100px',
        height: '100px',
        zIndex: '1',
      },
    },
  },
]);

export const mainRowItemInnerBlock = style([
  {
    width: '100%',
    height: '100%',
    background: '#503E66',
  },
]);

globalStyle(`${mainRowItemBlock} img`, {
  visibility: 'hidden',
  width: '100%',
  height: '100%',
});

globalStyle(`${mainRowItemBlock}:hover img`, {
  visibility: 'visible',
});

export const modalImage = style([
  {
    width: '100%',
    height: '100%',
    maxHeight: '73vh',
    objectFit: 'cover',
  },
]);

export const progressVar = createVar();

export const progressBar = style([
  {
    position: 'absolute',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
    background: `radial-gradient(
      closest-side,
      #1e1726 66%,
      transparent 65% 100%,
      #1e1726 0
    ), conic-gradient(#9d42fb calc(${progressVar} * 1%), #413949 0)`,
  },
]);
