/* eslint-disable @typescript-eslint/no-explicit-any */
import { Peer, DataConnection } from "peerjs";
import { safeJsonParse } from "../utils.js";
import {
  MessagesMap,
  MessagesReplyMap,
  ResponseMessage,
} from "../types/messages.js";

export class RemoteConnectionClient {
  connectionId: string | null = null;
  connected: boolean = false;

  private number = 0;
  private peer: Peer | null = null;
  private conn: DataConnection | null = null;
  private callbacks = new Map<
    number,
    (data: ResponseMessage<any, any>) => void
  >();

  constructor(connectionId?: string) {
    if (connectionId) this.connectionId = connectionId;
  }

  setConnectionId(connectionId: string) {
    this.connectionId = connectionId;
  }

  connect() {
    return new Promise<void>((resolve, reject) => {
      if (!this.connectionId) return reject(Error("no connection id"));
      const peer = new Peer();
      this.peer = peer;
      this.peer.on("open", () => {
        const conn = peer.connect(this.connectionId!);
        this.conn = conn;
        console.log("Listening to connection on:", this.connectionId);
        conn.on("open", () => {
          this.connected = true;
          resolve();
        });
        conn.on("error", (err) => {
          reject(err);
        });
        conn.on("data", (data) => {
          if (typeof data !== "string") return;
          const parsed = safeJsonParse<ResponseMessage<any, any>>(data);
          if (parsed) this.onRemoteMessage(parsed);
        });
        conn.on("close", () => {
          this.connected = false;
        });
      });
    });
  }

  disconnect() {
    this.conn?.close();
    this.peer?.disconnect();
    this.conn = null;
    this.peer = null;
  }

  private onRemoteMessage(message: ResponseMessage<any, any>) {
    console.log("onRemoteMessage", message);
    if (message.action === "response" && this.callbacks.has(message.number)) {
      this.callbacks.get(message.number)?.(message);
      this.callbacks.delete(message.number);
    }
  }

  async send<A extends keyof MessagesMap>(
    action: A,
    payload: MessagesMap[A]["payload"]
  ): Promise<MessagesReplyMap[A]["payload"]> {
    if (!this.connected) await this.connect();
    if (!this.connected || !this.conn) {
      console.log("send failed, not connected");
      return null;
    }
    this.number++;
    this.conn.send(JSON.stringify({ action, payload, number: this.number }));
    return new Promise((resolve) => {
      this.callbacks.set(this.number, (data) => {
        resolve(data.payload);
      });
    });
  }
}
