import { getData } from '@/utils/staticGeneration/getData.mjs';
import { useMemo } from 'react';
import yaml from './../../../config.yaml';

export const useConfig = () => {
  const { menu } = yaml;
  const dataTree = useMemo(() => {
    return getData();
  }, []);

  console.log({ menu });

  return { menu };
};
