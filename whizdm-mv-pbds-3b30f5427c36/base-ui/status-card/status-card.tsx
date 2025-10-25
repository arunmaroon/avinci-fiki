import type { ReactNode } from "react";
import React, { useState } from "react";
import { Card as MuiCard, CardContent, Grid } from "@mui/material";
import Icon from "@mvloans/base-ui.icon";
import Typography from "@mvloans/base-ui.typography";
import { IconNames, PWA_ICONS, TypographyVariants } from "@mvloans/base-ui.common";
import Button, { buttonVariantConstants } from "@mvloans/base-ui.button";
import { MvSvgIcon } from "@mvloans/base-ui.mv-svg-icon";

import { useStyles } from "./styles";

export interface ButtonInputInterface {
  variant?: buttonVariantConstants;
  size?: "buttonDefault" | "buttonSmall" | string;
  label: string;
  itemKey: string;
}

export type StatusCardProps = {
  /**
   * Status of the card
   */
  status: "error" | "success" | "warning" | "info";
  /**
   * Title
   */
  title: string;
  /**
   * Description
   */
  description?: string;
  /**
   * Button Label
   */
  buttonLabel?: string;
  /**
   * On call to action button click
   */
  handleActionClick?: (args: { event?: any; itemKey: string; [key: string]: any }) => void;
  /**
   * handle close function
   */
  showCloseButton?: boolean;
  /**
   * handle close function
   */
  handleOnClose?: () => void;
  /**
   * Custom classes
   */
  classes?: {
    rootCard?: string;
    cardContent?: string;
    cardContentContainer?: string;
    contentItem?: string;
    actionItem?: string;
  };
  /**
   * Children
   */
  children?: ReactNode;
};

export const iconVariant = {
  success: "ic-statusCard-success",
  error: "ic-statusCard-error",
  warning: "ic-statusCard-warning",
  info: "ic-statusCard-info",
};

export const buttonIconVariant = {
  error: "ic-status-card-error-arrow",
  success: "ic-status-card-success-arrow",
  warning: "ic-status-card-warning-arrow",
  info: "ic-status-card-info-arrow",
};

export function StatusCard({
  status,
  title,
  description,
  buttonLabel,
  handleActionClick,
  showCloseButton = false,
  handleOnClose,
  classes: propsClasses = {},
  children,
}: StatusCardProps) {
  const { classes, cx, theme } = useStyles();
  const { semColors, sizing } = theme.tokens;

  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    handleOnClose && handleOnClose();
  };

  const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);
  const capitalizedStatus = capitalizeFirstLetter(status);
  if (!visible) return null;

  return (
    <MuiCard className={cx(classes.rootCard, classes[`rootCardBorder${capitalizedStatus}`], propsClasses.rootCard)}>
      <CardContent className={cx(classes.cardContent, propsClasses.cardContent)}>
        <Grid
          container
          className={cx(classes.cardContentContainer, classes[`cardBackground${capitalizedStatus}`], propsClasses.cardContentContainer)}>
          <Grid item className={classes.icon}>
            <Icon iconName={iconVariant[status]} className={classes.icon} append={PWA_ICONS} />
          </Grid>
          <Grid item className={cx(classes.contentItem, propsClasses.contentItem)}>
            <Grid container direction={"column"}>
              <Grid item>
                <Typography variant={TypographyVariants.bodyMediumHighEmphasis} colorValue={semColors.neutral.text.highEmphasis}>
                  {title}
                </Typography>
              </Grid>
              {description && (
                <Grid item className={classes.description}>
                  <Typography variant={TypographyVariants.bodySmallLowEmphasis} colorValue={semColors.neutral.text.lowEmphasis}>
                    {description}
                  </Typography>
                </Grid>
              )}
              {children && <Grid item>{children}</Grid>}
              {buttonLabel && (
                <Grid item className={cx(classes.actionItem, propsClasses.actionItem)}>
                  <Button
                    size={"buttonSmall"}
                    variant={buttonVariantConstants.SUPPORT_SECONDARY}
                    id={"statusCardAction"}
                    onClick={handleActionClick}
                    withIcon={true}
                    className={cx(classes.rootButton, classes[`rootButton${capitalizedStatus}`])}>
                    {buttonLabel}
                  </Button>
                </Grid>
              )}
            </Grid>
            {showCloseButton && (
              <Grid item className={classes.closeItem}>
                <MvSvgIcon name={IconNames.closeIcon} onClick={handleClose} width={sizing.xSmall} height={sizing.xSmall} />
              </Grid>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </MuiCard>
  );
}
