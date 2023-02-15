import React from "react";
import { useRecoilState } from "recoil";
import { IconStyle } from "@phosphor-icons/core";
import { PencilLine } from "phosphor-react";

import { iconWeightAtom } from "../../state";

import "./StyleInput.css";

type WeightOption = { key: string; value: IconStyle; icon: JSX.Element };

const options: WeightOption[] = [
  {
    key: "Thin",
    value: IconStyle.THIN,
    icon: <PencilLine size={24} weight="thin" />,
  },
  {
    key: "Light",
    value: IconStyle.LIGHT,
    icon: <PencilLine size={24} weight="light" />,
  },
  {
    key: "Regular",
    value: IconStyle.REGULAR,
    icon: <PencilLine size={24} weight="regular" />,
  },
  {
    key: "Bold",
    value: IconStyle.BOLD,
    icon: <PencilLine size={24} weight="bold" />,
  },
  {
    key: "Fill",
    value: IconStyle.FILL,
    icon: <PencilLine size={24} weight="fill" />,
  },
  {
    key: "Duotone",
    value: IconStyle.DUOTONE,
    icon: <PencilLine size={24} weight="duotone" />,
  },
];

type StyleInputProps = {};

const StyleInput: React.FC<StyleInputProps> = () => {
  const [style, setStyle] = useRecoilState(iconWeightAtom);

  return (
    <select
      value={style}
      onChange={(e) => setStyle(e.target.value as IconStyle)}
    >
      <option value={IconStyle.THIN}>Thin</option>
      <option value={IconStyle.LIGHT}>Light</option>
      <option value={IconStyle.REGULAR}>Regular</option>
      <option value={IconStyle.BOLD}>Bold</option>
      <option value={IconStyle.FILL}>Fill</option>
      <option value={IconStyle.DUOTONE}>Duotone</option>
    </select>
  );
};

export default StyleInput;
