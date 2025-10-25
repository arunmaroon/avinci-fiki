import { makeStyles } from "tss-react/mui";
import { projectTokens } from "@mvloans/base-ui.common";
import { iconTypes } from "./snackbar";

export const useStyles: Function = makeStyles()((theme, { iconType, title, showClose }: any) => {
  const { snackbar, spacing, radius, shadow, semColors, sizing, borderWidth } = theme.tokens;
  const { success, neutral, info, caution, error } = snackbar;

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
      case iconTypes.NEUTRAL:
        return neutral.leadingIcon.color;
    }
  };

  return {
    success: {
      backgroundColor: success.background.color,
      color: snackbar.text.color,
    },
    error: {
      backgroundColor: error.background.color,
      color: snackbar.text.color,
    },
    info: {
      backgroundColor: info.background.color,
      color: snackbar.text.color,
    },
    warning: {
      backgroundColor: caution.background.color,
      color: snackbar.text.color,
    },
    neutral: {
      backgroundColor: neutral.background.color,
      color: neutral.text.color,
    },

    messageIcon: {
      marginTop: spacing.xCompact,
      color: getIconColor(iconType),
    },

    snackbarContainer: {
      width: "100%",
      "& .MuiSnackbarContent-root": {
        minHeight: title ? projectTokens.sizing[61] : sizing.large,
        borderRadius: title ? radius.medium : radius.small,
        boxShadow: shadow.enabledPrimary,
        justifyContent: "space-between",
        display: "flex",
        gap: spacing.default,
        flexWrap: "nowrap",
        alignItems: "start",
      },
      "& .MuiSnackbarContent-message": {
        padding: spacing["4xCompact"],
      },
      "& .MuiSnackbarContent-action": {
        padding: spacing["4xCompact"],
      },
      "& .MuiIconButton-root": {
        "&:hover": {
          backgroundColor: "rgba(0,0,0,0)",
        },
      },
      "& .MuiGrid-root": {
        flexWrap: "nowrap",
      },
    },

    actionText: {
      "& p": {
        color: iconType === iconTypes.NEUTRAL ? semColors.neutral.text.highEmphasisInverse : semColors.neutral.text.highEmphasis,
      },
      "&& button": {
        padding: spacing["4xCompact"],
        minWidth: projectTokens.sizing[0],
        "&: hover": {
          border: `${borderWidth.medium} solid transparent`,
        },
      },
    },
    actionContainer: {
      display: "flex",
      gap: spacing.xCompact,
      paddingRight: showClose ? spacing["4xCompact"] : spacing.xCompact,
    },

    snackbarContent: {
      "& .MuiSnackbarContent-action": { marginRight: spacing["4xCompact"] },
      padding: title
        ? `${spacing.xCompact} ${spacing.xCompact} ${spacing.xCompact}  ${spacing.default}`
        : `${spacing["2xCompact"]} ${spacing.xCompact} ${spacing["2xCompact"]} ${spacing.default}`,
    },
    closeIcon: {
      "& svg": {
        color: iconType === iconTypes.NEUTRAL ? neutral.text.color : snackbar.text.color,
      },
      padding: spacing.xCompact,
      "& button": {
        padding: spacing["4xCompact"],
      },
    },
    messageText: {
      padding: `${spacing.xCompact} ${spacing.xCompact} ${spacing.xCompact} ${spacing.compact}`,

      "& p": {
        padding: `${projectTokens.spacing[1]} ${spacing["4xCompact"]} `,
      },
    },
    actionBtn: {
      color: iconType === iconTypes.NEUTRAL ? semColors.neutral.text.highEmphasisInverse : semColors.neutral.text.highEmphasis,
    },
  };
});
