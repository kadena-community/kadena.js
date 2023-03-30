import * as Layouts from '@/components/Layout';

export const getLayout = (layout: string) => {
  switch (layout.toLowerCase()) {
    case 'landing':
      return Layouts.Landing;
    case 'codeside':
    case 'code':
      return Layouts.CodeSide;
    default:
      return Layouts.Full;
  }
};
