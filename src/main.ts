import { CUSTOM_NODE_KEY, DEFAULT_SIZE } from "./constants";
import { DropPayload, IconPayload, Message } from "./types";
import { fetchFlatIcon, getInjectableNode, getOffsetVector } from "./utils";

let hasTriedDragAndDrop = false;

main();
function main() {
  figma.ui.onmessage = ({ type, payload }: Message) => {
    switch (type) {
      case "insert":
        insertIcon(payload);
        break;
      case "drop":
        hasTriedDragAndDrop = true;
        dropIcon(payload);
        break;
      case "log":
      default:
        console.log("Log: ", payload);
    }
  };

  figma.showUI(__html__, { width: 362, height: 490, themeColors: true });
}

async function insertIcon(payload: IconPayload) {
  const svg = payload.flatten ? await fetchFlatIcon(payload) : payload.svg;

  const [currentSelection] = figma.currentPage.selection;
  const injectableNode = getInjectableNode(currentSelection);
  const frame = figma.createNodeFromSvg(svg);

  if (payload.flatten) {
    frame.resize(DEFAULT_SIZE, DEFAULT_SIZE);
  }

  const { x, y } = getOffsetVector(currentSelection);

  frame.setPluginData(CUSTOM_NODE_KEY, "true");
  frame.name = payload.pascal_name;
  frame.constrainProportions = true;
  frame.x = x;
  frame.y = y;
  if (!payload.flatten) {
    frame.children.forEach((child) => ungroup(child, frame));
  }

  injectableNode.appendChild(frame);

  figma.currentPage.selection = [frame];
  figma.notify(`✅ Added ${payload.pascal_name}`, { timeout: 2000 });

  if (!hasTriedDragAndDrop) {
    setTimeout(() => {
      if (!hasTriedDragAndDrop)
        figma.notify("💡 Try drag-and-drop too!", { timeout: 4000 });
      hasTriedDragAndDrop = true;
    }, 4000);
  }
}

async function dropIcon(payload: DropPayload) {
  const { pascal_name, dropPosition, windowSize, offset } = payload;
  const svg = payload.flatten ? await fetchFlatIcon(payload) : payload.svg;

  const { bounds, zoom } = figma.viewport;
  const hasUI = Math.abs((bounds.width * zoom) / windowSize.width) < 0.99;
  const leftPaneWidth = windowSize.width - bounds.width * zoom - 240;
  const xFromCanvas = hasUI
    ? dropPosition.clientX - leftPaneWidth
    : dropPosition.clientX;
  const yFromCanvas = hasUI ? dropPosition.clientY - 40 : dropPosition.clientY;

  const frame = figma.createNodeFromSvg(svg);
  if (payload.flatten) {
    frame.resize(DEFAULT_SIZE, DEFAULT_SIZE);
  }

  frame.setPluginData(CUSTOM_NODE_KEY, "true");
  frame.name = pascal_name;
  frame.constrainProportions = true;
  frame.x = bounds.x + xFromCanvas / zoom - offset.x;
  frame.y = bounds.y + yFromCanvas / zoom - offset.y;
  if (!payload.flatten) {
    frame.children.forEach((child) => ungroup(child, frame));
  }

  figma.currentPage.selection = [frame];
  figma.notify(`✅ Added ${pascal_name}`, { timeout: 2000 });
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
