import { styled } from '@kadena/react-components';

export const Container = styled('div', {
  padding: '2rem',
});

export const EditorGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gridTemplateRows: '1fr',
  gridColumnGap: '1rem',
  gridRowGap: '1rem',
  marginTop: '2rem',
});

export const Details = styled('div', {
  fontSize: '$base',
  padding: '$2',
  background: 'rgba(71, 79, 82, 0.4)',
  borderRadius: '$sm',
  boxSizing: 'borderBox',
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
});
