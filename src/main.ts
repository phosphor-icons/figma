import {
  CUSTOM_NODE_KEY,
  WINDOW_SIZE_KEY,
  DEFAULT_WINDOW_SIZE,
} from "./constants";
import {
  DropPayload,
  IconPayload,
  ResizePayload,
  GetAsyncPayload,
  SetAsyncPayload,
  Message,
  MessageType,
} from "./types";
import { fetchRawIcon, getInjectableNode, getOffsetVector } from "./utils";

let hasTriedDragAndDrop = false;

main();
async function main() {
  figma.ui.onmessage = ({ type, payload }: Message) => {
    switch (type) {
      case MessageType.INSERT:
        insertIcon(payload);
        break;
      case MessageType.DROP:
        hasTriedDragAndDrop = true;
        dropIcon(payload);
        break;
      case MessageType.RESIZE:
        resize(payload);
        break;
      case MessageType.STORAGE_GET_REQUEST:
        getRequest(payload);
        break;
      case MessageType.STORAGE_SET_REQUEST:
        setRequest(payload);
        break;
      case MessageType.STORAGE_DELETE_REQUEST:
        deleteRequest(payload);
        break;
      case MessageType.LOG:
      default:
        console.log("Log: ", payload);
    }
  };

  const { width, height }: ResizePayload =
    (await figma.clientStorage.getAsync(WINDOW_SIZE_KEY)) ??
    DEFAULT_WINDOW_SIZE;

  figma.showUI(__html__, { width, height, themeColors: true });
}

async function getRequest(payload: GetAsyncPayload) {
  const value = await figma.clientStorage.getAsync(payload.key);
  if (typeof value !== "undefined") {
    figma.ui.postMessage({
      type: MessageType.STORAGE_GET_RESPONSE,
      payload: { key: payload.key, value },
    });
  }
}

async function setRequest(payload: SetAsyncPayload) {
  return figma.clientStorage.setAsync(payload.key, payload.value);
}

async function deleteRequest(payload: GetAsyncPayload) {
  return figma.clientStorage.deleteAsync(payload.key);
}

async function insertIcon(payload: IconPayload) {
  const svg = payload.flatten ? payload.svg : await fetchRawIcon(payload);

  const [currentSelection] = figma.currentPage.selection;
  const injectableNode = getInjectableNode(currentSelection);
  const frame = figma.createNodeFromSvg(svg);

  if (!payload.flatten) {
    frame.rescale(1 / 8);
  }

  const { x, y } = getOffsetVector(currentSelection);

  frame.setPluginData(CUSTOM_NODE_KEY, "true");
  frame.name = payload.pascal_name;
  frame.constrainProportions = true;
  frame.x = x;
  frame.y = y;

  injectableNode.appendChild(frame);

  figma.currentPage.selection = [frame];
  figma.notify(`Inserted ${payload.pascal_name}`, { timeout: 2000 });

  if (!hasTriedDragAndDrop) {
    setTimeout(() => {
      if (!hasTriedDragAndDrop)
        figma.notify("Try drag-and-drop too!", { timeout: 4000 });
      hasTriedDragAndDrop = true;
    }, 4000);
  }
}

async function dropIcon(payload: DropPayload) {
  const { pascal_name, dropPosition, windowSize, offset } = payload;
  const svg = payload.flatten ? payload.svg : await fetchRawIcon(payload);

  const { bounds, zoom } = figma.viewport;
  const hasUI = Math.abs((bounds.width * zoom) / windowSize.width) < 0.99;
  const leftPaneWidth = windowSize.width - bounds.width * zoom - 240;
  const xFromCanvas = hasUI
    ? dropPosition.clientX - leftPaneWidth
    : dropPosition.clientX;
  const yFromCanvas = hasUI ? dropPosition.clientY - 40 : dropPosition.clientY;

  const frame = figma.createNodeFromSvg(svg);
  if (!payload.flatten) {
    frame.rescale(1 / 8);
  }

  frame.setPluginData(CUSTOM_NODE_KEY, "true");
  frame.name = pascal_name;
  frame.constrainProportions = true;
  frame.x = bounds.x + xFromCanvas / zoom - offset.x;
  frame.y = bounds.y + yFromCanvas / zoom - offset.y;

  figma.currentPage.selection = [frame];
  figma.notify(`Inserted ${pascal_name}`, { timeout: 2000 });
}

function resize(payload: ResizePayload) {
  figma.ui.resize(payload.width, payload.height);
  figma.clientStorage.setAsync(WINDOW_SIZE_KEY, payload);
}

function ungroup(node: SceneNode, parent: BaseNode & ChildrenMixin) {
  if (node.type === "GROUP") {
    node.children.forEach((grandchild) => {
      ungroup(grandchild, parent);
    });
    return;
  }

  parent.appendChild(node);
}
