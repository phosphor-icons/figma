import { IconStyle } from "@phosphor-icons/core";

export interface IconPayload {
  name: string;
  pascal_name: string;
  svg: string;
  weight: IconStyle;
  flatten?: boolean;
}

export interface DropPayload extends IconPayload {
  dropPosition: { clientX: number; clientY: number };
  offset: { x: number; y: number };
  windowSize: { width: number; height: number };
}

export interface ResizePayload {
  width: number;
  height: number;
}

export interface GetAsyncPayload {
  key: string;
}

export interface SetAsyncPayload<T = any> extends GetAsyncPayload {
  value: T;
}

export type ColorTheme = "dark" | "light";

export enum MessageType {
  INSERT = "icon_insert",
  DROP = "icon_drop",
  STORAGE_GET_REQUEST = "storage_get_req",
  STORAGE_SET_REQUEST = "storage_set_req",
  STORAGE_DELETE_REQUEST = "storage_delete_req",
  STORAGE_GET_RESPONSE = "storage_get_res",
  RESIZE = "resize",
  LOG = "log",
  CONFIG = "config",
}

export type PluginConfig = {
  editorType: PluginAPI["editorType"];
  theme?: ColorTheme;
};

export type Message<T = any> =
  | {
      type: MessageType.INSERT;
      payload: IconPayload;
    }
  | {
      type: MessageType.DROP;
      payload: DropPayload;
    }
  | {
      type: MessageType.STORAGE_GET_REQUEST;
      payload: GetAsyncPayload;
    }
  | {
      type: MessageType.STORAGE_SET_REQUEST;
      payload: SetAsyncPayload<T>;
    }
  | {
      type: MessageType.STORAGE_DELETE_REQUEST;
      payload: GetAsyncPayload;
    }
  | { type: MessageType.RESIZE; payload: ResizePayload }
  | {
      type: MessageType.LOG;
      payload?: any;
    }
  | {
      type: MessageType.CONFIG;
      payload: PluginConfig;
    };

export type Response<T> = {
  type: MessageType.STORAGE_GET_RESPONSE;
  payload: SetAsyncPayload<T>;
};

export type InjectableNode =
  | PageNode
  | FrameNode
  | GroupNode
  | ComponentNode
  | (BaseNode & ChildrenMixin);
