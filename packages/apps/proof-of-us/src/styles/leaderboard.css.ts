import { customTokens } from '@/styles/tokens.css';
import { style } from '@vanilla-extract/css';

export const winnerListClass = style({});
export const listItemClass = style({
  display: 'flex',
  counterIncrement: 'leaderboard',
  position: 'relative',
  paddingLeft: '42px',
  borderRadius: '2px',
  background: 'rgba(255, 255, 255, 0.1)',
  marginBottom: '8px',
  paddingBottom: '8px',
  paddingTop: '8px',
  paddingRight: '10px',
  marginLeft: '-20px',
  marginRight: '-20px',

  ':before': {
    position: 'absolute',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Kode Mono',
    height: '32px',
    width: '32px',
    content: 'counter(leaderboard)',
    fontSize: '20px',
    fontWeight: '700',
    top: '50%',
    transform: 'translateY(-50%)',
    left: '15px',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    borderRadius: '50%',
  },
});

export const winnerClass = style({
  paddingLeft: '34px',
  ':before': {
    background: 'url(/assets/winner3.svg)',
    backgroundSize: 'contain',
    height: '45px',
    width: '45px',
    left: '8px',
  },
});

export const firstPlaceClass = style({
  ':before': {
    background: 'url(/assets/winner1.svg)',
    height: '54px',
    width: '54px',
    left: '3px',
  },
});

export const secondPlaceClass = style({
  ':before': {
    background: 'url(/assets/winner2.svg)',
  },
});

export const amountClass = style({
  color: customTokens.color.accent,
  fontFamily: 'Kode Mono',
  fontSize: '16px',
  fontWeight: '700',
  marginLeft: '10px',

  selectors: {
    [`${winnerClass} &`]: {
      color: '#FFD600',
    },
    [`${firstPlaceClass} &`]: {
      fontSize: '20px',
    },
  },
});

export const itemsContainerClass = style({
  width: '100%',
  paddingLeft: '35px',
});

export const sectionTitleClass = style({
  marginBottom: '16px',
});

export const listCounterClass = style({
  counterReset: 'leaderboard',
});

export const accountNameClass = style({
  fontSize: '12px',
  fontFamily: 'Kode Mono',
});
