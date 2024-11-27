import { atoms, recipe, responsiveStyle, style } from './../../styles';

export const headerClass = recipe({
  base: [
    atoms({
      backgroundColor: 'surface.default',
      padding: 'xl',
      paddingInlineEnd: 'lg',
      gap: 'md',
    }),
    {
      display: 'grid !important',
      gridArea: 'header',
    },
  ],
  variants: {
    variant: {
      horizontal: [
        responsiveStyle({
          xs: {
            gridTemplateColumns: `2fr 1fr`,
            gridTemplateAreas: `
                  "header actions"
                  "description actions"
              `,
          },
          md: {
            gridTemplateColumns: `1fr`,
            gridTemplateAreas: `
                  "header"
                  "description"
                  "actions"
              `,
          },
        }),
      ],
      vertical: {},
    },
  },
});
export const headerDescriptionClass = style([
  atoms({
    color: 'text.gray.default',
  }),
]);

export const bodyClass = style([
  atoms({
    padding: 'xl',
    paddingInlineStart: 'lg',
  }),
  {
    gridArea: 'body',
  },
]);

export const cardClass = style([
  atoms({
    padding: 'no',
    width: '100%',
  }),
]);

export const blockClass = recipe({
  base: {
    display: 'grid!important',
    width: '100%',
  },
  variants: {
    variant: {
      horizontal: [
        responsiveStyle({
          xs: {
            gridTemplateColumns: `1fr`,
            gridTemplateAreas: `
                  "header"
                  "body"
              `,
          },
          md: {
            gridTemplateColumns: `minmax(auto, 280px) 2fr`,
            gridTemplateAreas: `
                  "header body"
              `,
          },
        }),
      ],

      vertical: {},
    },
  },
});
