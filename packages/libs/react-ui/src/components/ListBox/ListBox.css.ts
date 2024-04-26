import { style } from '@vanilla-extract/css';
import { atoms, bodyBaseRegular, token } from '../../styles';

// applied on ul
export const listBoxClass = style([
  atoms({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'surface.default',
    margin: 'no',
    padding: 'no',
    listStyleType: 'none',
    paddingBlock: 'sm',
    borderRadius: 'sm',
    overflowX: 'hidden',
  }),
  {
    boxShadow: `0px 1px 0 0 ${token('color.border.base.default')}`,
    ':focus': {
      outline: 'none',
    },
    ':focus-visible': {
      outline: 'none',
    },
    selectors: {
      "&[data-scrollable='true']": {
        maxHeight: '500px',
        overflowY: 'auto',
      },
      "&[data-submenu='true']": {
        padding: '0',
        borderRadius: '0',
        boxShadow: 'none',
      },
    },
  },
]);

// applied on li
export const listItemClass = style([
  bodyBaseRegular,
  atoms({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    listStyleType: 'none',
    paddingBlock: 'sm',
    paddingInline: 'sm',
    marginInline: 'xs',
    color: 'text.base.default',
    cursor: 'pointer',
    borderRadius: 'sm',
  }),
  {
    transition: 'background 0.2s',
    ':focus': {
      outline: 'none',
    },
    ':focus-visible': {
      outline: 'none',
    },
    selectors: {
      '&[data-hovered="true"]': {
        color: token('color.text.semantic.info.@hover'),
        backgroundColor: token('color.background.semantic.info.@hover'),
      },
      '&[data-disabled="true"]': {
        color: token('color.text.base.@disabled'),
        cursor: 'not-allowed',
      },
      '&[data-focused="true"]': {
        color: token('color.text.semantic.info.@focus'),
        backgroundColor: token('color.background.semantic.info.@focus'),
      },
      '&[data-selected="true"]': {
        color: token('color.text.semantic.info.default'),
        fontWeight: token('typography.weight.secondaryFont.bold'),
      },
      '&[data-has-children="true"]': {
        padding: '0',
        marginBlock: token('spacing.xs'),
      },
    },
  },
]);

// applied on li
export const listSeparatorClass = style([
  atoms({
    listStyleType: 'none',
    margin: 'no',
    padding: 'no',
    backgroundColor: 'base.default',
  }),
  {
    height: '1px',
  },
]);

// applied on span
export const listSectionHeadingClass = style([
  atoms({
    display: 'flex',
    paddingBlock: 'xs',
    paddingInline: 'sm',
    color: 'text.base.default',
    backgroundColor: 'surface.default',
    fontWeight: 'secondaryFont.bold',
  }),
  {
    cursor: 'default',
    alignSelf: 'stretch',
  },
]);
