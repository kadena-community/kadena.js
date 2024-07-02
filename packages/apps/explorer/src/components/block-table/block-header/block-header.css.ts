import { barClass } from '@/components/block-activity-graph/style.css';
import { atoms, responsiveStyle, token, tokens } from '@kadena/kode-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';
import { blockGridHoverableStyle } from '../block-table.css';

export const headerColumnStyle = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBlock: 'md',
    backgroundColor: 'surface.default',
  }),
  {
    selectors: {
      '&:nth-child(even)': {
        background: token('color.background.layer.default'),
      },
      '&:nth-child(3), &:nth-child(5)': {
        background: token('color.background.input.default'),
      },
    },
  },
  responsiveStyle({
    xs: {
      selectors: {
        '&:nth-child(2), &:nth-child(7)': {
          display: 'none',
        },
      },
    },
    md: {
      selectors: {
        '&:nth-child(2), &:nth-child(7)': {
          display: 'flex',
        },
      },
    },
  }),
]);

globalStyle(
  `${blockGridHoverableStyle}:hover ${headerColumnStyle}:nth-child(even)`,
  {
    backgroundColor: tokens.kda.foundation.color.background.base['@hover'],
  },
);

globalStyle(
  `${blockGridHoverableStyle}:hover ${headerColumnStyle}:nth-child(3), ${blockGridHoverableStyle}:hover ${headerColumnStyle}:nth-child(5)`,
  {
    background: token('color.background.input.default'),
  },
);

globalStyle(`${blockGridHoverableStyle}:hover ${barClass}`, {
  backgroundColor:
    tokens.kda.foundation.color.icon.brand.primary.inverse['@hover'],
});

export const columnTitleClass = style([
  atoms({
    color: 'text.gray.default',
  }),
]);
