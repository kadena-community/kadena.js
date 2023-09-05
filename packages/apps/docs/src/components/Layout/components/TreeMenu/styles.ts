import type { StyledComponent } from '@kadena/react-components';
import { styled } from '@kadena/react-components';

import Link from 'next/link';

// ref?: React.MutableRefObject<HTMLUListElement | null | undefined>;

export const StyledTreeList: StyledComponent<
  'ul',
  {
    menuOpen?: boolean | 'true' | 'false' | undefined;
    root?: boolean | 'true' | 'false' | undefined;
    level?: 'l1' | 'l2' | 'l3' | undefined;
  }
> = styled('ul', {
  padding: 0,
  listStyle: 'none',
  overflowY: 'hidden',

  transition: 'all .5s ease',

  defaultVariant: {
    menuOpen: false,
    level: 'l1',
  },
  variants: {
    level: {
      l1: {},
      l2: {},
      l3: {
        marginLeft: '$1',
        borderLeft: '1px solid $borderColor',
      },
    },
    root: {
      false: {},
      true: {
        height: 'auto!important',
      },
    },
    menuOpen: {
      false: {
        height: 0,
        pointerEvent: 'none',
      },
      true: {
        pointerEvent: 'auto',
      },
    },
  },
});

const Level1ItemStyle: Record<string, string> = {
  display: 'block',
  borderBottom: '1px solid $borderColor',
  padding: '$4 0 $2',
  cursor: 'pointer',
  fontWeight: '$bold',
};

const Level2ItemStyle: Record<string, string | number> = {
  display: 'block',
  py: '$2',
  px: '0',
  cursor: 'pointer',
  border: 0,
};

const Level3ItemStyle: Record<string, string | number> = {
  display: 'block',
  px: '$3',
  py: '0',
  cursor: 'pointer',
  border: 0,
};

export const StyledButton: StyledComponent<
  'button',
  {
    level?: 'l1' | 'l2' | 'l3' | undefined;
    menuOpen?: boolean | 'true' | 'false' | undefined;
  }
> = styled('button', {
  position: 'relative',
  border: 0,
  width: '100%',
  textAlign: 'left',
  background: 'transparent',
  textTransform: 'capitalize',
  fontSize: '$base',
  color: '$foreground',
  '&:hover': {
    color: '$primaryHighContrast',
  },

  defaultVariants: {
    level: 'l1',
    menuOpen: false,
  },
  variants: {
    menuOpen: {
      true: {
        color: '$primaryContrast',
      },
      false: {},
    },
    level: {
      l1: {
        ...Level1ItemStyle,
        '&::after': {
          position: 'absolute',
          right: '$1',
          content: '+',
          fontWeight: '$light',
          transform: 'translate(0, 0) rotate(0)',
          transition: 'transform .2s ease ',
        },
      },
      l2: {
        ...Level2ItemStyle,
        px: '$4',

        '&::before': {
          position: 'absolute',
          left: '-$2',
          content: '',
          width: '$2',
          height: '$2',
          borderRight: '2px solid $borderColor',
          borderTop: '2px solid $borderColor',
          transform: 'translate($sizes$2, $sizes$1) rotate(45deg)',
          transition: 'transform .2s ease ',
        },
      },
      l3: {
        ...Level3ItemStyle,
        fontSize: '$sm',
      },
    },
  },
  compoundVariants: [
    {
      level: 'l1',
      menuOpen: true,
      css: {
        '&::after': {
          transform: 'translate(1px, 1px)  rotate(45deg)',
        },
      },
    },
    {
      level: 'l2',
      menuOpen: true,
      css: {
        '&::before': {
          transform: 'translate($sizes$2, $sizes$1) rotate(135deg)',
        },
      },
    },
  ],
});

const ListItemVariant: Record<string, string | Record<string, string>> = {
  '&::before': {
    content: '∙',
    fontWeight: '$bold',
    display: 'inline-block',
    width: '$4',
  },
};

export const StyledLink: StyledComponent<
  typeof Link,
  { level?: 'l1' | 'l2' | 'l3'; active?: boolean | 'true' | 'false' }
> = styled(Link, {
  textDecoration: 'none',
  color: '$foreground',
  textTransform: 'capitalize',
  '&:hover': {
    color: '$primaryHighContrast',
  },
  defaultVariants: {
    level: 'l1',
    active: false,
  },
  variants: {
    active: {
      false: {},
      true: {
        color: '$primaryContrast',
      },
    },
    level: {
      l1: {
        ...Level1ItemStyle,
      },
      l2: {
        ...ListItemVariant,
        ...Level2ItemStyle,
      },
      l3: {
        ...ListItemVariant,
        ...Level3ItemStyle,
        fontSize: '$sm',
      },
    },
  },
});
