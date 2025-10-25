import { ChipProps } from "@mui/material";
import { TypographyVariants } from "@mvloans/base-ui.common";
import { makeStyles } from "tss-react/mui";

export const useStyles: Function = makeStyles<ChipProps>()((theme, props) => {
  const { chip, radius, spacing, typography, semColors, borderWidth, sizing } = theme.tokens;
  const { disabled } = props;

  return {
    chipClass: {
      "&&": {
        border: `1px solid ${chip.border.color}`,
        borderRadius: radius.round,
        color: chip.text.color,

        "&.MuiChip-root": {
          padding: `${spacing["4xCompact"]} ${spacing.default} ${spacing["4xCompact"]} ${spacing.default}`,
        },

        "&:hover": {
          borderColor: chip.hover.border.color,
          "& .MuiChip-icon, & .MuiChip-deleteIcon": {
            color: chip.hover.icon.color,
          },
        },

        "&.MuiChip-clickable:hover, &.Mui-focusVisible": {
          backgroundColor: semColors.neutral.background.primary,
        },

        "&:active": {
          borderColor: chip.pressed.border.color,
          color: chip.pressed.icon.color,
        },

        "&:focus-visible": {
          outline: `${borderWidth.large} solid ${semColors.neutral.border.quinary}`,
          outlineOffset: borderWidth.large,
        },

        "&.Mui-disabled": {
          borderColor: chip.disabled.border.color,
          background: chip.disabled.background.color,
          color: chip.disabled.text.color,
        },

        "& .MuiChip-label": {
          overflow: "visible",
          paddingLeft: spacing["4xCompact"],
          paddingRight: spacing["4xCompact"],

          ...typography[chip.text.typography as TypographyVariants],
        },
        "& .MuiChip-icon": {
          marginRight: spacing.xCompact,
          marginLeft: spacing["4xCompact"],
          width: sizing.xSmall,
          height: sizing.xSmall,
          color: chip.icon.color,
        },
        "& .MuiChip-deleteIcon": {
          marginLeft: spacing.xCompact,
          marginRight: spacing["4xCompact"],
          width: sizing.xSmall,
          height: sizing.xSmall,
          color: chip.icon.color,
        },
      },
    },
    selectedClass: {
      "&&": {
        border: `2px solid ${chip.selected.border.color}`,

        "&:hover": {
          borderColor: chip.selected.hover.border.color,
        },
        "&:active": {
          borderColor: chip.selected.pressed.border.color,
        },
        "& .Mui-disabled": {
          color: chip.selected.disabled.icon.color,
        },
        "& .MuiChip-label": {
          ...typography[chip.selected.text.typography as TypographyVariants],
        },
        "& .MuiChip-icon, & .MuiChip-deleteIcon": {
          color: disabled ? chip.selected.disabled.icon.color : chip.selected.icon.color,
        },
      },
    },
  };
});
