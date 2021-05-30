import React, { useRef, useCallback } from "react";
import { useRecoilValue } from "recoil";
import { IconContext, SmileyXEyes } from "phosphor-react";

import {
  iconWeightAtom,
  filteredQueryResultsSelector,
  searchQueryAtom,
} from "../../state";

interface Position {
  x: number;
  y: number;
}

const IconGrid: React.FC<{}> = () => {
  const weight = useRecoilValue(iconWeightAtom);
  const icons = useRecoilValue(filteredQueryResultsSelector);
  const query = useRecoilValue(searchQueryAtom);
  const dragStartRef = useRef<Position>();

  const handleCopyToWorkspace = (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    name: string
  ) => {
    const svg = event.currentTarget.outerHTML;
    parent.postMessage(
      { pluginMessage: { type: "insert", payload: { name, svg } } },
      "*"
    );
  };

  const handleDragStart = useCallback((e: React.DragEvent<HTMLSpanElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    e.dataTransfer.effectAllowed = "copyMove";
    e.dataTransfer.dropEffect = "copy";

    document.body.classList.add("inherit-cursors");
    document.body.style.cursor = "grab";

    dragStartRef.current = { x: offsetX, y: offsetY };
  }, []);

  const handleDragEnd = useCallback(
    (e: React.DragEvent<HTMLSpanElement>, name: string) => {
      document.body.classList.remove("inherit-cursors");
      document.body.style.cursor = "unset";

      const { clientX, clientY, view } = e.nativeEvent;
      if (view.length === 0) return;

      const payload = {
        name,
        svg: e.currentTarget.innerHTML,
        dropPosition: { clientX, clientY },
        windowSize: {
          width: window.outerWidth,
          height: window.outerHeight,
        },
        offset: dragStartRef.current,
      };

      parent.postMessage({ pluginMessage: { type: "drop", payload } }, "*");
    },
    []
  );

  if (!icons.length)
    return (
      <div className="empty-state">
        <SmileyXEyes size={128} weight="duotone" color="#2C2C2C" />
        <p>
          No results for "<code>{query}"</code>
        </p>
      </div>
    );

  return (
    <div className="grid">
      <IconContext.Provider
        value={{ size: 32, color: "black", weight, mirrored: false }}
      >
        {icons.map(({ Icon }) => (
          <div
            className="icon-wrapper"
            draggable
            onDragStart={handleDragStart}
            onDragEnd={(e) => handleDragEnd(e, Icon.displayName)}
            key={Icon.displayName}
            title={Icon.displayName}
          >
            <Icon
              className="icon"
              key={Icon.displayName}
              onClick={(event) =>
                handleCopyToWorkspace(event, Icon.displayName)
              }
            />
          </div>
        ))}
      </IconContext.Provider>
    </div>
  );
};

export default IconGrid;
