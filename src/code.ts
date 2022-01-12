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

type SelectableNode =
  | PageNode
  | FrameNode
  | GroupNode
  | ComponentNode
  | (BaseNode & ChildrenMixin);

function nodeIsIcon(node: SelectableNode | SceneNode) {
  return node?.getPluginData(CUSTOM_NODE_KEY) === "true";
}

function getSelectableNode(node: SceneNode): SelectableNode {
  if (!node) {
    return figma.currentPage;
  }

  if (
    !nodeIsIcon(node) &&
    (node.type === "COMPONENT" ||
      node.type === "FRAME" ||
      node.type === "GROUP")
  ) {
    return node;
  }

  if (node.parent) {
    return node.parent;
  }

  return figma.currentPage;
}

function getSelectableVector(node: SceneNode): Vector {
  if (node && nodeIsIcon(node) && "x" in node) {
    return {
      x: node.x,
      y: node.y,
    };
  }

  if (node && "width" in node) {
    return {
      x: node.width / 2,
      y: node.height / 2,
    };
  }

  return figma.viewport.center;
}

function insertIcon(payload: { name: string, svg: string }) {
  const [currentSelection] = figma.currentPage.selection;
  const selectableNode = getSelectableNode(currentSelection);
  const tempNode = figma.createNodeFromSvg(payload.svg);
  const node = figma.group(tempNode.children, selectableNode);

  tempNode.remove();

  const { x, y } = getSelectableVector(currentSelection);

  node.name = payload.name;
  node.constrainProportions = true;
  // Center first child and offset remaining.
  node.x = x + (selectableNode.children.length > 1 ? 32 : -16);
  node.y = y;
  node.setPluginData(CUSTOM_NODE_KEY, "true");

  node.children.forEach((child) => ungroup(child, node));

  figma.currentPage.selection = [node];
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
  const node = figma.group(tempNode.children, figma.currentPage);
  tempNode.remove();

  node.name = name;
  node.constrainProportions = true;
  node.x = bounds.x + xFromCanvas / zoom - offset.x;
  node.y = bounds.y + yFromCanvas / zoom - offset.y;
  node.setPluginData(CUSTOM_NODE_KEY, "true");

  node.children.forEach((child) => ungroup(child, node));

  figma.currentPage.selection = [node];
  figma.notify(`✔ Added ${name}`, { timeout: 2000 });
}

function ungroup(node: SceneNode, parent: GroupNode) {
  if (node.type === "GROUP") {
    node.children.forEach((grandchild) => {
      ungroup(grandchild, parent);
    });
    return;
  }

  parent.appendChild(node);
}
