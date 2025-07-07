import { globalStyle, keyframes } from '@vanilla-extract/css';

const animateCircle = keyframes({
  '40%': { transform: 'scale(1.25)', opacity: 1, fill: '#DD4688' },
  '55%': { transform: 'scale(1.35)', opacity: 1, fill: '#D46ABF' },
  '65%': { transform: 'scale(1.5)', opacity: 1, fill: '#CC8EF5' },
  '75%': {
    transform: 'scale(1.65)',
    opacity: 1,
    fill: 'transparent',
    stroke: '#CC8EF5',
    strokeWidth: '.5',
  },
  '85%': {
    transform: 'scale(2.15)',
    opacity: 1,
    fill: 'transparent',
    stroke: '#CC8EF5',
    strokeWidth: '.2',
  },
  '95%': {
    transform: 'scale(2.25)',
    opacity: 1,
    fill: 'transparent',
    stroke: '#CC8EF5',
    strokeWidth: '.1',
  },
  '100%': {
    transform: 'scale(2.35)',
    opacity: 1,
    fill: 'transparent',
    stroke: '#CC8EF5',
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
  fill: '#E2264D',
  animation: `${animateHeart} .3s linear forwards .25s`,
});

globalStyle('svg.animationClass[data-play="true"] #main-circ', {
  transition: 'all 2s',
  animation: `${animateCircle} .3s linear forwards`,
  opacity: 1,
});

globalStyle('svg.animationClass[data-play="true"] #grp1', {
  opacity: 1,
  transition: '.1s all .3s',
});

globalStyle('svg.animationClass[data-play="true"] #grp1 #oval1', {
  transform: 'scale(0) translate(0, -30px)',
  transformOrigin: '0 0 0',
  transition: '.5s transform .3s',
});

globalStyle('svg.animationClass[data-play="true"] #grp1 #oval2', {
  transform: 'scale(0) translate(10px, -50px)',
  transformOrigin: '0 0 0',
  transition: '1.5s transform .3s',
});

globalStyle('svg.animationClass[data-play="true"] #grp2', {
  opacity: 1,
  transition: '.1s all .3s',
});

globalStyle('svg.animationClass[data-play="true"] #grp2 #oval1', {
  transform: 'scale(0) translate(30px, -15px)',
  transformOrigin: '0 0 0',
  transition: '.5s transform .3s',
});
globalStyle('svg.animationClass[data-play="true"] #grp2 #oval2', {
  transform: 'scale(0) translate(60px, -15px)',
  transformOrigin: '0 0 0',
  transition: '1.5s transform .3s',
});

globalStyle('svg.animationClass[data-play="true"] #grp3', {
  opacity: 1,
  transition: '.1s all .3s',
});

globalStyle('svg.animationClass[data-play="true"] #grp3 #oval1', {
  transform: 'scale(0) translate(30px, 0px)',
  transformOrigin: '0 0 0',
  transition: '.5s transform .3s',
});
globalStyle('svg.animationClass[data-play="true"] #grp3 #oval2', {
  transform: 'scale(0) translate(60px, 10px)',
  transformOrigin: '0 0 0',
  transition: '1.5s transform .3s',
});

globalStyle('svg.animationClass[data-play="true"] #grp4', {
  opacity: 1,
  transition: '.1s all .3s',
});
globalStyle('svg.animationClass[data-play="true"] #grp4 #oval1', {
  transform: 'scale(0) translate(30px, 15px)',
  transformOrigin: '0 0 0',
  transition: '.5s transform .3s',
});
globalStyle('svg.animationClass[data-play="true"] #grp4 #oval2', {
  transform: 'scale(0) translate(40px, 50px)',
  transformOrigin: '0 0 0',
  transition: '1.5s transform .3s',
});

globalStyle('svg.animationClass[data-play="true"] #grp5', {
  opacity: 1,
  transition: '.1s all .3s',
});
globalStyle('svg.animationClass[data-play="true"] #grp5 #oval1', {
  transform: 'scale(0) translate(-10px, 20px)',
  transformOrigin: '0 0 0',
  transition: '.5s transform .3s',
});
globalStyle('svg.animationClass[data-play="true"] #grp5 #oval2', {
  transform: 'scale(0) translate(-60px, 30px)',
  transformOrigin: '0 0 0',
  transition: '1.5s transform .3s',
});

globalStyle('svg.animationClass[data-play="true"] #grp6', {
  opacity: 1,
  transition: '.1s all .3s',
});
globalStyle('svg.animationClass[data-play="true"] #grp6 #oval1', {
  transform: 'scale(0) translate(-30px, 0px)',
  transformOrigin: '0 0 0',
  transition: '.5s transform .3s',
});
globalStyle('svg.animationClass[data-play="true"] #grp6 #oval2', {
  transform: 'scale(0) translate(-60px, -5px)',
  transformOrigin: '0 0 0',
  transition: '1.5s transform .3s',
});

globalStyle('svg.animationClass[data-play="true"] #grp7', {
  opacity: 1,
  transition: '.1s all .3s',
});
globalStyle('svg.animationClass[data-play="true"] #grp7 #oval1', {
  transform: 'scale(0) translate(-30px, -15px)',
  transformOrigin: '0 0 0',
  transition: '.5s transform .3s',
});
globalStyle('svg.animationClass[data-play="true"] #grp7 #oval2', {
  transform: 'scale(0) translate(-55px, -30px)',
  transformOrigin: '0 0 0',
  transition: '1.5s transform .3s',
});
