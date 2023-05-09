import { styled, StyledComponent } from '@kadena/react-components';

export const Article: StyledComponent<'article'> = styled('article', {
  width: '100%',
  padding: '0 $4',
  backgroundColor: 'transparent',
});

export const Content: StyledComponent<'div'> = styled('div', {
  display: 'flex',
  position: 'relative',
  paddingTop: '$10',
  gridColumn: '1 / span 1',
  gridRow: '3 / span 1',
  overflow: 'hidden',
  width: '100%',
  height: '100%',

  '@md': {
    gridColumn: '3 / span 1',
    gridRow: '3 / span 3',
  },
});
