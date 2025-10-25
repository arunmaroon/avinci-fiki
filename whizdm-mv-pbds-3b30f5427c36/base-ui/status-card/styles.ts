import { projectTokens } from "@mvloans/base-ui.common";
import { makeStyles } from "tss-react/mui";

export const useStyles: Function = makeStyles()((theme) => {
  const { semColors, borderWidth, radius, spacing, sizing } = theme.tokens;
  return {
    rootCard: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      boxShadow: "none",
      border: `${borderWidth.medium} solid transparent`,
      borderRadius: radius.xSmall,
      backgroundOrigin: "border-box",
      backgroundClip: "content-box, border-box",
      "& .MuiCardContent-root": {
        padding: spacing["4xCompact"],
      },
    },
    rootCardBorderSuccess: {
      backgroundImage: `linear-gradient(white, white), linear-gradient(180deg, ${projectTokens.color.brandBorder1}, ${projectTokens.color.brandBorder2})`,
    },
    rootCardBorderError: {
      backgroundImage: `linear-gradient(white, white), linear-gradient(180deg, ${projectTokens.color.dangerBorder1}, ${projectTokens.color.dangerBorder2})`,
    },
    rootCardBorderWarning: {
      backgroundImage: `linear-gradient(white, white), linear-gradient(180deg, ${projectTokens.color.warningBorder1},${projectTokens.color.warningBorder2})`,
    },
    rootCardBorderInfo: {
      backgroundImage: `linear-gradient(white, white), linear-gradient(180deg, ${projectTokens.color.infoBorder1}, ${projectTokens.color.infoBorder2},)`,
    },
    cardBackgroundSuccess: {
      backgroundColor: semColors.brand.background.quinary,
    },
    cardBackgroundError: {
      backgroundColor: semColors.danger.background.primary,
    },
    cardBackgroundWarning: {
      backgroundColor: semColors.warning.background.primary,
    },
    cardBackgroundInfo: {
      backgroundColor: semColors.info.background.primary,
    },
    cardContentContainer: {
      flexWrap: "nowrap",
      position: "relative",
      alignItems: "center",
    },
    contentItem: {
      padding: `${spacing.default} ${spacing.spacious} ${spacing.default} ${spacing.default}`,
    },
    titleContainer: {
      justifyContent: "space-between",
    },
    description: {
      marginTop: spacing.xCompact,
    },
    icon: {
      width: sizing["2xLarge"],
      height: sizing["2xLarge"],
    },
    actionItem: {
      "& button:first-of-type": {
        padding: spacing["4xCompact"],
        paddingInline: spacing["4xCompact"],
        paddingBlock: spacing["4xCompact"],
        height: projectTokens.sizing[22],
      },
      marginTop: spacing.compact,
    },
    rootButton: {
      "&&:hover": {
        backgroundColor: "transparent",
      },
      justifyContent: "flex-start",
      "& p:first-of-type": {
        fontWeight: "600 !important",
      },
      "& span:first-of-type": {
        marginLeft: spacing["2xCompact"],
      },
    },
    rootButtonSuccess: {
      "&&": { backgroundColor: semColors.brand.background.quinary },
      "&& p:first-of-type": {
        color: semColors.brand.text.secondary,
      },
      "& .MuiButton-endIcon": {
        "& svg": {
          color: semColors.brand.text.secondary,
        },
      },
    },
    rootButtonError: {
      "&&": { backgroundColor: semColors.danger.background.primary },
      "&& p:first-of-type": {
        color: semColors.danger.text.primary,
      },
      "& .MuiButton-endIcon": {
        "& svg": {
          color: semColors.danger.text.primary,
        },
      },
    },
    rootButtonWarning: {
      "&&": { backgroundColor: semColors.warning.background.primary },
      "&& p:first-of-type": {
        color: semColors.warning.text.primary,
      },
      "& .MuiButton-endIcon": {
        "& svg": {
          color: semColors.warning.text.primary,
        },
      },
    },
    rootButtonInfo: {
      "&&": { backgroundColor: semColors.info.background.primary },
      "&& p:first-of-type": {
        color: semColors.info.text.primary,
      },
      "& .MuiButton-endIcon ": {
        "& svg": {
          color: semColors.info.text.primary,
        },
      },
    },
    closeItem: {
      position: "absolute",
      right: sizing.xSmall,
      top: sizing.xSmall,
      cursor: "pointer",
      color: semColors.neutral.icon.secondary,
    },
  };
});
