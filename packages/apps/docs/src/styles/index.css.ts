import { responsiveStyle, tokens } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

const browseSectionWrapper = style([
  {
    marginBlockEnd: tokens.kda.foundation.spacing.lg,
    flexBasis: '50%',
    rowGap: tokens.kda.foundation.spacing.md,

    ...responsiveStyle({ md: { flexBasis: '33%' } }),
  },
]);

export { browseSectionWrapper };
