import { KadenaLogo } from './variants/Kadena';
import { KadenaDevToolsLogo } from './variants/KadenaDevTools';
import { KadenaDocsLogo } from './variants/KadenaDocs';

import React, { FC, SVGProps } from 'react';

export type LogoVariant = 'default' | 'DevTools' | 'Docs';
export const logoVariants = ['default', 'DevTools', 'Docs'] as LogoVariant[]

const renderSwitch = (
  logo: LogoVariant = 'default',
): FC<SVGProps<SVGSVGElement>> => {
  switch (logo) {
    case 'Docs':
      return KadenaDocsLogo;
    case 'DevTools':
      return KadenaDevToolsLogo;
    default:
      return KadenaLogo;
  }
};

const Logo: FC<{ variant?: LogoVariant }> = ({ variant }) => {
  const LogoComponent = renderSwitch(variant);
  return <LogoComponent />;
};

export default Logo;
