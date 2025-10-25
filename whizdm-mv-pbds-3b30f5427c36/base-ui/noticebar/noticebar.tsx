import React, { ReactNode } from "react";
import { Grid } from "@mui/material";
import MuiSnackbar from "@mui/material/Snackbar";
import MuiSnackbarContent from "@mui/material/SnackbarContent";
import Typography from "@mvloans/base-ui.typography";
import { IconNames, MvSvgIcon } from "@mvloans/base-ui.mv-svg-icon";
import { useStyles } from "./styles";
import { flexDirection, iconTypes } from "./constants";
import { TransitionProps } from "@mui/material/transitions/transition";

export type NoticebarProps = {
  open?: boolean;
  anchorOrigin?: { horizontal: "center" | "left" | "right"; vertical: "bottom" | "top" };
  iconType?: iconTypes;
  leadingIcon?: IconNames;
  message: string;
  title?: string;
  className?: string;
  dataTestId?: string;
  rootClassName?: string;
  classes?: NoticebarClasses;
};
export interface NoticebarClasses {
  root?: string;
  contentRoot?: string;
  contentMessage?: string;
  contentMessageIcon?: string;
  contentMessageText?: string;
  transistionClass?: string;
}
export const iconVariant = {
  error: "ic-snackbar-error",
  success: "ic-snackbar-success",
  warning: "ic-snackbar-warning",
  info: "ic-snackbar-info",
};

const NoTransistion = (props: TransitionProps & { children: React.ReactElement<any, any> }) => props.children;

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
export function Noticebar(props: NoticebarProps) {
  const {
    dataTestId,
    className,
    message,
    iconType = iconTypes.SUCCESS,
    leadingIcon = getLeadingIconAsPerVariant(iconType),
    anchorOrigin = {
      vertical: "top",
      horizontal: "center",
    },
    rootClassName,
    title,
    classes: propsClasses = {},
  } = props;

  const { classes, cx, theme } = useStyles({ iconType, title });
  const { noticeBar } = theme.tokens;
  return (
    <MuiSnackbar
      anchorOrigin={anchorOrigin}
      open={true}
      className={cx(rootClassName, propsClasses.root, classes.containerClass)}
      data-testid={dataTestId}
      TransitionComponent={NoTransistion}>
      <MuiSnackbarContent
        className={cx(classes[iconType], classes.snackbarContent, className, propsClasses.contentRoot)}
        message={
          <Grid container gap={theme.tokens.spacing.compact} className={cx(classes.contentMessage, propsClasses.contentMessage)}>
            <Grid item className={cx(classes.messageIcon, propsClasses.contentMessageIcon)}>
              <MvSvgIcon
                dataTestId={`leadingIcon-${iconType}`}
                width={theme.tokens.sizing.small}
                height={theme.tokens.sizing.small}
                name={leadingIcon}
              />
            </Grid>
            <Grid item className={cx(classes.messageText, propsClasses.contentMessageText)}>
              {title ? (
                <Grid container direction={flexDirection.COLUMN} gap={theme.tokens.spacing["3xCompact"]}>
                  <Grid item className={classes.title}>
                    <Typography variant={noticeBar.title.text.typography} colorValue={noticeBar.titleText.color}>
                      {title}
                    </Typography>
                  </Grid>
                  <Grid item className={classes.description}>
                    <Typography variant={noticeBar.description.text.typography} colorValue={noticeBar.descriptionText.color}>
                      {message}
                    </Typography>
                  </Grid>
                </Grid>
              ) : (
                <Typography
                  className={classes.messageText}
                  variant={noticeBar.message.text.typography}
                  colorValue={noticeBar.messageText.color}>
                  {message}
                </Typography>
              )}
            </Grid>
          </Grid>
        }
      />
    </MuiSnackbar>
  );
}
