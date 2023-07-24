import { styled, StyledComponent } from '@kadena/react-components';

export const ArticleTopMetadata: StyledComponent<'div'> = styled('div', {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: '100%',
  padding: '$5 0',
  borderBottom: '1px solid $borderColor',
  marginBottom: '$5',
  opacity: '0.6',
});

export const ArticleMetadataItem: StyledComponent<'span'> = styled('span', {
  '::after': {
    content: '"•"',
    height: '100%',
    margin: '$3',
  },
});
