import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { commonConfig, commonConstants } from "@mvloans/base-ui.common";

export type IconProps = {
  src?: string;
  afterImageLoad?: any;
  iconName?: string;
  append?: string;
  iconExt?: string;
  onClick?: (e: any) => {} | void;
  style?: object;
  className?: string;
  id?: string;
  noLazyLoad?: boolean;
  height?: string | number;
  width?: string | number;
};

export const Icon = React.memo((props: IconProps) => {
  const { afterImageLoad, iconName, append, iconExt, onClick, style, className, id, noLazyLoad, height, width } = props;
  let src = "";
  let imagePath = commonConfig.resourceBaseUrl;
  if (iconName) {
    src = imagePath + (append ? append : "") + iconName + (iconExt ? "." + iconExt : commonConstants.svgExtension);
  }

  if (noLazyLoad) {
    return (
      <img
        src={props.src || src}
        alt={iconName || "icon-image"}
        onClick={onClick ? onClick : () => {}}
        style={style ? style : {}}
        className={className && className}
        id={id}
        onLoad={afterImageLoad}
      />
    );
  }

  return (
    <LazyLoadImage
      src={props.src || src}
      alt={iconName || "icon-image"}
      onClick={onClick ? onClick : () => {}}
      style={style ? style : {}}
      className={className && className}
      id={id}
      height={height}
      width={width}
      onLoad={afterImageLoad}
    />
  );
});
export default Icon;
