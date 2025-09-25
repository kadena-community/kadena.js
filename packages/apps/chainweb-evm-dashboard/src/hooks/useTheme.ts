import { useEffect} from "react";
import { useAppState } from "../store/selectors";
import { darkThemeClass } from '@kadena/kode-ui/styles';

export const useTheme = () => {
  const uxStateTheme = useAppState((state) => state.ux.theme);

  useEffect(() => {
    if (!uxStateTheme?.mode) return;

    if (uxStateTheme.mode === 'dark' || (uxStateTheme.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add(darkThemeClass);
      document.documentElement.style.removeProperty('color-scheme');
      document.documentElement.style.setProperty('color-scheme', 'dark');
    } else {
      document.documentElement.classList.remove(darkThemeClass);
      document.documentElement.classList.add('light');
      document.documentElement.style.removeProperty('color-scheme');
      document.documentElement.style.setProperty('color-scheme', 'light');
    }
  }, [uxStateTheme?.mode]);

  return {
    theme: uxStateTheme?.mode ?? 'system',
  };
};
