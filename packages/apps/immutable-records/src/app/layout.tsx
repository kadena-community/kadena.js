import type { FC, PropsWithChildren } from 'react';

export const metadata = {
  title: 'Immutable Records',
  description: 'Immutable Records',
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
