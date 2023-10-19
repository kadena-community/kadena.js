import { Peer, DataConnection } from "peerjs";
import { safeJsonParse } from "../utils.js";
import { ResponseMessage } from "../types/messages.js";

export type Message<T> = {
  action: string;
  payload: T;
  error?: string;
  number: number;
};

export class RemoteConnectionServer {
  connectionId: string | null = null;

  private handlers = new Map<string, (payload: any) => any>();
  private peer: Peer | null = null;

  constructor(connectionId?: string) {
    if (connectionId) this.connectionId = connectionId;
  }

  setConnectionId(connectionId: string) {
    this.connectionId = connectionId;
  }

  setHandler(action: string, handler: (payload: any) => any) {
    this.handlers.set(action, handler);
  }

  listen() {
    return new Promise<void>((resolve, reject) => {
      if (!this.connectionId) {
        return reject(Error("listen() Error: connectionId not set"));
      }
      if (this.peer) {
        return reject(Error("listen() Error: peer already initialized"));
      }

      const peer = new Peer(this.connectionId);
      this.peer = peer;
      peer.on("open", (id) => {
        console.log("remote connection peer open", id);
        peer.on("connection", (conn) => {
          console.log("Listening to connection on:", this.connectionId);
          conn.on("open", () => {
            console.log("remote connection opened");
          });
          conn.on("error", (error) => {
            console.log("remote connection conn error", error);
          });
          conn.on("data", (data) => {
            if (typeof data !== "string") return;
            const parsed = safeJsonParse<Message<any>>(data);
            if (parsed) this.onRemoteMessage(conn, parsed);
          });
          conn.on("close", () => {
            console.log("conn remote connection closed");
          });
        });
        resolve();
      });
      peer.on("close", () => {
        console.log("peer connection closed");
      });
      peer.on("error", (error) => {
        console.log("remote connection peer error", error);
        reject("peer error");
      });
    });
  }

  disconnect() {
    this.peer?.destroy();
    this.peer = null;
  }

  private onRemoteMessage(conn: DataConnection, message: Message<any>) {
    console.log("onRemoteMessage", message);
    if (this.handlers.has(message.action)) {
      const handler = this.handlers.get(message.action)!;
      Promise.resolve(handler(message.payload))
        .then((payload) => {
          conn.send(
            JSON.stringify({
              action: "response",
              to_action: message.action,
              payload: payload ?? null,
              number: message.number,
            } as ResponseMessage<any, any>)
          );
        })
        .catch((error) => {
          console.log("onRemoteMessage error", error);
          conn.send(
            JSON.stringify({
              action: "response",
              to_action: message.action,
              payload: null,
              error: String(error),
              number: message.number,
            } as ResponseMessage<any, any>)
          );
        });
    } else {
      conn.send(
        JSON.stringify({
          action: "response",
          to_action: message.action,
          payload: null,
          error: "handler for action does not exist",
          number: message.number,
        } as ResponseMessage<any, any>)
      );
    }
  }
}
