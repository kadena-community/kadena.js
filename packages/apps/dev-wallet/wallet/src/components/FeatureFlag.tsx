import { config } from "@/config";
import { FC } from "react";

interface Props {
  name: string;
  children: any;
}

export const FeatureFlag: FC<Props> = ({ children, name }: Props) => {
  if (config.flags.includes(name)) {
    return children;
  }
  return null;
};

export const hasFlag = (name: string) => config.flags.includes(name);
