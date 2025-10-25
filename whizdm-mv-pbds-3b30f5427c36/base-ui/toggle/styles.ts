import { makeStyles } from "tss-react/mui";

export const useStyles: Function = makeStyles()((theme) => {
  const { toggle, sizing, spacing, radius, semColors } = theme.tokens;
  const { selected, unselected } = toggle;
  return {
    skeleTon: {
      width: sizing.large,
      height: sizing.small,
      backgroundColor: semColors.neutral.background.tertiary,
      borderRadius: radius.xSmall,
    },
    switchContainer: {
      "&&": {
        width: sizing.large,
        height: sizing.small,
        padding: spacing["4xCompact"],
        boxSizing: "content-box",
        "&:focus": {
          padding: spacing["3xCompact"],
          border: `${spacing["3xCompact"]} solid ${semColors.neutral.border.quinary} `,
          borderRadius: "100px",
          "& .MuiSwitch-switchBase": {
            padding: spacing["3xCompact"],
          },
        },
      },
      "& .MuiSwitch-switchBase": {
        padding: spacing["4xCompact"],
        margin: spacing["3xCompact"],
        borderRadius: radius.xLarge,

        "&:hover + .MuiSwitch-track": {
          backgroundColor: unselected.hover.trackBackground.color,
        },
        "&:active + .MuiSwitch-track": {
          backgroundColor: unselected.pressed.trackBackground.color,
        },
        "&.Mui-checked": {
          transform: `translateX(${spacing.default})`,
          color: toggle.handleBackground.color,
          "&:hover + .MuiSwitch-track": {
            backgroundColor: selected.hover.trackBackground.color,
          },
          "&:active + .MuiSwitch-track": {
            backgroundColor: selected.pressed.trackBackground.color,
          },

          "& + .MuiSwitch-track": {
            backgroundColor: selected.trackBackground.color,
            opacity: 1,
          },
          "&.Mui-disabled + .MuiSwitch-track": {
            backgroundColor: selected.disabled.trackBackground.color,
          },
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          backgroundColor: unselected.disabled.trackBackground.color,
          opacity: 1,
        },

        "& .MuiSwitch-thumb": {
          background: toggle.handleBackground.color,
          borderRadius: radius.xLarge,
          boxShadow: "none",
        },
      },
      "& .MuiSwitch-track": {
        borderRadius: radius.medium,
        backgroundColor: unselected.trackBackground.color,
        opacity: 1,
      },
    },
  };
});
