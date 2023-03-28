import { styled } from '../../styles/stitches.config';

import * as RadixSwitch from '@radix-ui/react-switch';
import React, { FC } from 'react';

const StyledRoot = styled(RadixSwitch.Root, {
  $$disabledColor: '$colors$blue500',
  $$enabledColor: '$colors$black',

  all: 'unset',
  width: '$10',
  height: '$6',
  backgroundColor: '$$disabledColor',
  borderRadius: '$round',
  position: 'relative',
  '&:focus': {
    boxShadow: '$1',
  },
  '&[data-state="checked"]': {
    backgroundColor: '$$enabledColor',
  },
});

const StyledThumb = styled(RadixSwitch.Thumb, {
  backgroundColor: '$background',
  display: 'block',
  width: '$5',
  height: '$5',
  borderRadius: '$round',
  transition: 'transform 100ms',
  transform: 'translateX(2px)',
  willChange: 'transform',
  '&[data-state="checked"]': {
    transform: `translateX(calc($sizes$5 - 2px))`,
  },
});

export const Switch: FC = () => {
  return (
    <StyledRoot>
      <StyledThumb />
    </StyledRoot>
  );
};
