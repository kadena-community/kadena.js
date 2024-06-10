import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const textStyle = style([atoms({ alignItems: 'center' })]);

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
  }),
]);

export const rowChartElementStyle = style([
  atoms({
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingBlockStart: 'sm',
  }),
]);
