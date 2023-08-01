import { sprinkles, vars } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const inlineCode = style([
  sprinkles({
    borderRadius: '$sm',
    backgroundColor: '$neutral2',
  }),
  {
    padding: `calc(${vars.sizes.$1} / 4) ${vars.sizes.$1}`,
  },
]);

export const codeWrapper = style([
    sprinkles({
        backgroundColor: '$neutral2',
        fontSize: '$sm',
        fontFamily: '$mono',
        lineHeight: '$lg',
        marginX: '$5',
        marginY: 0
    }),
    {
        borderLeft: `4px solid ${vars.colors.$borderDefault}`,        
        borderRadius: `${vars.radii.$sm} 0px 0px ${vars.radii.$sm}`,
        wordBreak: 'break-all',
        selectors: {
            '&[data-language]::before': {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: `0 ${vars.sizes.$2}`,
                color: `${vars.colors.$background}`,
                backgroundColor: `${vars.colors.$primaryContrast}`,
                borderRadius: `${vars.sizes.$sm}`,
                width: `${vars.sizes.$6}`,
                height: `${vars.sizes.$6}`,
              },

        }
    }
])