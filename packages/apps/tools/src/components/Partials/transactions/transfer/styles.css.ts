import { atoms } from '@kadena/kode-ui/styles';
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

export const accordionItemTitleStyle = style([
  atoms({
    fontSize: 'sm',
    padding: 'sm',
    borderRadius: 'sm',
    display: 'flex',
    flexDirection: 'column',
  }),
]);

export const accordionItemContentStyle = style([
  atoms({
    fontSize: 'sm',
    padding: 'md',
    borderRadius: 'sm',
    display: 'flex',
    flexDirection: 'column',
  }),
]);
