import { IconStyle } from "@phosphor-icons/core";
import { create } from "zustand";
import Fuse from "fuse.js";

import { PluginConfig } from "@common/types";
import { IconEntry } from "../lib";
import { icons } from "../lib/icons";
import StorageProxy from "./StorageProxy";

const fuse = new Fuse(icons, {
  keys: [
    { name: "name", weight: 4 },
    { name: "pascal_name", weight: 4 },
    "tags",
    "categories",
  ],
  threshold: 0.2, // Tweak this to what feels like the right number of results
  // shouldSort: false,
  useExtendedSearch: true,
});

function getFilteredIcons(query: string): ReadonlyArray<IconEntry> {
  const q = query.trim().toLowerCase();
  if (!q) return icons;
  return fuse.search(q).map((value) => value.item);
}

interface AppState {
  config: PluginConfig;
  iconWeight: IconStyle;
  iconColor: string;
  searchQuery: string;
  flatten: boolean;
  filteredIcons: ReadonlyArray<IconEntry>;

  setConfig: (config: PluginConfig) => void;
  setIconWeight: (weight: IconStyle) => void;
  setIconColor: (color: string) => void;
  setSearchQuery: (query: string) => void;
  setFlatten: (flatten: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  config: { editorType: "figma" },
  iconWeight: IconStyle.REGULAR,
  iconColor: "currentColor",
  searchQuery: "",
  flatten: true,
  filteredIcons: icons,

  setConfig: (config) => set({ config }),
  setIconWeight: (iconWeight) => {
    set({ iconWeight });
    StorageProxy.requestSet({ key: "iconWeightAtom", value: iconWeight });
  },
  setIconColor: (iconColor) => {
    set({ iconColor });
    StorageProxy.requestSet({ key: "iconColorAtom", value: iconColor });
  },
  setSearchQuery: (searchQuery) =>
    set({ searchQuery, filteredIcons: getFilteredIcons(searchQuery) }),
  setFlatten: (flatten) => {
    set({ flatten });
    StorageProxy.requestSet({ key: "flattenAtom", value: flatten });
  },
}));

// Initialize storage hydration
StorageProxy.hydrate(useStore);
