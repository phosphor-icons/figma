import React from "react";
import { useRecoilValue } from "recoil";
import { IconContext, SmileyXEyes } from "phosphor-react";

import {
  iconWeightAtom,
  filteredQueryResultsSelector,
  searchQueryAtom,
} from "../../state";

const IconGrid: React.FC<{}> = () => {
  const weight = useRecoilValue(iconWeightAtom);
  const icons = useRecoilValue(filteredQueryResultsSelector);
  const query = useRecoilValue(searchQueryAtom);

  const handleCopyToWorkspace = (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    name: string
  ) => {
    const svg = event.currentTarget.outerHTML;
    parent.postMessage(
      { pluginMessage: { type: "insert", payload: { name, svg } } },
      "*"
    );
  };

  if (!icons.length)
    return (
      <div className="empty-state">
        <SmileyXEyes size={128} weight="duotone" color="#2C2C2C" />
        <p>
          No results for "<code>{query}"</code>
        </p>
      </div>
    );

  return (
    <div className="grid">
      <IconContext.Provider
        value={{ size: 32, color: "black", weight, mirrored: false }}
      >
        {icons.map(({ Icon }) => (
          <span key={Icon.displayName} title={Icon.displayName}>
            <Icon
              className="icon"
              key={Icon.displayName}
              onClick={(event) =>
                handleCopyToWorkspace(event, Icon.displayName)
              }
            />
          </span>
        ))}
      </IconContext.Provider>
    </div>
  );
};

export default IconGrid;
