import { KadenaLogo } from './svgs/Kadena';
import { KadenaDevToolsLogo } from './svgs/KadenaDevTools';
import { KadenaDocsLogo } from './svgs/KadenaDocs';

import type { FC, SVGProps } from 'react';
import React from 'react';

// eslint-disable-next-line @kadena-dev/typedef-var
export const logoVariants = ['Kadena', 'DevTools', 'Docs'] as const;
export type LogoVariant = (typeof logoVariants)[number];

interface IBrandLogoProps {
  variant?: LogoVariant;
}

const renderSwitch = (
  logo: LogoVariant = 'Kadena',
): FC<SVGProps<SVGSVGElement>> => {
  switch (logo) {
    case 'Docs':
      return KadenaDocsLogo;
    case 'DevTools':
      return KadenaDevToolsLogo;
    case 'Kadena':
    default:
      return KadenaLogo;
  }
};

const BrandLogo: FC<IBrandLogoProps> = ({ variant }) => {
  const LogoComponent = renderSwitch(variant);
  return <LogoComponent />;
};

export default BrandLogo;
