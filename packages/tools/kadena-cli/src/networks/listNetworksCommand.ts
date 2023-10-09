import { displayNetworksConfig } from './networksHelpers.js';

export interface IListNetworksArgs {}

export const listNetworksAction = (args: IListNetworksArgs): void => {
  displayNetworksConfig();
};
