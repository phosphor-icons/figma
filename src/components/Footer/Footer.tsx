import React from "react";
import { Heart } from "phosphor-react";

const Footer: React.FC<{}> = () => {
  return (
    <footer className="footer">
      <span>Made with</span>
      <Heart weight="duotone" size={18} color="#7D4697" style={{ marginLeft: 4, marginRight: 4 }} />
      <span>by</span>
      <a href="https://phosphoricons.com" target="_blank" rel="noopener">
        Phosphor Icons
      </a>
    </footer>
  );
};

export default Footer;
