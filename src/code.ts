figma.showUI(__html__, { width: 362, height: 490 });

let xOffset = 0;

figma.ui.onmessage = ({ type, payload }) => {
  switch (type) {
    case "insert":
      const node = figma.createNodeFromSvg(payload.svg);
      const { x, y } = figma.viewport.center;
      node.name = payload.name;
      node.constrainProportions = true;
      node.x = x;
      node.y = y;
      figma.viewport.center = { x: x + 32, y };

      const group = figma.group(node.children, node);
      group.name = payload.name;
      group.expanded = false;
      group.constrainProportions = true;
      group.children.forEach((child) => ungroup(child, group));

      figma.currentPage.selection = [node];
      break;
  }
};

function ungroup(node: BaseNode, parent: GroupNode) {
  if (node.type === "GROUP") {
    node.children.forEach((grandchild) => {
      ungroup(grandchild, parent);
    });
    return;
  }

  parent.appendChild(node);
}
