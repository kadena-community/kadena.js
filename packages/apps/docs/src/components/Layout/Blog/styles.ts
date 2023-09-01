import { type StyledComponent, styled } from '@kadena/react-components';

import { BasePageGrid } from '../components/styles';

export const ArticleMetadataItem: StyledComponent<'span'> = styled('span', {
  '::before': {
    content: '"•"',
    height: '100%',
    margin: '$3',
  },
});

export const PageGrid: StyledComponent<typeof BasePageGrid> = styled(
  BasePageGrid,
  {
    gridTemplateColumns: 'auto auto',
    gridTemplateAreas: `
            "header header"
            "pageheader pageheader"
            "content"
            "footer footer"
          `,

    '@md': {
      gridTemplateColumns: '0% 5% auto 5%',

      gridTemplateAreas: `
              "header header header header"
              "pageheader pageheader pageheader pageheader"
              ". content . ."
              "footer footer footer footer"
            `,
    },
    '@2xl': {
      gridTemplateColumns: '0% minmax(20%, auto) auto minmax(20%, auto)',
      gridTemplateAreas: `
              "header header header header"
              "pageheader pageheader pageheader pageheader"
              ". content ."
              "footer footer footer footer"
            `,
    },
  },
);
