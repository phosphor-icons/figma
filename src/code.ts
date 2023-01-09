figma.showUI(__html__, { width: 362, height: 490 });

interface DropPayload {
  name: string;
  svg: string;
  dropPosition: { clientX: number; clientY: number };
  offset: { x: number; y: number };
  windowSize: { width: number; height: number };
  foo: number;
}

const CUSTOM_NODE_KEY = "isPhosphorIcon";
let hasTriedDragAndDrop = false;
let xOffset = 0;

figma.ui.onmessage = ({ type, payload }) => {
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

type InjectableNode =
  | PageNode
  | FrameNode
  | GroupNode
  | ComponentNode
  | (BaseNode & ChildrenMixin);

function nodeIsIcon(node: InjectableNode | SceneNode) {
  return node?.getPluginData(CUSTOM_NODE_KEY) === "true";
}

function nodeSupportsChildren(
  node: SceneNode
): node is ComponentNode | FrameNode | GroupNode {
  return (
    node?.type === "COMPONENT" ||
    node?.type === "FRAME" ||
    node?.type === "GROUP"
  );
}

function getInjectableNode(node: SceneNode): InjectableNode {
  if (!node) {
    return figma.currentPage;
  }

  if (!nodeIsIcon(node) && nodeSupportsChildren(node)) {
    return node;
  }

  if (node.parent) {
    return node.parent;
  }

  return figma.currentPage;
}

function getOffsetVector(node: SceneNode): Vector {
  if (nodeIsIcon(node)) {
    return {
      x: node.x + 32,
      y: node.y,
    };
  }

  if (nodeSupportsChildren(node)) {
    return {
      x: node.width / 2 - 16,
      y: node.height / 2 - 16,
    };
  }

  if (node && "width" in node) {
    return {
      x: node.x + node.width / 2 - 16,
      y: node.y + node.height / 2 - 16,
    };
  }

  return figma.viewport.center;
}

function insertIcon(payload: { name: string; svg: string }) {
  const [currentSelection] = figma.currentPage.selection;
  const injectableNode = getInjectableNode(currentSelection);
  const frame = figma.createNodeFromSvg(payload.svg);
 
  figma.group([frame], injectableNode);

  const { x, y } = getOffsetVector(currentSelection);

  frame.name = payload.name;
  frame.constrainProportions = true;
  frame.x = x;
  frame.y = y;
  frame.setPluginData(CUSTOM_NODE_KEY, "true");

  frame.children.forEach((child) => ungroup(child, frame));

  figma.currentPage.selection = [frame];
  figma.notify(`✔ Added ${payload.name}`, { timeout: 2000 });

  if (!hasTriedDragAndDrop) {
    setTimeout(() => {
      if (!hasTriedDragAndDrop)
        figma.notify("💡 Try drag-and-drop too!", { timeout: 4000 });
      hasTriedDragAndDrop = true;
    }, 4000);
  }
}

function dropIcon(payload: DropPayload) {
  const { name, svg, dropPosition, windowSize, offset } = payload;

  const { bounds, zoom } = figma.viewport;
  const hasUI = Math.abs((bounds.width * zoom) / windowSize.width) < 0.99;
  const leftPaneWidth = windowSize.width - bounds.width * zoom - 240;
  const xFromCanvas = hasUI
    ? dropPosition.clientX - leftPaneWidth
    : dropPosition.clientX;
  const yFromCanvas = hasUI ? dropPosition.clientY - 40 : dropPosition.clientY;

  const tempNode = figma.createNodeFromSvg(svg);
  const frame = figma.createFrame();
  const node = figma.group(tempNode.children, figma.currentPage);
  tempNode.remove();
  frame.appendChild(node);

  frame.name = name;
  frame.constrainProportions = true;
  frame.x = bounds.x + xFromCanvas / zoom - offset.x;
  frame.y = bounds.y + yFromCanvas / zoom - offset.y;
  frame.setPluginData(CUSTOM_NODE_KEY, "true");

  frame.children.forEach((child) => ungroup(child, node));

  figma.currentPage.selection = [frame];
  figma.notify(`✔ Added ${name}`, { timeout: 2000 });
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
