import React from "react";
import { PhosphorLogo } from "@phosphor-icons/react";

import { version, dependencies } from "../../../package.json";

const Footer: React.FC<{}> = () => {
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
    </footer>
  );
};

export default Footer;
