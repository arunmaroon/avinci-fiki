import { projectTokens } from "@mvloans/base-ui.common";
import { makeStyles } from "tss-react/mui";

export const useStyles: Function = makeStyles()((theme) => {
  const { semColors, spacing, borderWidth, radius, fontSize } = theme.tokens;
  return {
    boundaryClass: {
      borderRadius: radius.medium,
      border: `${borderWidth.medium} solid ${semColors.neutral.border.tertiary}`,
    },
    cardRoot: {
      height: "auto",
      boxSizing: "border-box",
      border: "none",
      marginBlock: spacing.default,
      width: "100%",
      cursor: "pointer",
    },
    cardContent: {
      "&:last-child": {
        padding: spacing.default,
        [theme.breakpoints.down("sm")]: {
          padding: `${spacing.xCompact} ${spacing.default}`,
        },
      },
    },
    cardContentGrid: {
      [theme.breakpoints.down("sm")]: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
    },
    columnWidth: {
      width: projectTokens.sizing[96],
    },
    termClass: {
      margin: spacing["4xCompact"],
      whiteSpace: "nowrap",
    },
    emiClass: {
      margin: `${spacing["4xCompact"]} ${spacing["2xCompact"]} ${spacing["4xCompact"]} ${spacing["4xCompact"]}`,
    },
    interestClass: {
      "&.MuiTypography-root": {
        marginTop: spacing["3xCompact"],
      },
    },
    selectedCard: {
      border: `${borderWidth.large} solid ${semColors.brand.border.tertiary}`,
    },
    symbolClass: {
      fontSize: fontSize[75],
    },
    fontSize14: {
      fontSize: fontSize[100],
    },
    flex: {
      display: "flex",
    },
    showCards: {
      paddingLeft: spacing["2xCompact"],
      verticalAlign: "middle",
    },
    headingClass: {
      paddingLeft: spacing.default,
      paddingRight: spacing.default,
    },
    displayCardClass: {
      textAlign: "right",
      height: projectTokens.sizing[20],
    },
    containerGap: {
      gap: spacing.spacious,
      [theme.breakpoints.up("md")]: {
        gap: projectTokens.spacing[120],
      },
      // Special case for very small screens <375px
      "@media only screen and (max-width: 375px)": {
        justifyContent: "space-between",
      },
    },

    strikePrice: {
      textDecoration: "line-through",
      marginLeft: spacing["2xCompact"],
    },
    emiSection: {
      [theme.breakpoints.down("sm")]: {
        display: "flex",
        flexDirection: "column",
        gap: spacing["2xCompact"],
        alignItems: "flex-end",
        justifyContent: "flex-end",
      },
    },
  };
});
