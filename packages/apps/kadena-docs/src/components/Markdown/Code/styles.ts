import { styled, StyledComponent } from '@kadena/react-components';

export const StyledCode: StyledComponent<'code'> = styled('code', {
  counterReset: 'line',
  whiteSpace: 'break-spaces',

  '& > .line::before': {
    counterIncrement: 'line',
    content: 'counter(line)',

    /* Other styling */
    display: 'inline-block',
    width: '1rem',
    marginRight: '2rem',
    textAlign: 'right',
    color: 'gray',
  },

  '&[data-line-numbers-max-digits="2"] > .line::before': {
    width: '2rem',
  },

  '&[data-line-numbers-max-digits="3"] > .line::before': {
    width: '3rem',
  },
});
