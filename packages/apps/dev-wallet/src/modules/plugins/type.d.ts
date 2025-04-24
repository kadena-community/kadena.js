import { RequestType } from '@/modules/communication/communication.provider';

type PluginMode =
  | 'BACKGROUND' // the plugin can run in the background
  | 'FOREGROUND' // the plugin can run in the foreground
  | 'ON_START'; // the plugin runs on start

export type Permission = `MSG:${RequestType}` | `MODE:${PluginMode}`;

export type Plugin = {
  id: string;
  name: string;
  registry: string;
  description: string;
  permissions: Permission[];
};
