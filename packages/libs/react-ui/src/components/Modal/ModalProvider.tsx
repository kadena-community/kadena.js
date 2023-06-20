import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useState,
} from 'react';

//Defining context
export const ModalContext = createContext({});

export interface IModalProviderProps {
  children?: ReactNode;
}

export const ModalProvider: FC<IModalProviderProps> = ({ children }) => {
  const [openModal, setOpenModal] = useState<boolean>(true);

  return (
    <ModalContext.Provider value={{ openModal, setOpenModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const { setOpenModal, openModal } = useContext(ModalContext);

  return { setOpenModal, openModal };
};
