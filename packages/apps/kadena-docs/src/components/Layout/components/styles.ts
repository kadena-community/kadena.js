import { darkTheme, styled, StyledComponent } from '@kadena/react-components';

import Link from 'next/link';

export const Wrapper: StyledComponent<'div'> = styled('div', {
  maxWidth: '$pageWidth',
  margin: '0 auto',
});

export const Template: StyledComponent<
  'div',
  { layout?: 'landing' | 'normal' | undefined }
> = styled('div', {
  display: 'grid',
  gridTemplateRows: '$17 1fr auto',
  gridTemplateAreas: `
      "header"
      "content"
      "footer"
    `,

  position: 'relative',
  margin: '0 auto',
  minHeight: '100vh',
  '@md': {
    gridTemplateColumns:
      'auto $leftSideWidth minmax(auto, calc($pageWidth - $leftSideWidth)) auto',
    gridTemplateAreas: `
        "header header header header"
        ". menu content ."
        "footer footer footer footer"
      `,
  },
  defaultVariants: {
    layout: 'landing',
  },
  variants: {
    layout: {
      normal: {},
      landing: {
        gridTemplateAreas: `
            "header"
            "content"
            "footer"
          `,
        '@md': {
          gridTemplateAreas: `
              "header header header header"
              ". content content ."
              "footer footer footer footer"
            `,
        },
      },
    },
  },
});

export const Article: StyledComponent<'div'> = styled('div', {
  flex: 1,
});

export const Content: StyledComponent<'div', { name?: string }> = styled(
  'div',
  {
    display: 'flex',
    gridArea: 'content',
    flex: 1,
    padding: '0 $10',
  },
);

export const MenuBack: StyledComponent<
  'button',
  { isOpen?: boolean | 'true' | 'false' | undefined }
> = styled('button', {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  background: 'rgba(0,0,0,.5)',
  border: 0,
  cursor: 'pointer',
  opacity: 0,
  transform: 'translateX(-100%)',
  transition: 'opacity .5s ease, transform .1s ease',
  '@md': {
    opacity: 0,
    pointerEvent: 'none',
  },

  variants: {
    isOpen: {
      true: {
        transform: 'translateX(0)',
        opacity: 1,
        '@md': {
          transform: 'translateX(-100%)',
          opacity: 0,
        },
      },
      false: {
        transform: 'translateX(-100%)',
        opacity: 0,
      },
    },
  },
});

export const Menu: StyledComponent<
  'div',
  {
    isOpen?: boolean | 'true' | 'false' | undefined;
    inLayout?: boolean | 'true' | 'false' | undefined;
  }
> = styled('div', {
  gridArea: 'menu',
  position: 'absolute',
  top: '$17',
  height: 'calc(100% - $17 - $17)',
  width: '100%',
  borderRight: '1px solid $neutral3',
  background: '$background',
  overflow: 'hidden',
  transform: 'translateX(-100%)',
  transition: 'transform .3s ease, width .3s ease',

  '@sm': {
    width: '$leftSideWidth',
  },
  '@md': {
    position: 'relative',
    top: '0',
    height: '100%',
    transform: 'translateX(0)',
  },

  variants: {
    inLayout: {
      true: {
        display: 'block',
      },
      false: {
        display: 'block',
        '@md': {
          display: 'none',
        },
      },
    },
    isOpen: {
      true: {
        transform: 'translateX(0)',
      },
      false: {
        transform: 'translateX(-100%)',
        '@md': {
          transform: 'translateX(0)',
        },
      },
    },
  },
});

export const StyledHeader: StyledComponent<'header'> = styled('header', {
  position: 'sticky',
  top: 0,
  gridArea: 'header',
  backgroundColor: '$neutral5',
  color: 'white',
  zIndex: '$navMenu',

  [`.${darkTheme} &`]: {
    background: '$neutral2',
  },
});

export const InnerWrapper: StyledComponent<typeof Wrapper> = styled(Wrapper, {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  padding: '$3 $4',
});

export const StyledNav: StyledComponent<'nav'> = styled('nav', {
  display: 'none',
  alignItems: 'center',
  zIndex: 1,
  '@md': {
    display: 'flex',
  },
});

export const StyledUl: StyledComponent<
  'ul',
  { ref?: React.ForwardedRef<HTMLUListElement> }
> = styled('ul', {
  display: 'flex',
  gap: '$4',
  padding: 0,
  listStyle: 'none',
  width: '100%',
});

export const NavLink: StyledComponent<typeof Link> = styled(Link, {
  color: 'white',
  fontFamily: '$main',
  textDecoration: 'none',
  padding: '$1 $2',
  borderRadius: '$sm',

  variants: {
    'data-active': {
      true: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        color: 'black',
      },
    },
  },
});

export const AnimationBackgroundWrapper: StyledComponent<
  'div',
  { show?: boolean | 'true' | 'false' | undefined }
> = styled('div', {
  position: 'absolute',

  top: 0,
  left: 0,
  zIndex: 0,
  opacity: 0,

  defaultVariants: {
    show: true,
  },
  variants: {
    show: {
      true: {
        opacity: 1,
      },
      false: {
        opacity: 0,
      },
    },
  },
});

export const Spacer: StyledComponent<'div'> = styled('div', {
  flex: 1,
});
