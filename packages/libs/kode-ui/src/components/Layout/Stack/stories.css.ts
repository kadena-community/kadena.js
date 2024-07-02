import { styleVariants } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css';

export const itemSizeClass = styleVariants(vars.sizes, (size) => {
  return [
    {
      width: size,
      height: size,
    },
  ];
});
