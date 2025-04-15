import { RequestType } from '@/modules/communication/communication.provider';

export type Permission = `MSG:${RequestType}` | `MODE:${"BACKGROUND" | "FOREGROUND"}`;

export type Plugin = {
  id: string;
  name: string;
  registry: string;
  description: string;
  permissions: Permission[];
};
