figma.showUI(__html__, { width: 362, height: 490 });

interface DropPayload {
  name: string;
  svg: string;
  dropPosition: { clientX: number; clientY: number };
  offset: { x: number; y: number };
  windowSize: { width: number; height: number };
  foo: number;
}

let xOffset = 0;

figma.ui.onmessage = ({ type, payload }) => {
  switch (type) {
    case "insert":
      insertIcon(payload);
      break;
    case "drop":
      dropIcon(payload);
      break;
    case "log":
    default:
      console.log("Log: ", payload);
  }
};

function insertIcon(payload: { name: string; svg: string }) {
  const node = figma.createNodeFromSvg(payload.svg);
  const { x, y } = figma.viewport.center;
  node.name = payload.name;
  node.constrainProportions = true;
  node.x = x;
  node.y = y;
  figma.viewport.center = { x: x + 32, y };

  node.children.forEach((child) => ungroup(child, node));

  figma.currentPage.selection = [node];
  figma.notify(`Added ${payload.name}`, { timeout: 2000 });
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

  const node = figma.createNodeFromSvg(svg);
  node.name = name;
  node.constrainProportions = true;
  node.x = bounds.x + xFromCanvas / zoom - offset.x;
  node.y = bounds.y + yFromCanvas / zoom - offset.y;

  node.children.forEach((child) => ungroup(child, node));

  figma.currentPage.selection = [node];
  figma.notify(`Added ${payload.name}`, { timeout: 2000 });
}

function ungroup(node: SceneNode, parent: FrameNode) {
  if (node.type === "GROUP") {
    node.children.forEach((grandchild) => {
      ungroup(grandchild, parent);
    });
    return;
  }

  parent.appendChild(node);
}
