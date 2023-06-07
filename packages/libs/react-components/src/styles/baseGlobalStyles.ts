// NOTE: Refer to https://www.joshwcomeau.com/css/custom-css-reset/ for more detailed explanation

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const baseGlobalStyles: Record<string, unknown> = {
  /*
  1. Use a more-intuitive box-sizing model.
*/
  '*, *::before, *::after': {
    boxSizing: 'border-box',
    fontFamily: '$main',
  },

  /*
    2. Remove default margin
  */
  '*': {
    margin: 0,
  },

  /*
    3. Allow percentage-based heights in the application
  */
  'html, body': {
    height: '100%',
  },

  /*
    Typographic tweaks!
    4. Add accessible line-height
    5. Improve text rendering
  */
  body: {
    lineHeight: '$base',
    fontFamily: '$main',
    '-webkit-font-smoothing': 'antialiased',
    backgroundColor: '$background',
    color: '$foreground',
  },

  /*
    6. Improve media defaults
  */
  'img, picture, video, canvas, svg': {
    display: 'block',
    maxWidth: '100%',
  },

  /*
    7. Remove built-in form typography styles
  */
  'input, button, textarea, select': {
    fontFamily: '$main',
  },

  /*
    8. Avoid text overflows
  */
  'span, p, h1, h2, h3, h4, h5, h6': {
    fontFamily: '$main',
    overflowWrap: 'break-word',
  },

  /*
    9. Create a root stacking context
  */
  '#root, #__next': {
    isolation: 'isolate',
  },

  /*
    Kadena Design System
  */

  a: {
    color: '$primaryContrast',
    '&:hover': {
      color: '$primaryHighContrast',
    },
  },

  // Spacing
  ':root': {
    '$spacing-2xs': '$sizes$1',
    '$spacing-xs': '$sizes$2',
    '$spacing-sm': '$sizes$3',
    '$spacing-md': '$sizes$4',
    '$spacing-lg': '$sizes$6',
    '$spacing-xl': '$sizes$7',
    '$spacing-2xl': '$sizes$9',
    '$spacing-3xl': '$sizes$10',

    '@md': {
      '$spacing-3xl': '$sizes$12',
    },
    '@lg': {
      '$spacing-2xl': '$sizes$10',
      '$spacing-3xl': '$sizes$15',
    },
    '@xl': {
      '$spacing-xl': '$sizes$8',
      '$spacing-2xl': '$sizes$13',
      '$spacing-3xl': '$sizes$20',
    },
    '@2xl': {
      '$spacing-xl': '$sizes$11',
      '$spacing-2xl': '$sizes$17',
      '$spacing-3xl': '$sizes$25',
    },
  },

  // Typography
  h1: {
    fontSize: '$5xl',
    '@md': {
      fontSize: '7xl',
    },
    '@lg': {
      fontSize: '$9xl',
    },
    '@xl': {
      fontSize: '$10xl',
    },
    '@2xl': {
      fontSize: '$12xl',
    },
  },

  h2: {
    fontSize: '$4xl',
    '@lg': {
      fontSize: '$6xl',
    },
    '@xl': {
      fontSize: '$8xl',
    },
    '@2xl': {
      fontSize: '$9xl',
    },
  },

  h3: {
    fontSize: '$2xl',
    '@lg': {
      fontSize: '$4xl',
    },
    '@xl': {
      fontSize: '$5xl',
    },
    '@2xl': {
      fontSize: '$6xl',
    },
  },

  h4: {
    fontSize: '$xl',
    '@lg': {
      fontSize: '$2xl',
    },
    '@xl': {
      fontSize: '$3xl',
    },
    '@2xl': {
      fontSize: '$4xl',
    },
  },

  h5: {
    fontSize: '$lg',
    '@xl': {
      fontSize: '$xl',
    },
    '@2xl': {
      fontSize: '$4xl',
    },
  },

  h6: {
    fontSize: '$base',
    '@xl': {
      fontSize: '$md',
    },
    '@2xl': {
      fontSize: '$lg',
    },
  },

  code: {
    fontFamily: '$mono',
  },
  'a, li': {
    fontFamily: '$main',
  },
} as const;
