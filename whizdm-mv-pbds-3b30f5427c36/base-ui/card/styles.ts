import { makeStyles } from "tss-react/mui";
import { projectTokens } from "@mvloans/base-ui.common";

export const useStyles: Function = makeStyles()((theme) => {
  const { spacing, semColors, sizing, radius, card, shadow } = theme.tokens;
  return {
    cardContainer: { position: "relative" },
    chipClass: {
      position: "absolute",
      top: projectTokens.position["-12"],
      right: projectTokens.position[24],
      background: "linear-gradient(90deg, #09733E -32.26%, #2B73DE 119.89%)",
      zIndex: 1,
      height: sizing.small,
      maxWidth: sizing["4xLarge"],
    },
    cardRoot: {
      minWidth: projectTokens.sizing[312],
      width: "100%",
      borderRadius: radius.xLarge,
      cursor: "pointer",
      paddingBottom: spacing.spacious,
      // @ts-ignore
      border: `${card.unselected.borderWidth.width} solid ${card.elevated.border.color}`,
      boxShadow: shadow.defaultPrimary,
    },
    cardVariant1Header: {
      padding: `${spacing.spacious} ${spacing.spacious} ${spacing["4xCompact"]} ${spacing.spacious}`,
      "& .MuiCardHeader-avatar": {
        marginRight: spacing["4xCompact"],
        alignSelf: "flex-start",
      },
      "&.MuiCardHeader-root": {
        gap: spacing.default,
      },
    },
    cardVariant1Content: {
      "&.MuiCardContent-root": {
        padding: `${spacing["4xCompact"]} ${spacing.spacious}`,
      },
    },
    cardVariant1ContentIcon: {
      "&.MuiSvgIcon-root": {
        width: sizing.xSmall,
        height: sizing.xSmall,
      },
      marginRight: spacing["2xCompact"],
      color: semColors.neutral.icon.secondary,
    },
    cardVariant1Action: {
      display: "flex",
      alignItems: "center",
      gap: spacing["2xCompact"],
      paddingTop: spacing.default,
    },
    cardVariant1Icon: {
      "&.MuiSvgIcon-root": {
        width: sizing.small,
        height: sizing.small,
      },
      color: semColors.neutral.icon.secondary,
    },

    cardVariant2Icon: {
      color: semColors.neutral.icon.secondary,
    },
    cardVariant2Header: {
      padding: `${spacing.spacious} ${spacing.spacious} ${spacing["4xCompact"]} ${spacing.spacious}`,

      "& .MuiCardHeader-avatar": {
        alignSelf: "flex-start",
        marginRight: spacing["4xCompact"],
      },
      "&.MuiCardHeader-root": {
        gap: spacing.default,
      },
    },
    cardVariant2Content: {
      marginTop: projectTokens.spacing["-4"],
      paddingInline: spacing.spacious,
      "&.MuiCardContent-root": {
        paddingBlock: `${spacing.default} ${spacing["4xCompact"]}`,
      },
      color: semColors.neutral.text.lowEmphasis,
    },
    cardVariant2Action: {
      marginTop: spacing.xCompact,
      display: "flex",
      alignItems: "center",
      gap: spacing["2xCompact"],
    },

    typographyTitleClass: {
      paddingTop: projectTokens.spacing[1],
    },
    disableSpacing: {
      margin: spacing["4xCompact"],
    },

    iconClass: {
      color: semColors.neutral.icon.secondary,
      width: spacing.spacious,
      height: spacing.spacious,
      margin: `${spacing["2xCompact"]} ${spacing.xCompact} ${spacing["2xCompact"]} ${spacing["4xCompact"]}`,
    },
  };
});
