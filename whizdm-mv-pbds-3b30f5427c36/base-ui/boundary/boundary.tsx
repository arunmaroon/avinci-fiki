import React, { ReactNode } from "react";
import { useStyles } from "./styles";

export type BoundaryProps = {
  /**
   * a node to be rendered in the special component.
   */
  children?: ReactNode;
  className?: string;
  containerClassName?: string;
};

export function Boundary({ children, className, containerClassName }: BoundaryProps) {
  const { classes, cx } = useStyles();
  return (
    <div className={cx(classes.boundaryContainer, containerClassName)}>
      {children}
      <div className={cx(classes.boundary, className)}></div>
    </div>
  );
}
