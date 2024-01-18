import { atoms, responsiveStyle, tokens } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const bottomWrapperClass = style([
  atoms({
    width: '100%',
  }),
  {
    paddingBlockStart: tokens.kda.foundation.size.n20,
    marginBlockStart: tokens.kda.foundation.size.n20,
    borderTop: `1px solid ${tokens.kda.foundation.color.border.base.bold}`,
  },
]);

export const articleTopMetadataClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  }),
  {
    marginBlockEnd: tokens.kda.foundation.size.n5,
    paddingInline: 0,
    paddingBlock: tokens.kda.foundation.size.n5,
    borderBottom: `1px solid ${tokens.kda.foundation.color.border.base.bold}`,
    opacity: '0.6',
  },
]);

export const pageGridClass = style({
  gridTemplateColumns: 'auto auto',
  gridTemplateAreas: `
            "header header"
            "pageheader pageheader"
            "content"
            "footer footer"
          `,

  ...responsiveStyle({
    md: {
      gridTemplateColumns: '0% 5% auto 5%',

      gridTemplateAreas: `
                      "header header header header"
                      "pageheader pageheader pageheader pageheader"
                      ". content . ."
                      "footer footer footer footer"
                    `,
    },
    xxl: {
      gridTemplateColumns: '0% minmax(20%, auto) auto minmax(20%, auto)',
      gridTemplateAreas: `
                      "header header header header"
                      "pageheader pageheader pageheader pageheader"
                      ". content ."
                      "footer footer footer footer"
                    `,
    },
  }),
});

export const articleMetaDataItemClass = style({
  selectors: {
    '&:not(:first-of-type)::before': {
      content: '"•"',
      height: '100%',
      margin: tokens.kda.foundation.size.n3,
    },
  },
});

export const headerFigureClass = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  }),
  {
    marginBlockEnd: tokens.kda.foundation.spacing.xxxl,
  },
]);

export const headerImageClass = style({
  position: 'relative',
  height: 'auto',
  inset: 0,
  width: '100%',
});
