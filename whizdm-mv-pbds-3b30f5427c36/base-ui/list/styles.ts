import { makeStyles } from "tss-react/mui";
import { projectTokens } from "@mvloans/base-ui.common";

export const useStyles: Function = makeStyles()((theme) => {
  const { spacing, sizing, radius, semColors } = theme.tokens;

  return {
    text: {
      flex: "1 1",
      flexDirection: "column",
      "& > p": {
        margin: `${spacing["3xCompact"]} ${spacing["4xCompact"]}`,
      },
    },
    listItemContainer: {
      padding: `${spacing.default} ${spacing["4xCompact"]}`,
    },
    listItem: {
      width: "100%",
      maxWidth: sizing["6xLarge"],
    },
    icon: {
      width: projectTokens.sizing[48],
      height: projectTokens.sizing[48],
      borderRadius: radius.small,
      background: semColors.neutral.background.secondary,
      padding: spacing.compact,
    },
    childContainer: {
      width: "100%",
    },
  };
});
