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

export type Message =
  | {
      type: "insert";
      payload: IconPayload;
    }
  | {
      type: "drop";
      payload: DropPayload;
    }
  | {
      type: "log";
      payload?: any;
    };

export type InjectableNode =
  | PageNode
  | FrameNode
  | GroupNode
  | ComponentNode
  | (BaseNode & ChildrenMixin);
