import { styled } from '@kadena/react-components';

import { StyledComponentType } from './../Header/styles';

export const Wrapper: StyledComponentType<HTMLDivElement> = styled('div', {
  maxWidth: '1440px',
  margin: '0 auto',
});

export const Template: StyledComponentType<HTMLDivElement> = styled('div', {
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

export const Article: StyledComponentType<HTMLDivElement> = styled('div', {
  flex: 1,
});

export const Content: StyledComponentType<HTMLDivElement> = styled('div', {
  display: 'flex',
  gridArea: 'content',

  flex: 1,
});

export const Menu: StyledComponentType<HTMLDivElement> = styled('div', {
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
});
