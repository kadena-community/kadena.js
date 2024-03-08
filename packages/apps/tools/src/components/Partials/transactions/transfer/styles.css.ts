import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const buttonContainerClass = style([
  atoms({ display: 'flex', justifyContent: 'flex-end' }),
]);

export const linksBoxStyle = style([
  atoms({
    fontSize: 'base',
    borderRadius: 'sm',
    display: 'flex',
    flexDirection: 'column',
  }),
]);

export const infoAccordionWrapper = style([
  atoms({
    fontSize: 'xs',
  }),
]);
