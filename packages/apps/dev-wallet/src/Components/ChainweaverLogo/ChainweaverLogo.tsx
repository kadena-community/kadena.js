import {
  ChainweaverAlphaLogoKdacolorDark,
  ChainweaverAlphaLogoKdacolorLight,
} from '@kadena/kode-icons/product';
import { useTheme } from '@kadena/kode-ui';
import { FC } from 'react';

export const ChainWeaverLogo: FC<{ width?: number; height?: number }> = (
  props,
) => {
  const { theme } = useTheme();

  return theme === 'dark' ? (
    <ChainweaverAlphaLogoKdacolorDark {...props} />
  ) : (
    <ChainweaverAlphaLogoKdacolorLight {...props} />
  );
};
