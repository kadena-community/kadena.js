import { styled, StyledComponent } from '@kadena/react-components';

export const StyledSection: StyledComponent<'section'> = styled('section', {
  width: 'auto',
});

export const StyledLinkList: StyledComponent<'ul'> = styled('ul', {
  padding: '0 $5',
  listStyle: 'disc',
  '& li': {
    color: '$primaryContrast',
    lineHeight: '$lg',
    '& a': {
      color: '$primaryContrast',
      textDecoration: 'none',
      '&:hover': {
        color: '$primaryHighContrast',
        textDecoration: 'underline',
      },
    },
  },
});
