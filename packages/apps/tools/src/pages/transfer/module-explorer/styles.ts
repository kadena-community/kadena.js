import { styled } from '@kadena/react-components';

export const StyledForm = styled('form', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
});

export const StyledAccountForm = styled('div', {
  width: '100%',
  padding: '$4',
  background: 'rgba(71, 79, 82, 0.4)',
  borderRadius: '$sm',
  boxSizing: 'borderBox',
  '> *': {
    mb: '$8',
  },
});

export const StyledFormButton = styled('div', {
  mt: '$4',
});

export const StyledResultContainer = styled('div', {
  fontSize: '$base',
});

export const StyledCodeViewerContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',

  margin: '4% auto',
  padding: '$2',
  borderRadius: '$sm',
  background: 'rgba(5, 5, 5, 0.5)',
});

export const StyledTotalContainer = styled(StyledCodeViewerContainer, {
  alignItems: 'center',
});

export const StyledTotalChunk = styled('div', {
  width: '50%',
});

export const StyledList = styled('div', {
  width: '100%',
  padding: '$4',
  background: 'rgba(71, 79, 82, 0.4)',
  borderRadius: '$sm',
  boxSizing: 'borderBox',
  mt: '$8',
});

export const StyledListItem = styled('div', {
  py: '$3',
  px: '$6',
  color: '#FFFFFF',
  cursor: 'pointer',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  '&:first-child': {
    borderTopLeftRadius: '$1',
    borderTopRightRadius: '$1',
  },
  '&:last-child': {
    borderBottomLeftRadius: '$1',
    borderBottomRightRadius: '$1',
  },
  '&:hover': {
    background: 'rgba(5, 5, 5, 0.5);',
    fontWeight: '$medium',
    textDecorationLine: 'underline',
  },
});
