import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const textStyle = style([atoms({ alignItems: 'flex-end' })]);

export const rowChainElementStyle = style([
  atoms({
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'sm',
  }),
]);

export const rowLinkElementStyle = style([
  atoms({
    justifyContent: 'center',
    padding: 'sm',
    width: '100%',
  }),
]);

export const rowTextElementStyle = style([
  atoms({
    justifyContent: 'center',
    alignItems: 'center',
    padding: 'sm',
    width: '100%',
  }),
]);

export const rowChartElementStyle = style([
  atoms({
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingBlockStart: 'sm',
  }),
]);
