import React, { ReactNode } from "react";

import { Skeleton } from "@mui/material";
import MuiChip from "@mui/material/Chip";
import Typography from "@mvloans/base-ui.typography";
import Boundary from "@mvloans/base-ui.boundary";
import { IconNames, MvSvgIcon } from "@mvloans/base-ui.mv-svg-icon";

import { useStyles } from "./styles";

export type ChipProps = {
  label: string;
  dataTestId?: string;
  variant?: "filled" | "outlined";
  type?: string;
  selected?: boolean;
  checked?: boolean;
  onClick?: (e: React.SyntheticEvent, value: string) => void;
  onDelete?: () => void;
  value: string;
  typographyClass?: string;
  classes?: ChipClasses;
  disabled?: boolean;
  isSkeleton?: boolean;
  iconName?: IconNames;
  suffix?: React.JSX.Element;
};

export interface ChipClasses {
  boundary?: string;
  selectedBoundary?: string;
  unselectedBoundary?: string;
  chip?: string;
}

export function Chip(props: ChipProps) {
  const {
    label,
    variant = "outlined",
    onClick,
    onDelete,
    selected,
    checked = false,
    value,
    typographyClass,
    classes: propsClasses = {},
    dataTestId,
    disabled = false,
    isSkeleton = false,
    iconName,
    suffix,
  } = props;
  const { classes, cx, theme } = useStyles({ disabled });
  const handleClick = (e: React.SyntheticEvent, value: string) => {
    onClick && onClick(e, value);
  };

  const handleDelete = () => {
    onDelete && onDelete();
  };

  const getIcon = (iconName: string) => {
    return <MvSvgIcon name={iconName} width={theme.tokens.sizing.xSmall} height={theme.tokens.sizing.xSmall} />;
  };

  let icon = <></>,
    deleteIcon = <></>;

  if (onDelete) {
    deleteIcon = getIcon(IconNames.closeIcon);
  }
  if (suffix) {
    deleteIcon = suffix;
  }
  if (checked) {
    icon = getIcon(IconNames.chipTickIcon); // filtered chip show tick mark
  } else if (iconName) {
    icon = getIcon(iconName);
  }

  if (isSkeleton) {
    return <Skeleton variant="rounded" height={`${theme.tokens.sizing.medium}`} width={`${theme.tokens.sizing["3xLarge"]}`} />;
  }

  return (
    <Boundary className={cx(propsClasses.boundary)}>
      <MuiChip
        className={cx(
          classes.chipClass,
          selected && classes.selectedClass,
          propsClasses.chip,
          selected ? propsClasses.selectedBoundary : propsClasses.unselectedBoundary
        )}
        icon={icon}
        deleteIcon={deleteIcon}
        onClick={(e) => handleClick(e, value)}
        onDelete={handleDelete}
        data-testid={dataTestId}
        label={
          <Typography
            variant={selected ? theme.tokens.chip.selected.text.typography : theme.tokens.chip.text.typography}
            className={typographyClass}>
            {label}
          </Typography>
        }
        variant={variant}
        disabled={disabled}
      />
    </Boundary>
  );
}
