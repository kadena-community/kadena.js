import { style, styleVariants } from '@vanilla-extract/css';
import { sprinkles } from '../../styles/sprinkles.css';
import { darkThemeClass, vars } from '../../styles/vars.css';

export const layoutVariant = styleVariants({
  horizontal: [
    sprinkles({
      flexDirection: 'row',
    }),
  ],
  vertical: [
    sprinkles({
      flexDirection: 'column',
    }),
  ],
});

export const gridVariant = styleVariants({
  horizontal: [
    {
      gridTemplateRows: 'auto 1fr',
    },
  ],
  vertical: [
    {
      gridTemplateColumns: 'auto 1fr',
    },
  ],
});

export const displayVariant = styleVariants({
  horizontal: [
    sprinkles({
      display: 'grid',
    }),
    {
      gridTemplateColumns: '1fr 1fr',
    },
  ],
  vertical: [
    sprinkles({
      display: 'grid',
    }),
    {
      gridTemplateRows: 'auto 1fr',
    },
  ],
});

export const warningVariant = styleVariants({
  mild: [
    sprinkles({
      color: '$warningContrastInverted',
    }),
  ],
  severe: [
    sprinkles({
      color: '$negativeContrastInverted',
    }),
  ],
});

export const gapValueLabelVariant = styleVariants({
  horizontal: [
    sprinkles({
      gap: '$2',
    }),
  ],
  vertical: [
    sprinkles({
      gap: 0,
    }),
  ],
});

export const CardContainer = style([
  sprinkles({
    display: 'grid',
    padding: '$3',
    gap: '$2',
    marginTop: '$sm',
    borderRadius: '$sm',
    alignItems: 'flex-start',
    fontSize: '$sm',
    backgroundColor: {
      lightMode: '$white',
      darkMode: '$gray100',
    },
  }),
  {
    border: `1px solid ${vars.colors.$borderDefault}`,
    selectors: {
      [`${darkThemeClass} &`]: {
        border: `1px solid ${vars.colors.$gray60}`,
      },
    },
  },
]);

export const ContentContainer = style([
  sprinkles({
    display: 'flex',
    gap: '$2',
    flexDirection: 'column',
  }),
]);

export const DataContainer = style([
  sprinkles({
    display: 'grid',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '$4',
  }),
]);

export const LabelValueContainer = style([
  sprinkles({
    alignItems: 'flex-start',
  }),
]);

export const LabelTitle = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    fontSize: '$sm',
    fontWeight: '$medium',
    fontFamily: '$main',
    color: '$neutral4',
    wordBreak: 'break-word',
  }),
  {
    alignSelf: 'stretch',
  },
]);

export const LabelValue = style([
  sprinkles({
    display: 'inline-block',
    fontWeight: '$normal',
    fontFamily: '$mono',
    color: '$neutral6',
    wordBreak: 'break-word',
  }),
]);

export const TrackerWarningContainer = style([
  sprinkles({
    display: 'inline-block',
    flexDirection: 'column',
    alignItems: 'flex-start',
    fontWeight: '$normal',
    fontSize: '$xs',
  }),
]);
