import Icon, { IconProps } from "@mvloans/base-ui.icon";
import React from "react";

export interface MvImagesProps extends IconProps {
  iconComponent?: React.ElementType;
}

export const MvImages = (props: MvImagesProps) => {
  return <>{props.iconComponent ? <props.iconComponent {...props}></props.iconComponent> : <Icon {...props}></Icon>}</>;
};
