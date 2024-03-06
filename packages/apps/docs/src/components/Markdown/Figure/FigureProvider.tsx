import React, { createContext, useContext, useState } from 'react';
import { imageModalAltTextClass, imageModalClass } from './styles.css';

export interface IUseFigureProps {
  toggleModal: (src?: string, alt?: string) => void;
}

export const FigureContext = createContext<IUseFigureProps | undefined>(
  undefined,
);

export const FigureProvider: React.FC<ITMenuProviderProps> = (props) => {
  const context = useContext(FigureContext);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [src, setSrc] = useState<string | undefined>();
  const [alt, setAlt] = useState<string | undefined>();

  const toggleModal = (val?: string, altVal?: string): void => {
    setIsModalOpen((v) => !v);
    setSrc(val);
    console.log({ altVal });
    setAlt(altVal);
  };

  if (context) return <>{props.children}</>;
  return (
    <FigureContext.Provider value={{ toggleModal }}>
      <>
        {isModalOpen && src && (
          <div className={imageModalClass} onClick={() => toggleModal()}>
            <img key={src} src={src} />

            {alt ? (
              <figcaption className={imageModalAltTextClass}>{alt}</figcaption>
            ) : null}
          </div>
        )}

        {props.children}
      </>
    </FigureContext.Provider>
  );
};
