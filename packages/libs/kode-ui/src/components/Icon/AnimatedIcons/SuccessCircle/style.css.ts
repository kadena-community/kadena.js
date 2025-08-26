import { keyframes } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { globalStyle, token } from './../../../../styles';

const animateCircle = keyframes({
  '40%': {
    transform: 'scale(1.25)',
    opacity: 0.7,
  },
  '55%': {
    transform: 'scale(1.35)',
    opacity: 0.75,
  },
  '65%': {
    transform: 'scale(1.5)',
    opacity: 0.8,
  },
  '75%': {
    transform: 'scale(1.65)',
    opacity: 0.9,
    strokeWidth: '.5',
  },
  '85%': {
    transform: 'scale(2.15)',
    opacity: 1,
    strokeWidth: '.2',
  },
  '95%': {
    transform: 'scale(2.25)',
    opacity: 1,
    fill: 'transparent',

    strokeWidth: '.1',
  },
  '100%': {
    transform: 'scale(2.35)',
    opacity: 1,
    fill: 'transparent',
    strokeWidth: 0,
  },
});

const animateHeart = keyframes({
  '0%': { transform: 'scale(.2)' },
  '40%': { transform: 'scale(1.2)' },
  '100%': { transform: 'scale(1)' },
});

const animateHeartOut = keyframes({
  '0%': { transform: 'scale(1.4)' },
  '100%': { transform: 'scale(1)' },
});

globalStyle('svg.animationClass', {
  cursor: 'pointer',
  overflow: 'visible',
  width: '60px',
});

globalStyle('svg.animationClass #circle', {
  opacity: 0,
  transformOrigin: 'center',
  animation: `${animateHeartOut} 3.3s linear forwards`,
});

globalStyle('svg.animationClass #main-circ', {
  transformOrigin: '29.5px 29.5px',
});

globalStyle('svg.animationClass[data-play="true"] #circle', {
  transform: 'scale(.2)',
  fill: token('color.background.accent.primary.inverse.default'),
  animation: `${animateHeart} .3s linear forwards .25s`,
});

globalStyle('svg.animationClass[data-play="true"] #main-circ', {
  transition: 'all 2s',
  animation: `${animateCircle} .3s linear forwards`,
  opacity: 1,
});

export const mainCircleClass = recipe({
  base: {
    selectors: {
      '&[data-play="true"]': {
        strokeWidth: '0',
        transition: 'all 2s',
        animation: `${animateCircle} .3s linear forwards`,
        opacity: 1,
      },
    },
  },
  variants: {
    variant: {
      primary: {
        fill: token('color.background.accent.primary.inverse.default'),
        stroke: token('color.background.accent.primary.inverse.default'),
      },
      transparent: {
        fill: token('color.background.accent.primary.inverse.default'),
        stroke: token('color.background.accent.primary.inverse.default'),
      },
      outlined: {
        fill: token('color.background.accent.primary.inverse.default'),
        stroke: token('color.background.accent.primary.inverse.default'),
      },
      secondary: {
        fill: token('color.background.accent.secondary.inverse.default'),
        stroke: token('color.background.accent.secondary.inverse.default'),
      },
      info: {
        fill: token('color.background.semantic.info.inverse.default'),
        stroke: token('color.background.semantic.info.inverse.default'),
      },
      warning: {
        fill: token('color.background.semantic.warning.inverse.default'),
        stroke: token('color.background.semantic.warning.inverse.default'),
      },
      positive: {
        fill: token('color.background.semantic.positive.inverse.default'),
        stroke: token('color.background.semantic.positive.inverse.default'),
      },
      negative: {
        fill: token('color.background.semantic.negative.inverse.default'),
        stroke: token('color.background.semantic.negative.inverse.default'),
      },
    },
  },
});

export const grpClass = recipe({
  base: {},
  variants: {
    play: {
      true: {
        opacity: 1,
        transition: '.1s all .3s',
      },
      false: {},
    },
  },
});

export const oval1Class = recipe({
  base: {},
  variants: {
    play: {
      true: {
        transformOrigin: '0 0 0',
        transition: '.5s transform .3s',
      },
      false: {},
    },
  },
});

export const oval2Class = recipe({
  base: {},
  variants: {
    play: {
      true: {
        transformOrigin: '0 0 0',
        transition: '1.5s transform .3s',
      },
      false: {},
    },
  },
});

globalStyle('svg.animationClass[data-play="true"] #grp1 #oval1', {
  transform: 'scale(0) translate(0, -30px)',
});

globalStyle('svg.animationClass[data-play="true"] #grp1 #oval2', {
  transform: 'scale(0) translate(10px, -50px)',
});

globalStyle('svg.animationClass[data-play="true"] #grp2 #oval1', {
  transform: 'scale(0) translate(30px, -15px)',
});
globalStyle('svg.animationClass[data-play="true"] #grp2 #oval2', {
  transform: 'scale(0) translate(60px, -15px)',
});

globalStyle('svg.animationClass[data-play="true"] #grp3 #oval1', {
  transform: 'scale(0) translate(30px, 0px)',
});
globalStyle('svg.animationClass[data-play="true"] #grp3 #oval2', {
  transform: 'scale(0) translate(60px, 10px)',
});

globalStyle('svg.animationClass[data-play="true"] #grp4 #oval1', {
  transform: 'scale(0) translate(30px, 15px)',
});
globalStyle('svg.animationClass[data-play="true"] #grp4 #oval2', {
  transform: 'scale(0) translate(40px, 50px)',
});

globalStyle('svg.animationClass[data-play="true"] #grp5 #oval1', {
  transform: 'scale(0) translate(-10px, 20px)',
});
globalStyle('svg.animationClass[data-play="true"] #grp5 #oval2', {
  transform: 'scale(0) translate(-60px, 30px)',
});

globalStyle('svg.animationClass[data-play="true"] #grp6 #oval1', {
  transform: 'scale(0) translate(-30px, 0px)',
});
globalStyle('svg.animationClass[data-play="true"] #grp6 #oval2', {
  transform: 'scale(0) translate(-60px, -5px)',
});

globalStyle('svg.animationClass[data-play="true"] #grp7 #oval1', {
  transform: 'scale(0) translate(-30px, -15px)',
});
globalStyle('svg.animationClass[data-play="true"] #grp7 #oval2', {
  transform: 'scale(0) translate(-55px, -30px)',
});
