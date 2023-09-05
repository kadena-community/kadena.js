import { ThemeContext } from './ThemeProvider';
import type { IUseThemeProps } from './types';

import { useContext } from 'react';

/**
 *
 * @TODO: this hook will be replaced by https://www.npmjs.com/package/next-themes
 * This can be done when @kadena/react-components is removed from the docs
 *
 * reason:
 * We are using 2 component libs (@kadena/react-components and @kadena/react-ui)
 * When we want to swith the theme for them, they both set a classname in the body
 * NextThemes can only handle 1 classname (it cant handle spaces in the classstring.)
 * I changed this around line 189.
 *
 * I added a story on Asana to track this issue:
 * https://app.asana.com/0/1204958723576385/1204997894847031/f
 *
 */

const defaultContext: IUseThemeProps = { setTheme: () => {}, themes: [] };

export const useTheme = (): IUseThemeProps =>
  useContext(ThemeContext) ?? defaultContext;
