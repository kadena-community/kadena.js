import { style } from '@vanilla-extract/css';
import { atoms, token } from '../../styles';

export const tableWrapper = style([
  atoms({
    width: '100%',
    overflowX: 'auto',
  }),
]);

export const table = style([
  atoms({
    borderRadius: 'sm',
    border: 'hairline',
    color: 'text.base.default',
  }),
  {
    borderSpacing: 0,
    borderColor: token('color.background.base.default'),
  },
]);

export const headerRow = style([
  atoms({
    backgroundColor: 'base.default',
  }),
]);

export const tableRow = style([
  {
    backgroundColor: token('color.neutral.n0'),
    ':hover': {
      backgroundColor: token('color.background.brand.primary.@hover'),
    },
    selectors: {
      '.striped &:nth-child(even)': {
        backgroundColor: token('color.background.base.default'),
      },
      '.striped &:nth-child(even):hover': {
        backgroundColor: token('color.background.brand.primary.@hover'),
      },
      '&[data-href]': {
        cursor: 'pointer',
      },
      '&[data-focused]': {
        outline: `solid 2px ${token('color.border.semantic.info.@focus')}`,
      },
    },
  },
]);

export const baseCell = style([
  atoms({
    paddingInline: 'md',
    paddingBlock: 'sm',
    outline: 'none',
  }),
  {
    selectors: {
      '.compact &': {
        paddingInline: token('spacing.sm'),
        paddingBlock: token('spacing.xs'),
      },
      '&[data-focused]': {
        boxShadow: `inset 0 0 0 2px ${token(
          'color.border.semantic.info.@focus',
        )}`,
      },
    },
  },
]);

export const columnHeader = style([
  baseCell,
  atoms({
    textAlign: 'left',
  }),
  {
    selectors: {
      '&[data-multi-column]': {
        textAlign: 'center',
      },
      '&[data-sortable]': {
        cursor: 'pointer',
      },
    },
  },
]);

export const tableDataCell = style([baseCell]);
