import { styled, StyledComponent } from '@kadena/react-components';

//@TODO: this should be included as a variant in button component. (variant="link")
export const ConsentButton: StyledComponent<
  'button',
  {
    color?: 'positive' | 'negative';
  }
> = styled('button', {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'transparent',
  border: 0,
  cursor: 'pointer',
  defaultVariant: 'positive',
  variants: {
    color: {
      positive: {
        color: '$positiveContrast',
        '&:hover': {
          color: '$positiveHighContrast',
        },
      },
      negative: {
        color: '$negativeContrast',
        '&:hover': {
          color: '$negativeHighContrast',
        },
      },
    },
  },
});
