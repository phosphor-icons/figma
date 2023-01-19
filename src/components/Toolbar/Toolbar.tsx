import React from "react";
import { useRecoilState } from "recoil";

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
        <StyleInput />
        <SearchInput />
        <input
          type="checkbox"
          checked={flatten}
          onChange={(e) => setFlatten(e.target.checked)}
        />
      </div>
    </menu>
  );
};

export default Toolbar;
