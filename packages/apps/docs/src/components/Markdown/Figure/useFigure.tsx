import { useContext } from 'react';
import type { IUseFigureProps } from './FigureProvider';
import { FigureContext } from './FigureProvider';

const defaultContext: IUseFigureProps = {
  toggleModal: () => {},
};

export const useFigureModal = (): IUseFigureProps =>
  useContext(FigureContext) ?? defaultContext;
