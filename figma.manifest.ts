// https://www.figma.com/plugin-docs/manifest/
export default {
  name: "Phosphor Icons",
  id: "898620911119764089",
  api: "1.0.0",
  main: "plugin.js",
  ui: "index.html",
  capabilities: [],
  enableProposedApi: false,
  editorType: ["figma", "figjam"],
  networkAccess: {
    allowedDomains: [
      "https://raw.githubusercontent.com/phosphor-icons/core/main/raw/",
    ],
    reasoning: "Download raw SVG icon assets from GitHub",
  },
};
