import { atoms, token, tokens } from '@kadena/react-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';
import { blockGridHoverableStyle } from '../block-table.css';

export const headerColumnStyle = style([
  atoms({
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'md',
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
