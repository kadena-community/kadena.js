import { atoms, vars } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const mainContentClass = style([
  {
    width: `calc(100% - ${vars.sizes.$16})`,
  },
]);

export const headerButtonGroupClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 'sm',
  }),
]);

export const filterItemClass = style([
  atoms({
    borderRadius: 'sm',
    paddingBlock: 'xs',
    paddingInline: 'sm',
    marginInlineStart: 'sm',
  }),
  {
    lineHeight: '1',
    display: 'inline-block',
    border: `1px solid ${vars.colors.$gray30}`,
  },
]);
