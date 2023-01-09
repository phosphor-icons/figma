import * as Icons from "phosphor-react";
import { icons as iconData } from "@phosphor-icons/core";

import { IconEntry } from ".";

export const icons: ReadonlyArray<IconEntry> = iconData.map((entry) => ({
    name: entry.name,
    categories: entry.categories,
    tags: entry.tags,
    Icon: Icons[entry.pascal_name as keyof typeof Icons] as Icons.Icon,
}));
