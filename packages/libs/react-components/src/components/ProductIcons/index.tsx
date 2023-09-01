/* eslint @kadena-dev/typedef-var: 0 */
// TODO: Remove this when this issue is resolved: https://github.com/kadena-community/kadena.js/issues/201

import { Concepts } from './svgs/Concepts';
import { Contribute } from './svgs/Contribute';
import { KadenaOverview } from './svgs/KadenaOverview';
import { ManageKda } from './svgs/ManageKda';
import { Overview } from './svgs/Overview';
import { PactDeveloper } from './svgs/PactDeveloper';
import { PactLanguage } from './svgs/PactLanguage';
import { QuickStart } from './svgs/QuickStart';
import { RestApi } from './svgs/RestApi';
import { SmartContract } from './svgs/SmartContract';
import { Syntax } from './svgs/Syntax';
import { UsefulTools } from './svgs/UsefulTools';
import { Whitepapers } from './svgs/Whitepapers';
import { ProductIconContainer } from './styles';

import type { VariantProps } from '@stitches/react';
import React, { type SVGProps } from 'react';

export interface IProductIconProps {
  size?: VariantProps<typeof ProductIconContainer>['size'];
}

export type ProductIconType = SVGProps<SVGSVGElement> & IProductIconProps;

const IconWrapper = (
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Component: React.FC<SVGProps<SVGSVGElement>>,
): React.FC<ProductIconType> => {
  const WrappedIcon: React.FC<SVGProps<SVGSVGElement> & IProductIconProps> = ({
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

export const ProductIcons = {
  Concepts: IconWrapper(Concepts),
  Contribute: IconWrapper(Contribute),
  KadenaOverview: IconWrapper(KadenaOverview),
  ManageKda: IconWrapper(ManageKda),
  Overview: IconWrapper(Overview),
  PactDeveloper: IconWrapper(PactDeveloper),
  PactLanguage: IconWrapper(PactLanguage),
  QuickStart: IconWrapper(QuickStart),
  RestApi: IconWrapper(RestApi),
  SmartContract: IconWrapper(SmartContract),
  Syntax: IconWrapper(Syntax),
  UsefulTools: IconWrapper(UsefulTools),
  Whitepapers: IconWrapper(Whitepapers),
} as const;
