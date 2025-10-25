import React from "react";
import MuiSnackbar from "@mui/material/Snackbar";
import { Grid } from "@mui/material";
import MuiSnackbarContent from "@mui/material/SnackbarContent";
import IconButton from "@mui/material/IconButton";
import { TypographyVariants } from "@mvloans/base-ui.common";
import Typography from "@mvloans/base-ui.typography";
import { IconNames, MvSvgIcon } from "@mvloans/base-ui.mv-svg-icon";
import { useStyles } from "./styles";
import Button, { buttonVariantConstants } from "@mvloans/base-ui.button";

export enum iconTypes {
  ERROR = "error",
  SUCCESS = "success",
  WARNING = "warning",
  INFO = "info",
  NEUTRAL = "neutral",
}
export type SnackbarProps = {
  open?: boolean;
  anchorOrigin?: { horizontal: "center" | "left" | "right"; vertical: "bottom" | "top" };
  showClose?: boolean;
  showAction?: boolean;
  leadingIcon?: IconNames;
  iconType?: iconTypes;
  message?: string;
  title?: string;
  className?: string;
  dataTestId?: string;
  onClose?: (e: any) => void;
  handleActionClick?: () => void;
  rootClassName?: string;
  classes?: SnackbarClasses;
  actionBtnText?: string;
};

export interface SnackbarClasses {
  root?: string;
  contentRoot?: string;
  contentMessage?: string;
  contentMessageIcon?: string;
  contentMessageText?: string;
  contentAction?: string;
}
export const iconVariant = {
  error: "ic-snackbar-error",
  success: "ic-accordion-success-v2",
  warning: "ic-snackbar-warning",
  info: "ic-snackbar-info",
};

const getLeadingIconAsPerVariant = (variant: string) => {
  switch (variant) {
    case iconTypes.ERROR:
      return IconNames.snackbarErrorIcon;
    case iconTypes.INFO:
      return IconNames.infoIcon;
    case iconTypes.SUCCESS:
      return IconNames.accordionSuccessCircledTickIcon;
    case iconTypes.WARNING:
      return IconNames.snackbarErrorIcon;
    default:
      return IconNames.snackbarLeadingIcon;
  }
};
export function Snackbar(props: SnackbarProps) {
  const {
    dataTestId,
    showClose = true,
    showAction = true,
    className,
    message,
    title,
    iconType = "success",
    leadingIcon = getLeadingIconAsPerVariant(iconType),
    onClose,
    anchorOrigin = {
      vertical: "top",
      horizontal: "center",
    },
    rootClassName,
    classes: propsClasses = {},
    handleActionClick = () => {},
    actionBtnText = "Action",
  } = props;
  const [open, setOpen] = React.useState(true);
  const OnCloseSnackbar = (e: any) => {
    setOpen(false);
    onClose && onClose(e);
  };
  const { classes, cx, theme } = useStyles({ iconType, title, showClose });
  const { semColors, sizing, snackbar, spacing } = theme.tokens;
  return (
    <MuiSnackbar
      anchorOrigin={anchorOrigin}
      open={open}
      className={cx(rootClassName, propsClasses.root, classes.snackbarContainer)}
      data-testid={dataTestId}>
      <MuiSnackbarContent
        className={cx(classes[iconType], classes.snackbarContent, className, propsClasses.contentRoot)}
        message={
          <Grid container className={cx(propsClasses.contentMessage)}>
            <Grid item className={cx(classes.messageIcon, propsClasses.contentMessageIcon)}>
              <MvSvgIcon width={sizing.small} height={sizing.small} name={leadingIcon} />
            </Grid>
            <Grid item className={cx(classes.messageText, propsClasses.contentMessageText)}>
              {title ? (
                <Grid container direction={"column"} gap={spacing["3xCompact"]}>
                  <Grid item>
                    <Typography
                      variant={TypographyVariants.bodyMediumHighEmphasis}
                      colorValue={iconType === iconTypes.NEUTRAL ? snackbar.neutral.text.color : snackbar.text.color}>
                      {title}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant={TypographyVariants.bodySmallLowEmphasis}
                      colorValue={iconType === iconTypes.NEUTRAL ? snackbar.neutral.text.color : snackbar.text.color}>
                      {message}
                    </Typography>
                  </Grid>
                </Grid>
              ) : (
                <Typography
                  variant={snackbar.message.text.typography}
                  colorValue={iconType === iconTypes.NEUTRAL ? snackbar.neutral.text.color : snackbar.text.color}>
                  {message}
                </Typography>
              )}
            </Grid>
          </Grid>
        }
        action={
          <Grid container className={classes.actionContainer}>
            {showAction && (
              <Grid item className={classes.actionText}>
                <Button id="linkBtn" variant={buttonVariantConstants.LINK} withIcon={false} disabled={false} onClick={handleActionClick}>
                  {actionBtnText}
                </Button>
              </Grid>
            )}
            {showClose && (
              <Grid item className={classes.closeIcon}>
                <IconButton onClick={OnCloseSnackbar}>
                  <MvSvgIcon width={theme.tokens.sizing.small} height={theme.tokens.sizing.small} name={IconNames.closeIcon} />
                </IconButton>
              </Grid>
            )}
          </Grid>
        }
      />
    </MuiSnackbar>
  );
}
