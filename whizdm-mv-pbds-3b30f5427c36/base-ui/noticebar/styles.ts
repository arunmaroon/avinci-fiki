import { makeStyles } from "tss-react/mui";
import { projectTokens } from "@mvloans/base-ui.common";
import { iconTypes } from "./constants";

export const useStyles: Function = makeStyles()((theme, { iconType, title }: any) => {
  const { noticeBar, spacing, sizing, radius } = theme.tokens;

  const { success, info, caution, error } = noticeBar;
  const getIconColor = (iconType: iconTypes) => {
    switch (iconType) {
      case iconTypes.ERROR:
        return error.leadingIcon.color;
      case iconTypes.SUCCESS:
        return success.leadingIcon.color;
      case iconTypes.INFO:
        return info.leadingIcon.color;
      case iconTypes.WARNING:
        return caution.leadingIcon.color;
    }
  };

  return {
    containerClass: {
      width: "100%",
      "& .MuiSnackbarContent-root": {
        minWidth: "280px",
        minHeight: sizing.large,
        borderRadius: title ? radius.medium : radius.small,
        boxShadow: "none",
      },
      "& .MuiSnackbarContent-message": {
        padding: spacing["4xCompact"],
      },
      "& .MuiGrid-root": {
        flexWrap: "nowrap",
      },
    },
    success: {
      backgroundColor: success.background.color,
    },
    error: {
      backgroundColor: error.background.color,
    },
    info: {
      backgroundColor: info.background.color,
    },
    warning: {
      backgroundColor: caution.background.color,
    },
    title: {
      color: noticeBar.titleText.color,
    },
    description: {
      color: noticeBar.descriptionText.color,
    },
    messageText: {
      padding: `${projectTokens.spacing[1]} ${spacing["4xCompact"]} ${spacing["4xCompact"]} ${spacing["4xCompact"]}`,
      "& p": {
        padding: title ? spacing["4xCompact"] : `${projectTokens.spacing[1]} ${spacing["4xCompact"]} `,
      },
    },

    messageIcon: {
      color: getIconColor(iconType),
    },
    actionText: {
      margin: ` ${spacing.default}  ${spacing["4xCompact"]} ${spacing.default} ${spacing.xCompact}`,
    },
    contentMessage: {
      padding: `${spacing.xCompact} ${spacing["4xCompact"]}`,
    },
    snackbarContent: {
      padding: title ? `${spacing.xCompact} ${spacing.default}` : `${spacing["2xCompact"]} ${spacing.default}`,
    },
  };
});
