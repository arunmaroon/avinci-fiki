import React from "react";
import { Box } from "@mui/material";

import { IconNames, MvSvgIcon } from "@mvloans/base-ui.mv-svg-icon";
import Typography from "@mvloans/base-ui.typography";
import { TypographyVariants } from "@mvloans/base-ui.common";

import { radiusConstants, pennyItemVariant, sizeConstants, numberStates } from "./constants";
import { useStyles } from "./styles";

export type PennyItemProps = {
  size?: sizeConstants;
  radius?: radiusConstants;
  variant: pennyItemVariant;
  label?: number;
  profileLabel?: IconNames | string;
  classes?: {
    pennyItemElement?: string;
    pennyItemContainer?: string;
  };
  numberState?: numberStates;
};

export function PennyItem({
  variant = pennyItemVariant.ICON,
  label = 1,
  numberState = numberStates.ENABLED,
  profileLabel,
  size = sizeConstants.MEDIUM,
  radius = radiusConstants.SQUARE,
  classes: propsClasses = {},
}: PennyItemProps) {
  const { classes, cx } = useStyles({ variant });

  let getIcon = () => {
    if (variant === pennyItemVariant.ICON) return IconNames.pennyItemIcon;
    if (variant === pennyItemVariant.PROFILE && profileLabel && profileLabel in IconNames) return IconNames[profileLabel as IconNames];
    if (variant === pennyItemVariant.PROFILE && !profileLabel) return IconNames.pennyItemUserIcon;
    return "";
  };

  if ((variant === pennyItemVariant.ICON || variant === pennyItemVariant.PROFILE) && getIcon())
    return (
      <Box className={cx(classes.container, classes[radius], classes[size], propsClasses.pennyItemContainer)}>
        <MvSvgIcon classes={cx(classes.icon, propsClasses.pennyItemElement)} name={getIcon()} />
      </Box>
    );

  return (
    <Box className={cx(classes.container, classes[numberState], classes[radius], propsClasses.pennyItemContainer)}>
      <Typography
        className={cx(classes.element, propsClasses.pennyItemElement)}
        variant={
          variant === pennyItemVariant.NUMBER ? TypographyVariants.bodySmallHighEmphasis : TypographyVariants.bodyMediumHighEmphasis
        }>
        {variant === pennyItemVariant.NUMBER ? label : profileLabel}
      </Typography>
    </Box>
  );
}
