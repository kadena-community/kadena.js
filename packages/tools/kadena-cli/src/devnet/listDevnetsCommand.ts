import { displayDevnetsConfig } from './devnetsHelpers.js';

export interface IListDevnetsArgs {}

export const listDevnetsAction = (args: IListDevnetsArgs): void => {
  displayDevnetsConfig();
};
