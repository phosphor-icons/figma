import { AtomEffect } from "recoil";

import {
  GetAsyncPayload,
  SetAsyncPayload,
  Response,
  MessageType,
} from "../../common/types";

type StorageListener = (event: MessageEvent) => void;

export default class StorageProxy {
  static listeners: Record<string, StorageListener> = {};

  static register<T>({ node, setSelf, onSet }: Parameters<AtomEffect<T>>[0]) {
    const listener: StorageListener = (event) => {
      const { type, payload } = event.data.pluginMessage as Response<T>;
      if (type !== MessageType.STORAGE_GET_RESPONSE || payload.key !== node.key)
        return;
      setSelf(payload.value);
    };

    window.addEventListener("message", listener);

    onSet((value, _, isReset) => {
      if (isReset) {
        StorageProxy.requestReset({ key: node.key });
      } else {
        StorageProxy.requestSet({ key: node.key, value });
      }
    });

    StorageProxy.listeners[node.key] = listener;

    StorageProxy.requestGet({ key: node.key });
  }

  static unregister(key: string) {
    window.removeEventListener("message", StorageProxy.listeners[key]);
    delete StorageProxy.listeners[key];
  }

  static requestGet(payload: GetAsyncPayload) {
    parent.postMessage(
      {
        pluginMessage: {
          type: MessageType.STORAGE_GET_REQUEST,
          payload,
        },
      },
      "*"
    );
  }

  static requestSet<T>(payload: SetAsyncPayload<T>) {
    parent.postMessage(
      {
        pluginMessage: {
          type: MessageType.STORAGE_SET_REQUEST,
          payload,
        },
      },
      "*"
    );
  }

  static requestReset(payload: GetAsyncPayload) {
    parent.postMessage(
      {
        pluginMessage: {
          type: MessageType.STORAGE_DELETE_REQUEST,
          payload,
        },
      },
      "*"
    );
  }

  static dispose() {
    for (const listener of Object.keys(StorageProxy.listeners)) {
      StorageProxy.unregister(listener);
    }
  }
}
