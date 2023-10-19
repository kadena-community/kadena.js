import { type IUnsignedCommand } from "@kadena/client";

export type SendMessage<Action extends string, Payload> = {
  action: Action;
  payload: Payload;
  number: number;
};

export type ResponseMessage<Action extends string, Response> = {
  action: "response";
  to_action: Action;
  payload: Response | null;
  error?: string;
  number: number;
};

export type Message<Action extends string, Payload, Response> = [
  Action,
  SendMessage<Action, Payload>,
  ResponseMessage<Action, Response>
];

export type SignMessage = Message<"sign", IUnsignedCommand, IUnsignedCommand>;

export type RegistryTransferMessage = Message<
  "registryTransfer",
  {
    fromAlias: string;
    toAlias: string;
    transactions: IUnsignedCommand[];
  },
  IUnsignedCommand[]
>;

export type GetPublicKeysMessage = Message<"getPublicKeys", null, string[]>;

export type RegistryLookupResult = {
  account: string;
};

export type Messages =
  | SignMessage
  | RegistryTransferMessage
  | GetPublicKeysMessage;

export type MessagesMap = {
  [index in Messages[1]["action"]]: Extract<Messages[1], { action: index }>;
};
export type MessagesReplyMap = {
  [index in Messages[1]["action"]]: Extract<Messages[2], { to_action: index }>;
};

export type Send = <A extends Messages[0]>(
  action: A,
  payload: Extract<Messages[1], { action: A }>["payload"]
) => Promise<any | null>;
