import { styled, StyledComponent } from '@kadena/react-components';

export const FooterLink: StyledComponent<'a'> = styled('a', {
  textDecoration: 'none',
  color: '$neutral4',
  padding: '0 $3',
  '&:hover': {
    textDecoration: 'underline',
    color: '$neutral5',
  },
});
