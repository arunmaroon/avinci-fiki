import React, { ReactNode } from 'react';
import { useStyles } from './styles';

export type ScrimAreaProps = {
  children?: ReactNode;
  classes?: string;
};

export function ScrimArea(props: ScrimAreaProps) {
  const { children, classes: propsClasses } = props;
  const { classes, cx } = useStyles();
  
  return (
    <div className={cx(classes.scrim, propsClasses)}>
      {children}
    </div>
  );
}