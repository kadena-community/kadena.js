import { createVar } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import {
  atoms,
  globalStyle,
  responsiveStyle,
  style,
  token,
} from './../../styles';
import { minHeaderHeight, rightAsBarMinWidth } from './styles.css';

export const topbannerHeightCSS = createVar();

export const asideWrapperTempClass = recipe({
  base: [
    {
      position: 'relative',
      paddingBlockEnd: token('spacing.md'),
      backgroundColor: token('color.background.base.default'),
    },
    responsiveStyle({
      xs: {
        display: 'none',
      },

      xxl: {
        display: 'flex',
        width: rightAsBarMinWidth,
        minWidth: rightAsBarMinWidth,
        transform: 'translateX(0%)',
        marginInlineEnd: token('spacing.md'),
        zIndex: 0,
      },
    }),
  ],
  variants: {
    expanded: {
      true: {
        opacity: 1,
        transform: 'translateX(0%)',
        pointerEvents: 'auto',
      },
      false: [
        {
          opacity: 0,
          pointerEvents: 'none',
        },
        responsiveStyle({
          xxl: {
            display: 'none',
          },
        }),
      ],
    },
  },
});

export const asideWrapperClass = recipe({
  base: [
    {
      vars: {
        [topbannerHeightCSS]: '20px',
      },
      position: 'fixed',
      paddingBlockEnd: token('spacing.md'),
      backgroundColor: token('color.background.base.default'),
      gridRow: '2/5',
      zIndex: 1,
    },
    responsiveStyle({
      xs: {
        flex: 1,
        width: '100dvw',
        display: 'flex',
        flexDirection: 'column',
        willChange: 'transform',
        transition: 'transform .4s ease',
        transform: 'translateX(100%)',
        opacity: 0,
        top: 0,
        bottom: 0,
        right: 0,
        zIndex: token('zIndex.overlay'),
      },
      sm: {
        maxWidth: rightAsBarMinWidth,
      },
      xxl: {
        position: 'fixed',
        width: rightAsBarMinWidth,
        minWidth: rightAsBarMinWidth,
        transform: 'translateX(0%)',
        marginInlineEnd: token('spacing.md'),
        zIndex: token('zIndex.overlay'),
        height: `calc(100dvh - ${topbannerHeightCSS})`,
        marginBlockStart: topbannerHeightCSS,
      },
    }),
  ],
  variants: {
    expanded: {
      true: {
        opacity: 1,
        transform: 'translateX(0%)',
        pointerEvents: 'auto',
      },
      false: [
        {
          opacity: 0,
          pointerEvents: 'none',
        },
        responsiveStyle({
          xxl: {
            display: 'none',
          },
        }),
      ],
    },
  },
});

export const menuBackdropClass = recipe({
  base: [
    responsiveStyle({
      xs: {
        display: 'flex',
        position: 'fixed',
        inset: 0,
        background: token('color.neutral.n90@alpha20'),
        zIndex: 8000,
        backdropFilter: 'blur(8px)',
        opacity: 0,
        willChange: 'transform, opacity',
        transition: 'opacity 1s ease',
        transform: 'translateX(100%)',
      },
      xxl: {
        backdropFilter: 'none',
        background: 'transparent',
      },
    }),
  ],
  variants: {
    expanded: {
      true: [
        {
          opacity: 1,
          transform: 'translateX(0%)',
        },
      ],
      false: [],
    },
  },
});

export const asideHeaderClass = style([
  atoms({
    backgroundColor: 'base.default',
    paddingBlock: 'sm',
  }),
  {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    minHeight: minHeaderHeight,
  },
]);
export const asideHeaderCloseButtonWrapperClass = style(responsiveStyle({}));

export const asideContentClass = style([
  atoms({
    padding: 'sm',
    paddingBlockStart: 'md',
    flex: 1,
  }),
  {
    overflowY: 'auto',
    height: `calc(100dvh - ${minHeaderHeight})`,
  },
  responsiveStyle({
    xs: {
      backgroundColor: token('color.background.layer.default'),
    },
    xxl: {
      border: token('border.hairline'),
      borderRadius: token('spacing.sm'),
      backgroundColor: token('color.background.layer.default'),
    },
  }),
]);

globalStyle(`${asideContentClass} > div`, {
  width: '100%',
});

export const asideHeadingClass = style([
  atoms({
    color: 'text.gray.default',
    fontSize: 'xs',
    padding: 'no',
    margin: 'no',
    paddingInline: 'md',
  }),
  {},
]);
