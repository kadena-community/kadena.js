import {
  darkTheme,
  Stack,
  styled,
  StyledComponent,
} from '@kadena/react-components';

import Link from 'next/link';

export const StyledSection: StyledComponent<'section'> = styled('section', {
  width: '100%',
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
  '&:nth-child(3n + 1)': {
    paddingLeft: 0,
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
