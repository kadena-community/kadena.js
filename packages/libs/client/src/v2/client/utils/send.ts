import { ICommandRequest, request } from './request';

// eslint-disable-next-line @rushstack/typedef-var
export const send = request<ICommandRequest[], string[]>('send');
