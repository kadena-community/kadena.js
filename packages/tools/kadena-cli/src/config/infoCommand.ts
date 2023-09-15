import { displayConfig, displayContext } from '../utils/display';
import { getConfig, getContext, getFullConfig } from '../utils/globalConfig';

export interface IFullConfigurationArgs {}
export interface ICurrentContextArgs {}
export interface IConfigurationArgs {}
export interface IPublicKeyArgs {}
export interface IPrivateKeyArgs {}

export const fullConfigurationAction = (args: IFullConfigurationArgs): void => {
  displayConfig(getFullConfig());
};

export const currentContextAction = (args: ICurrentContextArgs): void => {
  displayContext(getContext());
};

export const configurationAction = (args: IConfigurationArgs): void => {
  displayConfig(getConfig());
};

export const publicKeyAction = (args: IPublicKeyArgs): void => {
  displayConfig(getConfig(), ['publicKey']);
};

export const privateKeyAction = (args: IPrivateKeyArgs): void => {
  displayConfig(getConfig(), ['privateKey']);
};
