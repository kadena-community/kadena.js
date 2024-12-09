import {
  atoms,
  globalStyle,
  recipe,
  style,
  styleVariants,
  token,
  uiSmallBold,
  uiSmallRegular,
} from '../../styles';

export const tableWrapper = style({
  overflowX: 'auto',
});

export const table = style({
  color: token('color.text.base.default'),
  borderCollapse: 'collapse',
  borderSpacing: 0,
});

export const tableVariants = recipe({
  base: {},
  variants: {
    variant: {
      default: {},
      open: {
        borderCollapse: 'separate',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const openHeader = style([
  atoms({
    backgroundColor: 'transparent',
  }),
  {},
]);

export const headerBase = recipe({
  defaultVariants: {
    variant: 'default',
  },
  base: [
    {
      borderRadius: token('radius.sm'),
      borderBlockEnd: token('color.border.base.default'),
    },
    uiSmallBold,
  ],
  variants: {
    subtleHeader: {
      false: {
        color: token('color.text.base.default'),
        backgroundColor: token('color.background.base.@hover'),
      },
      true: {
        color: token('color.text.base.inverse.default'),
        backgroundColor: token('color.background.base.inverse.default'),
      },
    },
    variant: {
      default: {
        color: token('color.text.base.inverse.default'),
        backgroundColor: token('color.background.base.inverse.default'),
      },
      open: [],
    },
  },
  compoundVariants: [
    {
      variants: {
        subtleHeader: true,
        variant: 'open',
      },
      style: openHeader,
    },
    {
      variants: {
        subtleHeader: false,
        variant: 'open',
      },
      style: openHeader,
    },
  ],
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

export const columnHeader = recipe({
  base: [
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
  ],
  variants: {
    variant: {
      default: {},
      open: [
        atoms({
          backgroundColor: 'surface.default',
          color: 'text.base.@init',
          border: 'hairline',
        }),
        {
          borderInlineWidth: '0!important',
          paddingBlock: token('spacing.n3'),
          paddingInline: token('spacing.n4'),
          selectors: {
            '&:first-child': {
              borderStartStartRadius: `${token('radius.sm')}!important`,
              borderEndStartRadius: `${token('radius.sm')}!important`,
              borderInlineStartWidth: '1px!important',
            },
            '&:last-child': {
              borderStartEndRadius: `${token('radius.sm')}!important`,
              borderEndEndRadius: `${token('radius.sm')}!important`,
              borderInlineEndWidth: '1px!important',
            },
          },
        },
      ],
    },
  },
});

globalStyle(
  `${table}:not([data-variant="open"]) ${headerBase()} th:first-of-type `,
  {
    borderTopLeftRadius: token('radius.sm'),
    borderBottomLeftRadius: token('radius.sm'),
  },
);

globalStyle(
  `${table}:not([data-variant="open"]) ${headerBase()} th:last-of-type`,
  {
    borderTopRightRadius: token('radius.sm'),
    borderBottomRightRadius: token('radius.sm'),
  },
);

globalStyle(
  `${table}:not([data-variant="open"]) ${tableRow} td:first-of-type`,
  {
    borderInlineStart: '4px solid transparent',
    borderTopLeftRadius: token('size.n2'),
    borderBottomLeftRadius: token('size.n2'),
  },
);

globalStyle(`${table}:not([data-variant="open"]) ${tableRow} td:last-of-type`, {
  borderInlineEnd: '4px solid transparent',
  borderTopRightRadius: token('size.n2'),
  borderBottomRightRadius: token('size.n2'),
});

globalStyle(
  `${table}:not([data-variant="open"]) tbody[data-isstriped="true"] tr:nth-child(even)`,
  {
    backgroundColor: token('color.background.surface.default'),
  },
);

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

export const tableDataCell = recipe({
  base: [baseCell, dataCell],
  variants: {
    variant: {
      default: {},
      open: [
        atoms({
          paddingBlock: 'n3',
          paddingInline: 'n4',
          border: 'hairline',
        }),
        {
          backgroundColor: token('color.background.table.row.default'),
          backdropFilter: 'blur(18px)',
          borderInlineWidth: '0!important',
          selectors: {
            '&:first-child': {
              borderStartStartRadius: `${token('radius.sm')}!important`,
              borderEndStartRadius: `${token('radius.sm')}!important`,
              borderInlineStartWidth: `${token('border.width.hairline')}!important`,
            },
            '&:last-child': {
              borderStartEndRadius: `${token('radius.sm')}!important`,
              borderEndEndRadius: `${token('radius.sm')}!important`,
              borderInlineEndWidth: `${token('border.width.hairline')}!important`,
            },
            [`${tableRow}[data-hovered] &`]: {
              backgroundColor: token('color.background.table.row.@hover'),
            },
          },
        },
      ],
    },
  },
});

export const spacerClass = style({
  height: token('spacing.n2'),
});
