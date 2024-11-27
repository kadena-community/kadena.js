import { atoms, recipe, responsiveStyle, style, token } from './../../styles';

export const headerClass = recipe({
  base: [
    atoms({
      backgroundColor: 'surface.default',
      paddingInlineStart: 'xl',
      paddingBlockEnd: 'xl',
      paddingInlineEnd: 'lg',
      gap: 'md',
      alignItems: 'flex-start',
    }),
    {
      display: 'grid !important',
      gridArea: 'header',
    },
  ],
  variants: {
    variant: {
      base: {
        paddingBlockStart: `${token('spacing.xl')}`,
      },
      main: [
        {
          paddingBlockStart: `${token('spacing.xxl')}`,
        },
      ],
    },
    position: {
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
      vertical: {
        ridTemplateColumns: `2fr 1fr`,
        gridTemplateAreas: `
                  "header actions"
                  "description actions"
              `,
      },
    },
  },
});
export const headerDescriptionClass = style([
  atoms({
    color: 'text.gray.default',
  }),
]);

export const bodyClass = recipe({
  base: [
    atoms({
      paddingInlineStart: 'xl',
      paddingBlockEnd: 'xl',
      paddingInlineEnd: 'lg',
      gap: 'md',
    }),
    {
      gridArea: 'body',
    },
  ],
  variants: {
    variant: {
      base: {
        paddingBlockStart: `${token('spacing.xl')}`,
      },
      main: [
        {
          paddingBlockStart: `${token('spacing.xxl')}`,
        },
      ],
    },
  },
});

export const cardClass = style([
  atoms({
    padding: 'no',
    width: '100%',
  }),
]);

export const actionsClass = recipe({
  base: {
    alignItems: 'flex-start',
  },
  variants: {
    position: {
      horizontal: [
        responsiveStyle({
          xs: {
            justifyContent: 'flex-end',
          },
          md: {
            justifyContent: 'flex-start',
          },
        }),
      ],
      vertical: {
        justifyContent: 'flex-end',
      },
    },
  },
});

export const blockClass = recipe({
  base: {
    display: 'grid!important',
    width: '100%',
  },
  variants: {
    position: {
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

      vertical: {
        gridTemplateColumns: `1fr`,
        gridTemplateAreas: `
                  "header"
                  "body"
              `,
      },
    },
  },
});
