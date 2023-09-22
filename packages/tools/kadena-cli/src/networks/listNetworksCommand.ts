import { displayNetworksConfig } from './networksHelpers';

export interface IListNetworksArgs {}

export const listNetworksAction = (args: IListNetworksArgs): void => {
  displayNetworksConfig();
};
