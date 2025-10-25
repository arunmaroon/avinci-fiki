import { projectTokens } from "@mvloans/base-ui.common";
import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme) => {
  const { spacing, sizing, semColors } = theme.tokens;

  return {
    newContainer: {
      background: semColors.neutral.background.secondary,
      padding: `${spacing.xCompact} ${spacing["4xCompact"]}`,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: projectTokens.spacing[52],

      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        gap: `${spacing.xCompact}`,
        padding: `${spacing.xCompact} ${spacing["4xCompact"]}`,
      },
    },
    footerIcon: {
      verticalAlign: "middle",
      width: sizing.xSmall,
      height: sizing.xSmall,
      color: semColors.neutral.icon.secondary,
    },
    iconTextContainer: {
      display: "flex",
      gap: spacing.xCompact,
      alignItems: "center",
    },
    iconContainer: {
      display: "flex",
      gap: spacing.default,
    },
  };
});
