import { projectTokens } from "@mvloans/base-ui.common";
import { makeStyles } from "tss-react/mui";

export const useStyles: Function = makeStyles()((theme) => {
  const { spacing, radius, sizing, fontWeight, semColors, borderWidth } = theme.tokens;
  return {
    cardRoot: {
      backgroundColor: semColors.neutral.background.primary,
      boxShadow: "none",
      transition: "none",
      padding: spacing.default,
    },
    borderRadius20: {
      borderRadius: radius.xLarge,
    },
    borderRadius16: {
      borderRadius: radius.large,
    },
    borderRadius12: {
      borderRadius: radius.medium,
    },

    chipTypographyClass: {
      fontWeight: fontWeight.semibold,
    },

    // Avatar Background Colors
    loadingAvatarBckColor: {
      backgroundColor: semColors.neutral.background.septenary,
    },
    completedAvatarBckColor: {
      backgroundColor: semColors.neutral.background.tertiary,
    },

    disabledAvatarBckColor: {
      backgroundColor: semColors.neutral.background.tertiary,
    },
    errorAvatarBckColor: {
      backgroundColor: semColors.neutral.background.septenary,
    },

    // BorderColor
    loadingBorderColor: {
      border: `${borderWidth.medium} solid ${semColors.neutral.border.quaternary}`,
    },
    completedBorderColor: {
      border: `${borderWidth.medium} solid ${semColors.neutral.border.tertiary}`,
    },
    disabledBorderColor: {
      border: `${borderWidth.medium} solid ${semColors.neutral.border.tertiary}`,
    },
    errorBorderColor: {
      border: `${borderWidth.medium} solid ${semColors.danger.border.primary}`,
    },

    // Chip background color
    incompleteChipBckColor: {
      backgroundColor: semColors.caution.background.secondary,
    },

    progressChipBckColor: {
      backgroundColor: semColors.warning.background.secondary,
    },

    resubmitChipBckColor: {
      backgroundColor: semColors.danger.background.primary,
    },

    // Chip Text Color
    incompleteChipTextColor: {
      "&.MuiTypography-root": {
        color: semColors.caution.text.primary,
      },
    },

    progressChipTextColor: {
      "&.MuiTypography-root": {
        color: semColors.warning.text.secondary,
      },
    },

    resubmitChipTextColor: {
      "&.MuiTypography-root": {
        color: semColors.danger.text.primary,
      },
    },

    avatar: {
      width: sizing.small,
      height: sizing.small,
    },
    chipClass: {
      "&&.MuiButtonBase-root": {
        padding: `${spacing["3xCompact"]} ${spacing.compact}`,
        border: "none",
      },
      height: "auto",
      pointerEvents: "none",
    },

    marginTop16: {
      marginTop: spacing.default,
    },
    title: {
      marginTop: projectTokens.spacing[1],
      flex: "1 1 auto",
    },
    description: {
      marginTop: spacing.xCompact,
    },
    rightStatus: {
      marginLeft: spacing.xCompact,
    },
    circle: {
      alignItems: "center",
      justifyContent: "center",
      width: sizing.small,
      height: sizing.small,
    },
    saving: {
      color: semColors.brand.icon.secondary,
    },

    savingBackground: {
      color: semColors.brand.background.quaternary,
    },
    foreground: {
      position: "absolute",
      zIndex: 2,
      padding: projectTokens.spacing[3],
    },
    background: {
      position: "absolute",
      zIndex: 1,
      padding: projectTokens.spacing[3],
    },
    chipBoundaryClass: {
      border: projectTokens.borderWidth[0],
    },

    jusitfyCenter: {
      display: "flex",
      gap: spacing["2xCompact"],
      alignItems: "center",
    },
  };
});
