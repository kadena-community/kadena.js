import { Stack } from '@kadena/kode-ui';
import { createPortal } from 'react-dom';

export function LoadingContent({ children }: { children: React.ReactNode }) {
  const loadingContent = document.getElementById('loading-content');
  if (!loadingContent) {
    return children;
  }
  return createPortal(
    <Stack justifyContent={'flex-start'} alignItems={'flex-start'}>
      {children}
    </Stack>,
    loadingContent,
  );
}
