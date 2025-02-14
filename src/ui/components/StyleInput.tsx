import React from "react";
import { useRecoilState } from "recoil";
import { IconStyle } from "@phosphor-icons/core";

import { iconWeightAtom } from "../state";

import "./StyleInput.css";

type WeightOption = { key: string; value: IconStyle };

const options: WeightOption[] = [
  {
    key: "Thin",
    value: IconStyle.THIN,
  },
  {
    key: "Light",
    value: IconStyle.LIGHT,
  },
  {
    key: "Regular",
    value: IconStyle.REGULAR,
  },
  {
    key: "Bold",
    value: IconStyle.BOLD,
  },
  {
    key: "Fill",
    value: IconStyle.FILL,
  },
  {
    key: "Duotone",
    value: IconStyle.DUOTONE,
  },
];

type StyleInputProps = {};

const StyleInput: React.FC<StyleInputProps> = () => {
  const [style, setStyle] = useRecoilState(iconWeightAtom);

  return (
    <select
      value={style}
      onChange={(e) => {
        setStyle(e.target.value as IconStyle);
        e.target.blur();
      }}
    >
      {options.map(({ key, value }) => (
        <option
          key={key}
          value={value}
          onClick={(e) => {
            (e.target as HTMLOptionElement).parentElement?.blur();
          }}
        >
          {key}
        </option>
      ))}
    </select>
  );
};

export default StyleInput;
