import type { FC } from 'react';

interface IProps {
  params: {
    id: string;
  };
}

const Page: FC<IProps> = ({ params }) => {
  return (
    <div>
      scanned Proof Of Us with ID ({params.id})<section></section>
    </div>
  );
};

export default Page;
