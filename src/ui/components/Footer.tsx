import React from "react";
import { PhosphorLogo, Notches } from "@phosphor-icons/react";

import { version, dependencies } from "../../../package.json";
import { DEFAULT_WINDOW_SIZE, MINIMUM_WINDOW_SIZE } from "../../common/constants";
import { MessageType, ResizePayload } from "../../common/types";

const Footer: React.FC<{}> = () => {
  const [dragging, setDragging] = React.useState<boolean>(false);
  const resizeProps = React.useMemo<React.SVGAttributes<SVGSVGElement>>(() => {
    return {
      onPointerDown: (e) => {
        setDragging(true);
        (e.target as Element).setPointerCapture(e.pointerId);
      },
      onPointerUp: (e) => {
        setDragging(false);
        (e.target as Element).releasePointerCapture(e.pointerId);
      },
      onPointerMove: dragging
        ? (e) => {
            const payload: ResizePayload = {
              width: Math.max(
                MINIMUM_WINDOW_SIZE.width,
                Math.floor(e.clientX + 5)
              ),
              height: Math.max(
                MINIMUM_WINDOW_SIZE.height,
                Math.floor(e.clientY + 5)
              ),
            };

            parent.postMessage(
              {
                pluginMessage: {
                  type: MessageType.RESIZE,
                  payload,
                },
              },
              "*"
            );
          }
        : undefined,
      onDoubleClick: () => {
        parent.postMessage(
          {
            pluginMessage: {
              type: MessageType.RESIZE,
              payload: DEFAULT_WINDOW_SIZE,
            },
          },
          "*"
        );
      },
    };
  }, [dragging]);

  return (
    <footer className="footer">
      <div className="plug">
        <PhosphorLogo weight="fill" size={16} />
        <a href="https://phosphoricons.com" target="_blank" rel="noopener">
          phosphoricons.com
        </a>
      </div>
      <div
        className="version"
        title={`Based on @phosphor-icons/react v${dependencies[
          "@phosphor-icons/react"
        ].replace(/[\^~\=]/, "")}`}
      >
        v{version}
      </div>
      <Notches id="resizer" {...resizeProps}>
        <title>Double-click to reset plugin window size</title>
      </Notches>
    </footer>
  );
};

export default Footer;
