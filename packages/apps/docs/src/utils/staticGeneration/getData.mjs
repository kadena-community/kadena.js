import { menuData } from './../../_generated/menu.mjs';
import authorData from '../../data/authors.json' assert { type: 'json' };

export const getData = () => {
  return menuData;
};

export const getAuthorData = () => {
  return authorData;
};
