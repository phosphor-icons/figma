import { CUSTOM_NODE_KEY } from "@common/constants";
import { IconPayload, InjectableNode } from "@common/types";
import { version } from "../../package.json";

const [MAJOR_VERSION, MINOR_VERSION] = version.split(".");

export function nodeIsIcon(node: InjectableNode | SceneNode) {
  return node?.getPluginData(CUSTOM_NODE_KEY) === "true";
}

export function nodeSupportsChildren(
  node: InjectableNode | SceneNode
): node is ComponentNode | FrameNode | GroupNode {
  return (
    node?.type === "COMPONENT" ||
    node?.type === "FRAME" ||
    node?.type === "GROUP"
  );
}

export function getInjectableNode(
  node: InjectableNode | SceneNode
): InjectableNode {
  if (!node) {
    return figma.currentPage;
  }

  if (!nodeIsIcon(node) && nodeSupportsChildren(node)) {
    return node;
  }

  if (node.parent) {
    return getInjectableNode(node.parent);
  }

  return figma.currentPage;
}

export function getOffsetVector(node: SceneNode): Vector {
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

export async function fetchRawIcon(
  payload: IconPayload
): Promise<string | undefined> {
  const fileName =
    payload.name + (payload.weight === "regular" ? "" : `-${payload.weight}`);
  const cacheKey = `ph-${MAJOR_VERSION}.${MINOR_VERSION}-${fileName}`;
  const cached: string = await figma.clientStorage.getAsync(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/phosphor-icons/core/main/raw/${payload.weight}/${fileName}.svg`
    );
    const text = await res.text();

    figma.clientStorage.setAsync(cacheKey, text);

    return text;
  } catch (_) {
    figma.notify("Oops! Looks like you're offline.");
  }
}
