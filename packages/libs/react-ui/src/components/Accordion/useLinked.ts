import { useState } from 'react';

interface IUseLinkedReturn {
  activeSection: number;
  setActiveSection: React.Dispatch<React.SetStateAction<number>>;
  usingLinked: boolean;
  setUsingLinked: React.Dispatch<React.SetStateAction<boolean>>;
}

const useLinked = (openSection = 0): IUseLinkedReturn => {
  const [usingLinked, setUsingLinked] = useState(false);
  const [activeSection, setActiveSection] = useState(openSection);
  return { activeSection, setActiveSection, usingLinked, setUsingLinked };
};

export default useLinked;
