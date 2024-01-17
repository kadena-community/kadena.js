import type { FC, PropsWithChildren } from 'react';

const UserLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <section>
      logged in
      {children}
    </section>
  );
};

export default UserLayout;
