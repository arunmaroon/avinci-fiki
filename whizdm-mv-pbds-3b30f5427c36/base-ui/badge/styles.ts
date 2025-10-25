import { BadgeProps } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export const useStyles: Function = makeStyles<BadgeProps>()((theme, props) => {
  const { badge, sizing, radius, borderWidth, spacing } = theme.tokens;
  return {
    root: {
      position: "relative",
    },
    iconClass: {
      width: sizing.small,
      height: sizing.small,
      position: "absolute",
      top: spacing["4xCompact"],
      left: spacing["4xCompact"],
    },
    dotWithIconAndContent: {
      top: "-9px",
      left: "12px",
    },
    dotWithIconWithoutContent: {
      left: "18px",
      top: "-2px",
    },
    dotRoot: {
      padding: `${spacing["4xCompact"]} ${spacing["2xCompact"]}`,
      justifyContent: "center",
      alignContent: "center",
      position: "absolute",
      zIndex: 1,
    },
    dotWithoutContent: {
      backgroundColor: badge.background.color,
      width: `calc( ${sizing["2xSmall"]} + (${borderWidth.medium} * 2) )`,
      height: `calc( ${sizing["2xSmall"]} + (${borderWidth.medium} * 2) )`,
      borderRadius: "50%",
      border: `${borderWidth.medium} solid ${badge.border.color}`,
    },
    dotWithoutIconAndWithContent: {
      position: "relative",
    },
    dotWithContent: {
      backgroundColor: badge.background.color,
      width: `calc( ${sizing["xSmall"]} + (${borderWidth.large} * 2) )`,
      height: `calc( ${sizing["xSmall"]} + (${borderWidth.large} * 2) )`,
      borderRadius: "50%",
      border: `${borderWidth.large} solid ${badge.border.color}`,
    },
  };
});
