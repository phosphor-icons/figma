import React from "react";

import "./Toolbar.css";
import StyleInput from "./StyleInput";
import SearchInput from "./SearchInput";

type ToolbarProps = {};

const Toolbar: React.FC<ToolbarProps> = () => {
  return (
    <menu className="toolbar" id="toolbar">
      <div className="toolbar-contents">
        <StyleInput />
        <SearchInput />
      </div>
    </menu>
  );
};

export default Toolbar;
