import React from "react";
import { Switch, Skeleton } from "@mui/material";
import { skeletonVariants } from "./constants";
import { useStyles } from "./styles";

export type ToggleProps = {
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  isSkeleton?: boolean;
  id?: string;
};

export function Toggle(props: ToggleProps) {
  const { checked = true, onChange, disabled = false, isSkeleton = false, id } = props;
  const { classes, cx } = useStyles();
  if (isSkeleton) {
    return <Skeleton data-testid={id} variant={skeletonVariants.rectangular} className={classes.skeleTon} />;
  }
  return <Switch data-testid={id} className={classes.switchContainer} disabled={disabled} checked={checked} onChange={onChange} />;
}
