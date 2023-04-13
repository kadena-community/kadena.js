import { styled, StyledComponent } from '@kadena/react-components';

export const Wrapper: StyledComponent<'div'> = styled('div', {
  maxWidth: '1440px',
  margin: '0 auto',
});

export const Template: StyledComponent<'div'> = styled('div', {
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
    background: 'lightYellow',

    gridTemplateColumns: 'auto 256px minmax(auto, 1184px) auto',
    gridTemplateAreas: `
        "header header header header"
        ". menu content ."
        "footer footer footer footer"
      `,
  },
});

export const Article: StyledComponent<'div'> = styled('div', {
  flex: 1,
});

export const Content: StyledComponent<'div'> = styled('div', {
  display: 'flex',
  gridArea: 'content',

  flex: 1,
});

export const Menu: StyledComponent<
  'div',
  { isOpen?: boolean | 'true' | 'false' | undefined }
> = styled('div', {
  gridArea: 'menu',
  position: 'absolute',
  top: '$17',
  background: 'blue',
  width: '100%',
  height: 'calc(100% - $17 - $17)',
  transform: 'translateX(-100%)',
  transition: 'transform .3s ease, width .3s ease',

  '@md': {
    position: 'relative',
    top: '0',
    height: '100%',
    width: '256px',
    transform: 'translateX(0)',
  },

  variants: {
    isOpen: {
      true: {
        transform: 'translateX(0)',
        '@md': {},
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
