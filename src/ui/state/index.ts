import { IconStyle } from "@phosphor-icons/core";
import { atom, selector } from "recoil";
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

export const configAtom = atom<PluginConfig>({
  key: "configAtom",
  default: { editorType: "figma" },
});

export const iconWeightAtom = atom<IconStyle>({
  key: "iconWeightAtom",
  default: IconStyle.REGULAR,
  effects: [StorageProxy.register],
});

export const iconColorAtom = atom<string>({
  key: "iconColorAtom",
  default: "currentColor",
  effects: [StorageProxy.register],
});

export const searchQueryAtom = atom<string>({
  key: "searchQueryAtom",
  default: "",
});

export const flattenAtom = atom<boolean>({
  key: "flattenAtom",
  default: true,
  effects: [StorageProxy.register],
});

export const filteredQueryResultsSelector = selector<ReadonlyArray<IconEntry>>({
  key: "filteredQueryResultsSelector",
  get: ({ get }) => {
    const query = get(searchQueryAtom).trim().toLowerCase();
    if (!query) return icons;

    return new Promise((resolve) =>
      resolve(fuse.search(query).map((value) => value.item))
    );
  },
});
