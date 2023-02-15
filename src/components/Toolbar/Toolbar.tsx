import React from "react";
import { useRecoilState } from "recoil";
import { Diamond, Stack } from "phosphor-react";

import { flattenAtom } from "../../state";
import StyleInput from "./StyleInput";
import SearchInput from "./SearchInput";
import "./Toolbar.css";

type ToolbarProps = {};

const Toolbar: React.FC<ToolbarProps> = () => {
  const [flatten, setFlatten] = useRecoilState(flattenAtom);

  return (
    <menu className="toolbar" id="toolbar">
      <div className="toolbar-contents">
        <SearchInput />
        <StyleInput />
        <label>
          <input
            type="checkbox"
            checked={flatten}
            onChange={(e) => setFlatten(e.target.checked)}
          />
          {flatten ? <Diamond size={16} weight="fill" /> : <Stack size={16} />}
          <span>{flatten ? "Flat" : "Stroke"}</span>
        </label>
      </div>
    </menu>
  );
};

export default Toolbar;
