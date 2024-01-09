import { responsiveStyle, sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const bottomWrapperClass = style([
  sprinkles({
    width: '100%',
  }),
  {
    paddingBlockStart: vars.sizes.$20,
    marginBlockStart: vars.sizes.$20,
    borderTop: `1px solid ${vars.colors.$borderDefault}`,
  },
]);

export const articleTopMetadataClass = style([
  sprinkles({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  }),
  {
    marginBlockEnd: vars.sizes.$5,
    paddingInline: 0,
    paddingBlock: vars.sizes.$5,
    borderBottom: `1px solid ${vars.colors.$borderDefault}`,
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
      margin: vars.sizes.$3,
    },
  },
});

export const headerFigureClass = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  }),
  {
    marginBlockEnd: vars.sizes.$10,
  },
]);

export const headerImageClass = style({
  position: 'relative',
  height: 'auto',
  inset: 0,
  width: '100%',
});
