import { RequestType } from '@/modules/communication/communication.provider';

export type Plugin = {
  id: string;
  name: string;
  registry: string;
  description: string;
  permissions: RequestType[];
  keepInBackground: boolean;
};
