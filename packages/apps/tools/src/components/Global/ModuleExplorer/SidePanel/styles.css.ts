import { atoms, token } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const containerStyle = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  }),
  style({
    borderInlineEnd: `${token('border.width.normal')} solid ${token('color.border.base.default')}`,
  }),
]);

export const customAccordionItemStyle = style({ overflow: 'auto' });

export const itemStyle = style({
  height: token('size.n12'),
  borderBlockEnd: `${token('border.width.hairline')} solid ${token('color.border.base.default')}`,
  boxSizing: 'content-box',
});

export const headingStyles = style({
  flex: 1,
});

export const iconStyles = atoms({ paddingInlineStart: 'sm' });

export const searchResultsStyles = atoms({
  paddingBlock: 'sm',
  paddingInline: 'n3',
  backgroundColor: 'base.warm',
});

export const searchResultQueryStyles = style({
  fontWeight: token('typography.weight.primaryFont.bold'),
});
