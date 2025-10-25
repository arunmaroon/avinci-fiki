import React, { ReactNode } from "react";

import { Box, DialogTitle, Dialog as MuiDialog, Grid } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";

import Typography from "@mvloans/base-ui.typography";
import Button from "@mvloans/base-ui.button";
import { TypographyVariants, variantConstants, IconNames } from "@mvloans/base-ui.common";
import { MvSvgIcon } from "@mvloans/base-ui.mv-svg-icon";
import Icon from "@mvloans/base-ui.icon";

import { dialogButtonConstants, dialogButtonFlipConstants } from "./constants";
import { useStyles } from "./styles";

export type DialogProps = {
  /** Used to display the component.*/
  open?: boolean;

  /** Used to close Icon.*/
  closeIcon?: boolean;

  /** Any Component can be passed as a child prop to display it with the content section of the bottom sheet.*/
  children?: ReactNode;

  /** Icon object can be passed which is displayed at the start of the bottom sheet.*/
  icon?: dialogIcon;

  /** The title of the bottom sheet.*/
  title?: string;

  /** The subtitle of the bottom sheet.*/
  subTitle?: string | ReactNode;

  /** The description of the bottom sheet.*/
  description?: string;

  /** The button config to define the button variants text and onClicks.*/
  buttonConfig?: Array<any>;

  /** If an alert component is to be called instead of bottom sheet.*/
  isAlert?: boolean;

  /** singleLine or multiLine view of the button section in mobile view "singleLine" | "multiLine"*/
  mobileView?: dialogButtonConstants;

  /** singleLine or multiLine view of the button section in desktop view "singleLine" | "multiLine"*/
  desktopView?: dialogButtonConstants;

  /** If the buttons in the button section have to be flipped "mobileFlip" | "desktopFlip"*/
  flipButtons?: dialogButtonFlipConstants;

  /** The onClose function to close the bottom sheet if needed.*/
  onClose?: (e: any) => void;
  /** To show the dialog as full screen in mobile view.*/
  showFullScreen?: boolean;
  classes?: {
    root?: string;
    titleClass?: string;
    subTitleClass?: string;
    iconContainer?: string;
    titleContainer?: string;
    contentContainer?: string;
    actionContainer?: string;
    closeIcon?: string;
    buttonContainer?: string;
  };

  /**
   * Disable the scroll lock behavior.
   */
  disableScrollLock?: boolean;
};

interface dialogIcon {
  iconName?: string;
  textAlign?: any;
  className?: string;
}
export function Dialog({
  open = true,
  closeIcon = false,
  children,
  icon,
  title,
  subTitle,
  description,
  buttonConfig,
  isAlert = false,
  mobileView = isAlert ? dialogButtonConstants.SINGLE_LINE : dialogButtonConstants.MULTI_LINE,
  desktopView = isAlert ? dialogButtonConstants.SINGLE_LINE : dialogButtonConstants.MULTI_LINE,
  flipButtons,
  onClose,
  showFullScreen,
  classes: propsClasses = {},
  disableScrollLock = false,
}: DialogProps) {
  const { classes, cx, theme } = useStyles();
  const { spacing } = theme.tokens;
  const { semColors, sizing } = theme.tokens;

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), { noSsr: true });
  const flipClass = () => {
    if (isMobile) {
      return `${mobileView}${flipButtons}`;
    } else {
      return `${desktopView}${flipButtons}`;
    }
  };

  const getButtonSize = (ele: any) => {
    if (ele.size) {
      return ele.size;
    }
    return isAlert ? variantConstants.BUTTONSMALL : variantConstants.BUTTONDEFAULT;
  };

  return (
    <MuiDialog
      open={open}
      className={cx(
        classes.rootDialog,
        isAlert ? classes.rootAlert : icon ? classes.dialogTitleContainerWhenIconPresent : classes.rootBottomSheet,
        showFullScreen && classes.fullScreen,
        propsClasses.root
      )}
      slotProps={{ backdrop: { style: { opacity: 0.5 } } }}
      fullScreen={showFullScreen && isMobile && true}
      onClose={(event, reason) => {
        if (reason === "backdropClick" && onClose) {
          onClose(event);
        }
      }}
      disableScrollLock={disableScrollLock}>
      {icon && (
        <Box className={cx(propsClasses.iconContainer, classes.iconContainer)} textAlign={icon?.textAlign}>
          <MvSvgIcon name={icon.iconName || ""} classes={icon.className} />
        </Box>
      )}

      <DialogTitle className={propsClasses.titleContainer}>
        <Grid
          gap={spacing.default}
          flexDirection={title || subTitle ? "row" : "row-reverse"}
          justifyContent={"space-between"}
          flexWrap={"nowrap"}
          container>
          {(title || subTitle) && (
            <Grid container item direction={"column"}>
              <Grid container justifyContent={"space-between"}>
                {title && (
                  <Grid item>
                    <Typography
                      variant={TypographyVariants.title2}
                      colorValue={semColors.neutral.text.highEmphasis}
                      className={cx(!icon && classes.paddingTop6, classes.margin4XCompact, propsClasses.titleClass)}>
                      {title}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              {subTitle && (
                <Grid container>
                  <Grid item>
                    {typeof subTitle === "string" ? (
                      <Typography
                        variant={TypographyVariants.bodySmallLowEmphasis}
                        colorValue={semColors.neutral.text.lowEmphasis}
                        className={cx(classes.subTitleSection, propsClasses.subTitleClass)}>
                        {subTitle}
                      </Typography>
                    ) : (
                      subTitle
                    )}
                  </Grid>
                </Grid>
              )}
            </Grid>
          )}
          {closeIcon && (
            <MvSvgIcon
              name={IconNames.closeIcon}
              classes={cx(
                classes.pointer,
                classes.closeIcon,
                icon?.iconName && classes.closeIconPosition,
                classes.iconStyleAdjustment,
                propsClasses.closeIcon
              )}
              width={sizing.small}
              height={sizing.small}
              onClick={onClose}
              dataTestId="closeSvgIcon"
            />
          )}
        </Grid>
      </DialogTitle>

      <DialogContent className={propsClasses.contentContainer}>
        <Grid container direction={"column"}>
          {description && (
            <Grid item className={isAlert ? classes.descriptionSectionAlert : classes.descriptionSection}>
              <Typography
                variant={TypographyVariants.bodyMediumLowEmphasis}
                colorValue={semColors.neutral.text.mediumEmphasis}
                className={classes.margin4XCompact}>
                {description}
              </Typography>
            </Grid>
          )}
          {children && <Grid item>{children}</Grid>}
        </Grid>
      </DialogContent>
      <DialogActions className={propsClasses.actionContainer}>
        {Array.isArray(buttonConfig) && buttonConfig.length > 0 && (
          <Grid
            container
            className={cx(
              classes.buttonContainer,
              classes.marginTopSpacious,
              isMobile ? classes[mobileView] : classes[desktopView],
              flipButtons && classes[flipClass()],
              propsClasses.buttonContainer
            )}>
            {buttonConfig.map((ele, i) => (
              <Grid item key={i}>
                <Button
                  onClick={ele.onClick}
                  variant={ele.variant}
                  size={getButtonSize(ele)}
                  id={ele.id}
                  disabled={!!ele.disabled}
                  className={ele.className}
                  withIcon={ele.withIcon}
                  iconName={ele.iconName}
                  iconPosition={ele.iconPosition}
                  isSkeleton={ele.isSkeleton}
                  isLoading={ele.isLoading}>
                  {ele.btnText}
                </Button>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogActions>
    </MuiDialog>
  );
}
