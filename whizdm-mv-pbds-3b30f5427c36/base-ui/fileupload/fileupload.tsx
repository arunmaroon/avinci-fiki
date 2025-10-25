import React from "react";
import { FormHelperText, Grid, Skeleton } from "@mui/material";
import Icon from "@mvloans/base-ui.icon";
import Typography from "@mvloans/base-ui.typography";
import Boundary from "@mvloans/base-ui.boundary";
import { actionTypes, fileStatus, leftIconType } from "./constants";
import { projectTokens } from "@mvloans/base-ui.common";
import { MvSvgIcon } from "@mvloans/base-ui.mv-svg-icon";
import { TypographyVariants } from "@mvloans/base-ui.common";
import { Button, buttonVariantConstants } from "@mvloans/base-ui.button";
import { useStyles } from "./styles";

export type FileuploadProps = {
  /**
   * Label for file upload
   */
  label: string;
  /**
   * Description for file upload
   */
  description?: string;
  /**
   * Unique identifier for upload
   */
  id: string;
  /**
   * On change handler
   */
  onAction: (args: { event: React.SyntheticEvent; type: actionTypes; config?: string }) => void;
  /**
   * File Upload Status [success | error | default | uploading | disabled]
   */
  status?: fileStatus;
  /**
   * Right icon for file upload
   */
  rightIcon?: {
    actionType: string;
    icon: string;
  };
  /**
   * Left icon for file upload
   */
  leftIcon?: {
    type: leftIconType;
    url: string;
  };
  classes?: {
    boundary?: string;
    root?: string;
    heading?: string;
    leftIcon?: string;
    rightIcon?: string;
    helperText?: string;
    skeleton?: string;
    helperTextContainer?: string;
  };
  /**
   * Value is being used for the border.
   * If falsy then we show dashed border on Grid element
   * If truthy then we show solid border on Boundary element
   */
  value?: any;
  helperText?: string;
  isSkeleton?: boolean;
  onCancelUpload?: (args: { event: React.SyntheticEvent }) => void;
};

export function Fileupload({
  id,
  label,
  onAction,
  status = fileStatus.default,
  rightIcon,
  classes: propsClasses = {},
  description,
  value,
  leftIcon = {
    type: leftIconType.icon,
    url: "ic-placeholder-upload",
  },
  helperText,
  isSkeleton = false,
  onCancelUpload,
}: FileuploadProps) {
  const { classes, cx, theme } = useStyles({ value });
  const { semColors } = theme.tokens;
  const { titleText, instructionText, uploadError, helperText: helperTextToken, disabled } = theme.tokens.uploadDocument;

  const getUploaderIcon = (iconName: string) => {
    return <MvSvgIcon name={iconName} className={classes.rightIconClass} />;
  };

  const getFileIcon = (iconName: string, src: string) => {
    return (
      <MvSvgIcon
        onClick={(e: React.SyntheticEvent) => {
          e.stopPropagation();
          onAction({ event: e, type: actionTypes.leftIcon, config: src });
        }}
        src={src}
        name={iconName}
        className={classes.fileUploadIcon}
      />
    );
  };

  const getRightIcon = () => {
    if (status === fileStatus.uploading && onCancelUpload) {
      return (
        // Need to set fontSize to 12px in button link
        <Button variant={buttonVariantConstants.LINK} withIcon={false}>
          Cancel
        </Button>
      );
    } else if (rightIcon) {
      return getUploaderIcon(rightIcon.icon);
    }
    return null;
  };

  if (isSkeleton) {
    return <Skeleton data-testid={id} variant={"rectangular"} className={cx(classes.skeletonRoot, propsClasses.skeleton)} />;
  }

  return (
    <>
      <Boundary
        containerClassName={cx(
          value && (status === fileStatus.error ? classes.uploadContainerErrorSolid : classes.uploadContainerBorderSolid),
          status === fileStatus.disabled && classes.disabled,
          propsClasses.boundary
        )}>
        <Grid
          onClick={(e) => onAction({ event: e, type: actionTypes.card })}
          data-testid={id}
          container
          className={cx(
            classes.uploadContainer,
            !value && (status === fileStatus.error ? classes.uploadContainerErrorDashed : classes.uploadContainerBorderDashed),
            propsClasses.root
          )}>
          <Grid item className={cx(classes.verticalFileItem, classes.leftIconFrame, propsClasses.leftIcon)}>
            {getFileIcon(leftIcon.type === leftIconType.icon ? leftIcon.url : "", leftIcon.type === leftIconType.image ? leftIcon.url : "")}
          </Grid>
          <Grid item container className={cx(classes.heading, propsClasses.heading)} justifyContent={"center"}>
            <Typography
              variant={TypographyVariants.bodySmallHighEmphasis}
              colorValue={status === fileStatus.disabled ? disabled.titleText.color : titleText.color}
              className={classes.labelClass}>
              {label}
            </Typography>

            {description && (
              <Typography
                variant={TypographyVariants.bodySmallLowEmphasis}
                colorValue={status === fileStatus.uploadedSuccess ? semColors.brand.text.primary : instructionText.color}>
                {description}
              </Typography>
            )}
          </Grid>
          {getRightIcon() && (
            <Grid
              item
              className={cx(classes.uploadStatus, propsClasses.rightIcon)}
              alignItems="center"
              justifyContent={"center"}
              display="flex"
              onClick={(e: React.SyntheticEvent) => {
                e.stopPropagation();
                onAction({ event: e, type: actionTypes.rightIcon, config: rightIcon?.actionType });
              }}>
              {getRightIcon()}
            </Grid>
          )}
        </Grid>
      </Boundary>
      {helperText && (
        <FormHelperText className={cx(classes.helperTextContainer, propsClasses.helperTextContainer)}>
          <Typography
            className={cx(propsClasses.helperText)}
            variant={helperTextToken.typography}
            colorValue={status === fileStatus.error ? uploadError.helperText.color : helperTextToken.color}>
            {helperText}
          </Typography>
        </FormHelperText>
      )}
    </>
  );
}
