import { atoms, recipe, responsiveStyle, style, token } from './../../styles';

export const headerClass = recipe({
  base: [
    atoms({
      backgroundColor: 'surface.default',
      paddingInlineStart: 'n8',
      paddingBlockEnd: 'n8',

      paddingInlineEnd: 'lg',
      gap: 'md',
      alignItems: 'flex-start',
    }),
    {
      display: 'grid !important',
      gridArea: 'header',
      height: '100%',
    },
  ],
  variants: {
    variant: {
      main: {
        paddingBlockStart: token('spacing.n14'),
      },
      base: {
        paddingBlockStart: token('spacing.n8'),
      },
    },
    stack: {
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
            gridTemplateRows: `max-content max-content max-content 1fr`,
            gridTemplateAreas: `
                  "header"
                  "description"
                  "actions"
                  "fill"
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
    position: 'relative',
    padding: 'no',
    width: '100%',
  }),
]);

export const actionsClass = recipe({
  base: {
    alignItems: 'flex-start',
  },
  variants: {
    stack: {
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
    stack: {
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

export const iconWrapperClass = recipe({
  base: [
    atoms({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      borderRadius: 'round',
      backgroundColor: 'layer.solid',
      border: 'normal',
    }),
    {
      boxSizing: 'border-box',
      width: '40px',
      aspectRatio: '1/1',
      top: '-20px',
      left: token('spacing.n8'),
    },
  ],
  variants: {
    isLoading: {
      true: {
        border: 'none!important',
      },
      false: {},
    },
    intent: {
      info: [
        atoms({
          borderColor: 'semantic.info.default',
        }),
      ],
      positive: [
        atoms({
          borderColor: 'semantic.positive.default',
        }),
      ],
      warning: [
        atoms({
          borderColor: 'semantic.warning.default',
        }),
      ],
      negative: [
        atoms({
          borderColor: 'semantic.negative.default',
        }),
      ],
    },
  },
});

export const loadingIconClass = recipe({
  base: {
    position: 'absolute',

    width: '40px',
    aspectRatio: '1/1',
  },
  variants: {
    intent: {
      info: [
        {
          color: token('color.icon.semantic.info.default'),
        },
      ],
      positive: [
        {
          color: token('color.icon.semantic.positive.default'),
        },
      ],
      warning: [
        {
          color: token('color.icon.semantic.warning.default'),
        },
      ],
      negative: [
        {
          color: token('color.icon.semantic.negative.default'),
        },
      ],
    },
  },
});
