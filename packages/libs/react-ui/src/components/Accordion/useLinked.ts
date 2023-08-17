import { useState } from 'react';

interface IUseLinkedReturn {
  openSections: number[];
  setOpenSections: React.Dispatch<React.SetStateAction<number[]>>;
  usingLinked: boolean;
  setUsingLinked: React.Dispatch<React.SetStateAction<boolean>>;
}

const useLinked = (openSection = -1): IUseLinkedReturn => {
  const [usingLinked, setUsingLinked] = useState(false);
  const [openSections, setOpenSections] = useState([openSection]);
  return { openSections, setOpenSections, usingLinked, setUsingLinked };
};

export default useLinked;
