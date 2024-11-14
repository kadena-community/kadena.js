import { Stack } from '@kadena/kode-ui';
import { createPortal } from 'react-dom';

const loadingContent = document.getElementById('loading-content');

export function LoadingContent({ children }: { children: React.ReactNode }) {
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
