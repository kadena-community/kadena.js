import { IHeadingProps } from '@kadena/react-components';

import { ReactNode } from 'react';

export interface IHeadingLevelProps {
  children?: ReactNode;
  bold?: IHeadingProps['bold'];
}
