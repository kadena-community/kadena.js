import { styled } from '@kadena/react-components';

export const StyledContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
});

export const StyledSection = styled('section', {
  backgroundColor: 'rgb(71 79 82 / 0.5)',
  paddingLeft: '2.5rem', //40px
  paddingRight: '2.5rem', // 40px
  paddingTop: '2rem', // 32px
  paddingBottom: '2rem', // 32px
});

export const StyledHeader = styled('header', {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '1.5rem', // 24px
});
