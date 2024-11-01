import { FC, lazy, ReactElement, Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const importView = async (key: string) =>
  lazy(() => import(`./views/${key}`).catch(() => import(`./views/Error`)));

export const Aside: FC = () => {
  const [view, setView] = useState<ReactElement | undefined>();
  const location = useLocation();
  console.log({ location });

  const loadView = async (data: Record<string, string>) => {
    const Result = await importView(data.aside);

    setView(<Result {...data} />);
  };
  useEffect(() => {
    if (!location.hash) return;

    const hashArray = location.hash
      .slice(1)
      .split('&')
      .reduce<Record<string, string>>((acc, val) => {
        const arr = val.split('=');
        if (arr.length < 2) return acc;

        //make sure that the component name is capitalized
        const value = arr[1].charAt(0).toUpperCase() + String(arr[1]).slice(1);

        acc[arr[0]] = value;
        return acc;
      }, {});

    loadView(hashArray);
  }, [location.hash]);

  return (
    <div>
      <Suspense fallback="Loading view...">{view}</Suspense>
    </div>
  );
};
