import { style } from '@vanilla-extract/css';

// TODO: find a way to integrate mono font with react-ui
// sprinkles({
//   fontFamily: '$mono',
// }),

export const outerContainer = style([
  {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
]);

export const container = style([
  {
    display: 'flex',
    // make sure footer fits in the viewport
    height: 'calc(100vh - 72px)',
  },
]);

export const leftSideBar = style([
  {
    marginLeft: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '200px',
  },
]);

export const weekIndicatorBox = style([
  {
    background: '#372A46',
    width: '6rem',
    color: '#7D609F',
    fontSize: '1.375rem',
    fontWeight: 700,
    textAlign: 'center',
    padding: '0.25rem',
  },
]);

export const weekIndicator = style([
  {
    marginTop: '1rem',
    color: '#B1A0C5',
    fontSize: '5rem',
    lineHeight: '5rem',
    fontWeight: 700,
  },
]);

export const logoClassH1 = style([
  {
    color: '#FFF',
    fontSize: '1.86669rem',
    fontWeight: 700,
    margin: '0 0 0.5rem 0',
  },
]);

export const logoClassP = style([
  {
    color: '#B1A0C5',
    fontSize: '1.25rem',
    fontWeight: 400,
    letterSpacing: '-0.025rem',
    lineHeight: '1.5rem',
    margin: '0 0 1.3rem 0',
  },
]);

export const main = style([
  {
    margin: '1rem',
    flexGrow: '1',
    color: '#fff',
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
  },
]);
export const mainRow = style([
  {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
]);

export const yearsSidebar = style([
  {
    minWidth: '96px',
    maxHeight: '100%',
    overflowY: 'auto',
  },
]);

export const yearLabel = style([
  {
    color: '#7D609F',
    margin: '1rem 0',
    padding: '1rem 1.5rem',
  },
]);

export const yearLabelActive = style([
  {
    color: '#B1A0C5',
    background: '#372A46',
  },
]);
