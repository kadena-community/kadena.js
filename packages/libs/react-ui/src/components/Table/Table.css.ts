import {
  globalStyle,
  style,
  styleVariants,
  token,
  uiSmallBold,
  uiSmallRegular,
} from '../../styles';

export const tableWrapper = style({
  overflowX: 'auto',
});

export const table = style([
  {
    color: token('color.text.base.default'),
    borderCollapse: 'collapse',
    borderSpacing: 0,
  },
]);

export const headerBase = style([
  {
    borderRadius: token('radius.sm'),
    borderBlockEnd: token('color.border.base.default'),
    color: token('color.text.base.inverse.default'),
    backgroundColor: token('color.background.base.inverse.default'),
  },
  uiSmallBold,
]);

export const subtleHeader = style({
  color: token('color.text.base.default'),
  backgroundColor: token('color.background.base.@hover'),
});

export const defaultHeader = style({
  color: token('color.text.base.inverse.default'),
  backgroundColor: token('color.background.base.inverse.default'),
});

export const tableRow = style([
  {
    borderRadius: token('radius.sm'),
    selectors: {
      '&[data-href]': {
        cursor: 'pointer',
      },
      '&[data-focused]': {
        outline: `solid 2px ${token('color.border.tint.outline')}`,
      },
    },
  },
]);

export const baseCell = style([
  uiSmallRegular,
  {
    backgroundClip: 'padding-box',
    paddingBlock: token('spacing.sm'),
    paddingInline: token('spacing.md'),
    outline: 'none',
    selectors: {
      '.compact &': {
        paddingInline: token('spacing.sm'),
        paddingBlock: token('spacing.xs'),
      },
    },
  },
]);

export const columnHeader = style([
  baseCell,
  {
    textAlign: 'left',
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

globalStyle(`${headerBase} th:first-of-type `, {
  borderTopLeftRadius: token('radius.sm'),
  borderBottomLeftRadius: token('radius.sm'),
});

globalStyle(`${headerBase} th:last-of-type`, {
  borderTopRightRadius: token('radius.sm'),
  borderBottomRightRadius: token('radius.sm'),
});

globalStyle(`${tableRow} td:first-of-type`, {
  borderInlineStart: '4px solid transparent',
  borderTopLeftRadius: token('size.n2'),
  borderBottomLeftRadius: token('size.n2'),
});

globalStyle(`${tableRow} td:last-of-type`, {
  borderInlineEnd: '4px solid transparent',
  borderTopRightRadius: token('size.n2'),
  borderBottomRightRadius: token('size.n2'),
});

globalStyle(`tbody ${tableRow} td`, {
  borderRadius: '2px',
  borderBlock: '2px solid transparent',
});

export const tableRowContent = style({
  display: 'flex',
  flex: 1,
  minWidth: '100%',
  padding: token('spacing.n1'),
});

export const selectorCell = styleVariants({
  header: {
    paddingInline: '10px',
  },
  body: {
    paddingInline: token('size.n2'),
  },
});

const dataCell = style({
  selectors: {
    [`${tableRow}[data-hovered] &`]: {
      backgroundColor: token('color.background.base.@hover'),
    },
    [`${tableRow}[data-selected] &`]: {
      backgroundColor: token('color.background.accent.primary.inverse.@active'),
      color: token('color.text.base.inverse.@active'),
    },
  },
});

export const tableDataCell = style([baseCell, dataCell]);
