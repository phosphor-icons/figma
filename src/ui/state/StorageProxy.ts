import { StoreApi } from "zustand";

import {
  GetAsyncPayload,
  SetAsyncPayload,
  Response,
  MessageType,
} from "../../common/types";

type StorageListener = (event: MessageEvent) => void;

const STORAGE_KEYS: Record<string, keyof any> = {
  iconWeightAtom: "iconWeight",
  iconColorAtom: "iconColor",
  flattenAtom: "flatten",
};

export default class StorageProxy {
  static listener: StorageListener | null = null;

  static hydrate(store: StoreApi<any>) {
    StorageProxy.listener = (event) => {
      const msg = event.data?.pluginMessage;
      if (!msg || msg.type !== MessageType.STORAGE_GET_RESPONSE) return;

      const stateKey = STORAGE_KEYS[msg.payload.key];
      if (stateKey && msg.payload.value !== undefined) {
        store.setState({ [stateKey]: msg.payload.value });
      }
    };

    window.addEventListener("message", StorageProxy.listener);

    // Request stored values for all persisted keys
    for (const key of Object.keys(STORAGE_KEYS)) {
      StorageProxy.requestGet({ key });
    }
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
    if (StorageProxy.listener) {
      window.removeEventListener("message", StorageProxy.listener);
      StorageProxy.listener = null;
    }
  }
}
