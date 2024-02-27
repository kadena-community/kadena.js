import { customTokens } from '@/styles/tokens.css';
import { style } from '@vanilla-extract/css';

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
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Kode Mono',
    height: '40px',
    width: '40px',
    content: 'counter(leaderboard)',
    fontSize: '20px',
    fontWeight: '700',
    top: '0',
    left: '-30px',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    borderRadius: '50%',
  },
});

export const winnerClass = style({
  paddingLeft: '34px',
  ':before': {
    background: 'url(/assets/winner.svg)',
    backgroundSize: 'contain',
    height: '54px',
    width: '54px',
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
      fontSize: '20px',
    },
  },
});

export const itemsContainerClass = style({
  width: 'calc(100% - 40px)',
  selectors: {
    [`${winnerClass} &`]: {
      width: 'calc(100% - 54px)',
    },
  },
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
