import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const outerContainer = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  }),
]);

export const container = style([
  sprinkles({
    display: 'flex',
  }),
  {
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
  sprinkles({
    fontFamily: '$mono',
  }),
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
  sprinkles({
    fontFamily: '$mono',
  }),
  {
    marginTop: '1rem',
    color: '#B1A0C5',
    fontSize: '5rem',
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
  sprinkles({
    fontFamily: '$mono',
  }),
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
  sprinkles({
    margin: '$4',
  }),
  {
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
  sprinkles({
    fontFamily: '$mono',
  }),
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
