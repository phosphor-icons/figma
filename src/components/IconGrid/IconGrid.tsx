import React, { useRef, useCallback, useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useRecoilValue } from "recoil";
import { IconContext, SmileyXEyes } from "@phosphor-icons/react";

import { IconEntry } from "../../lib";

import {
  iconWeightAtom,
  filteredQueryResultsSelector,
  searchQueryAtom,
  flattenAtom,
} from "../../state";

interface Position {
  x: number;
  y: number;
}

const IconGrid: React.FC<{}> = () => {
  const weight = useRecoilValue(iconWeightAtom);
  const icons = useRecoilValue(filteredQueryResultsSelector);
  const query = useRecoilValue(searchQueryAtom);
  const flatten = useRecoilValue(flattenAtom);
  const dragStartRef = useRef<Position>();

  useEffect(() => {
    window.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    });
  }, []);

  const handleCopyToWorkspace = (
    _: React.MouseEvent<SVGElement, MouseEvent>,
    entry: IconEntry
  ) => {
    const { name, pascal_name, Icon } = entry;
    const svg = renderToStaticMarkup(
      <Icon size={32} color="black" weight={weight} />
    );
    parent.postMessage(
      {
        pluginMessage: {
          type: "insert",
          payload: { name, pascal_name, svg, weight, flatten },
        },
      },
      "*"
    );
  };

  const handleDragStart = useCallback((e: React.DragEvent<HTMLSpanElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    e.dataTransfer.effectAllowed = "copyMove";
    e.dataTransfer.setData("text/plain", e.currentTarget.innerHTML);
    dragStartRef.current = { x: offsetX, y: offsetY };
  }, []);

  const handleDragEnd = useCallback(
    (e: React.DragEvent<HTMLSpanElement>, entry: IconEntry) => {
      const { clientX, clientY, view } = e.nativeEvent;
      if (view.length === 0) return;

      const { name, pascal_name, Icon } = entry;
      const svg = renderToStaticMarkup(
        <Icon size={32} color="black" weight={weight} />
      );

      const payload = {
        name,
        pascal_name,
        svg,
        weight,
        flatten,
        dropPosition: { clientX, clientY },
        windowSize: {
          width: window.outerWidth,
          height: window.outerHeight,
        },
        offset: dragStartRef.current,
      };

      parent.postMessage({ pluginMessage: { type: "drop", payload } }, "*");
    },
    [weight, flatten]
  );

  if (!icons.length)
    return (
      <div className="empty-state">
        <SmileyXEyes size={128} weight="duotone" />
        <p>
          No results for "<code>{query}"</code>
        </p>
      </div>
    );

  return (
    <div className="grid">
      <IconContext.Provider value={{ size: 32, weight }}>
        {icons.map((entry) => {
          const { Icon } = entry;

          return (
            <div
              className="icon-wrapper"
              draggable
              onDragStart={handleDragStart}
              onDragEnd={(e) => handleDragEnd(e, entry)}
              key={entry.pascal_name}
              title={entry.pascal_name}
            >
              <Icon
                className="icon"
                key={entry.pascal_name}
                onClick={(event) => handleCopyToWorkspace(event, entry)}
              />
            </div>
          );
        })}
      </IconContext.Provider>
    </div>
  );
};

export default IconGrid;
