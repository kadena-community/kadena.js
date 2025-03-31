import { FC, useEffect } from 'react';
import { ICardContentProps, useCardLayout } from './CardLayoutProvider';

type IProps = ICardContentProps & {
  refreshDependencies?: any[];
};
export const CardContent: FC<IProps> = ({
  refreshDependencies = [],
  ...props
}) => {
  const { setContent } = useCardLayout();

  useEffect(() => {
    setContent(props);
  }, [props.id, ...refreshDependencies]);

  return null;
};
