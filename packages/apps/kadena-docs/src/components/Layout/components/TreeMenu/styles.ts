import { styled, StyledComponent } from '@kadena/react-components';

import Link from 'next/link';

export const StyledTreeList: StyledComponent<
  'ul',
  {
    menuOpen?: boolean | 'true' | 'false' | undefined;
    root?: boolean | 'true' | 'false' | undefined;
  }
> = styled('ul', {
  padding: 0,
  listStyle: 'none',
  overflowY: 'hidden',

  transition: 'all .5s ease',

  defaultVariant: {
    menuOpen: false,
  },
  variants: {
    root: {
      false: {},
      true: {},
    },
    menuOpen: {
      false: {
        maxHeight: 0,
        pointerEvent: 'none',
      },
      true: {
        maxHeight: '2000px',
        pointerEvent: 'auto',
      },
    },
  },
});

const ListVariant = {
  '&::before': {
    content: '∙',
    fontWeight: '$bold',
    display: 'inline-block',
    width: '$4',
  },
};

const Level1Style = {
  display: 'block',
  borderBottom: '1px solid $neutral3',
  padding: '$4 0 $2',
  cursor: 'pointer',
  fontWeight: '$bold',
};

const Level2Style = {
  display: 'block',
  py: '$2',
  px: '0',
  cursor: 'pointer',
  border: 0,
};

const Level3Style = {
  display: 'block',
  px: '$6',
  py: '0',
  cursor: 'pointer',
  border: 0,
};

export const StyledButton: StyledComponent<
  'button',
  {
    level?: number | '1' | '2' | '3' | undefined;
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

  defaultVariants: {
    level: '1',
    menuOpen: false,
  },
  variants: {
    menuOpen: {
      true: {},
      false: {},
    },
    level: {
      '1': {
        ...Level1Style,
      },
      '2': {
        ...Level2Style,
        px: '$4',

        '&::before': {
          position: 'absolute',
          left: '-$2',
          content: '',
          width: '$2',
          height: '$2',
          borderRight: '2px solid $neutral4',
          borderTop: '2px solid $neutral4',
          transform: 'translate($sizes$2, $sizes$1) rotate(45deg)',
          transition: 'transform .2s ease ',
        },
      },
      '3': {
        ...Level3Style,
        fontSize: '$sm',
      },
    },
  },
  compoundVariants: [
    {
      level: '2',
      menuOpen: true,
      css: {
        '&::before': {
          transform: 'translate($sizes$2, $sizes$1) rotate(135deg)',
        },
      },
    },
  ],
});

export const StyledLink: StyledComponent<
  typeof Link,
  { level?: number | '1' | '2' | '3' | undefined }
> = styled(Link, {
  textDecoration: 'none',
  color: '$primaryHighContrast',
  textTransform: 'capitalize',
  defaultVariants: {
    level: '1',
  },
  variants: {
    level: {
      '1': {
        ...Level1Style,
      },
      '2': {
        ...ListVariant,
        ...Level2Style,
      },
      '3': {
        ...ListVariant,
        ...Level3Style,
        fontSize: '$sm',
      },
    },
  },
});
