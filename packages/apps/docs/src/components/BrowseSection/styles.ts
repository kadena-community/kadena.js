import {
  darkTheme,
  Stack,
  styled,
  StyledComponent,
} from '@kadena/react-components';

import Link from 'next/link';

export const StyledSection: StyledComponent<
  'section',
  {
    direction?: 'row' | 'column';
  }
> = styled('section', {
  variants: {
    direction: {
      row: {
        width: '100%',
      },
      column: {
        width: 'auto',
      },
    },
  },
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

export const StyledList: StyledComponent<'ul'> = styled('ul', {
  display: 'flex',
  flexWrap: 'wrap',
  rowGap: '$8',
  padding: 0,
  width: '100%',
  listStyle: 'none',
});

export const StyledListItem: StyledComponent<'li'> = styled('li', {
  gap: '$4',
  flexBasis: '50%',
  padding: '0 $4',
  '@md': {
    flexBasis: '30%',
  },
});

export const ItemSubHeader: StyledComponent<'span'> = styled('span', {
  color: '$neutral3',
  [`.${darkTheme} &`]: {
    color: '$neutral4',
  },
});

export const ItemStack: StyledComponent<typeof Stack> = styled(Stack, {
  gap: '0!important',
});

export const StyledLink: StyledComponent<typeof Link> = styled(Link, {
  flexBasis: '50%',
  display: 'flex',
  columnGap: '$4',

  textDecoration: 'none',

  '&:hover': {
    textDecoration: 'underline',
  },
});
