/* eslint @kadena-dev/typedef-var: 0 */
// TODO: Remove this when this issue is resolved: https://github.com/kadena-community/kadena.js/issues/201

import { Pact } from './svgs/Pact';
import { ProductIconContainer } from './styles';

import type { VariantProps } from '@stitches/react';
import React, { SVGProps } from 'react';

export interface IProcuctIconProps {
  size?: VariantProps<typeof ProductIconContainer>['size'];
}

export type ProductIconType = SVGProps<SVGSVGElement> & IProcuctIconProps;

const IconWrapper = (
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Component: React.FC<SVGProps<SVGSVGElement>>,
): React.FC<ProductIconType> => {
  const WrappedIcon: React.FC<SVGProps<SVGSVGElement> & IProcuctIconProps> = ({
    size = 'md',
    ...props
  }) => (
    <ProductIconContainer size={size}>
      <Component {...props} height={undefined} width={undefined} />
    </ProductIconContainer>
  );
  WrappedIcon.displayName = Component.displayName;
  return WrappedIcon;
};

export const ProcuctIcons = {
  Pact: IconWrapper(Pact),
} as const;
