import React from 'react';
import type { ReactNode } from 'react';
import { Divider } from '@mui/material';
import { useStyles } from './styles';

export type LineDividerProps = {
  children?: ReactNode;
  orientation?: "vertical" | "horizontal";
  classes?: string;
  variant?: 'fullWidth' | 'inset' | 'middle';
  opacity?: number;
  textAlign?: 'center' | 'right' | 'left';
  borderRadius?: number;
  flexItem?: boolean;
};

export function LineDivider(props: LineDividerProps) {
  const { 
    children, 
    orientation, 
    classes: propsClasses,
    variant,
    textAlign,
    flexItem = true
  } = props;

  const { classes, cx } = useStyles();

  return (
    <Divider
      className={cx(classes.divider, propsClasses)} 
      orientation={orientation} 
      flexItem={flexItem}
      variant={variant}
      textAlign={textAlign}
    >
      {children}
    </Divider>
  );
}
