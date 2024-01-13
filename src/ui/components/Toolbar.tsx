import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { BoundingBox } from "@phosphor-icons/react";
import tinycolor from "tinycolor2";

import { configAtom, flattenAtom, iconColorAtom } from "../state";
import StyleInput from "./StyleInput";
import SearchInput from "./SearchInput";
import "./Toolbar.css";

type ToolbarProps = {};

const Toolbar: React.FC<ToolbarProps> = () => {
  const [flatten, setFlatten] = useRecoilState(flattenAtom);
  const [color, setColor] = useRecoilState(iconColorAtom);
  const { editorType } = useRecoilValue(configAtom);

  return (
    <>
      <menu className="toolbar" id="toolbar">
        <div
          className={
            editorType === "figjam" ? "fj-toolbar-contents" : "toolbar-contents"
          }
        >
          <SearchInput />
          <StyleInput />
          {editorType === "figjam" ? (
            <label onContextMenu={() => setColor("#000000")}>
              <span
                className={`chit ${
                  tinycolor(color).isLight() ? "outline" : ""
                }`}
                style={{ background: color }}
              ></span>
              <span>{color.toUpperCase().replace("#", "")}</span>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </label>
          ) : (
            <label
              tabIndex={0}
              title={`"Flat" icons are condensed into a single path.\n\n"Raw" icons contain the original strokes.\nChoose this option if you want to edit the icon.`}
            >
              <span>{flatten ? "Flat" : "Raw"}</span>
              <input
                type="checkbox"
                checked={flatten}
                onChange={(e) => setFlatten(e.target.checked)}
              />
              {flatten ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <rect x={3} y={3} width={10} height={10}></rect>
                </svg>
              ) : (
                <BoundingBox size={16} weight="fill" />
              )}
            </label>
          )}
        </div>
      </menu>
    </>
  );
};

export default Toolbar;
