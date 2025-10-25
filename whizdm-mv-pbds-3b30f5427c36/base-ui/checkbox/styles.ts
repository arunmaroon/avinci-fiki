import { makeStyles } from "tss-react/mui";

export const useStyles: Function = makeStyles()((theme) => {
  const { checkbox, spacing, checkboxListItem } = theme.tokens;
  return {
    checkbox: {
      "&.MuiCheckbox-root": {
        alignSelf: "start",
        color: checkbox.unselected.border.color,
        padding: 0,
        "&:hover": {
          color: checkbox.unselected.hover.border.color,
        },
        "&:active": {
          color: checkbox.unselected.pressed.border.color,
        },
        "&.Mui-disabled": {
          color: checkbox.unselected.disabled.border.color,
        },

        "&.Mui-checked": {
          color: checkbox.selected.background.color,
          "&:hover": {
            color: checkbox.selected.hover.background.color,
          },
          "&:active": {
            color: checkbox.selected.pressed.background.color,
          },
          "&.Mui-disabled": {
            color: checkbox.selected.disabled.background.color,
          },
        },
        "&.MuiCheckbox-indeterminate": {
          color: checkbox.indeterminate.background.color,
          "&:hover": {
            color: checkbox.indeterminate.hover.background.color,
          },
          "&:active": {
            color: checkbox.indeterminate.pressed.background.color,
          },
          "&.Mui-disabled": {
            color: checkbox.indeterminate.disabled.background.color,
          },
        },
      },
    },
    formGroup: {
      paddingBlock: checkbox.paddingTopAndBottom.spacing,
      "& .MuiFormControlLabel-root": {
        alignItems: "center",
      },
    },
    formControlLabel: {
      "&.MuiFormControlLabel-root": {
        margin: 0,
      },

      "&:hover .MuiCheckbox-root": {
        color: checkbox.unselected.hover.border.color,
      },

      "&:hover .MuiCheckbox-indeterminate": {
        color: checkbox.indeterminate.hover.background.color,
      },

      "&:hover .Mui-checked": {
        color: checkbox.selected.hover.background.color,
      },

      "&:hover .Mui-disabled": {
        color: checkbox.unselected.disabled.border.color,
      },

      "&& .MuiFormControlLabel-label": {
        marginLeft: checkbox.spaceBetween.spacing,
        color: checkboxListItem.text.color,

        "&.Mui-disabled": {
          color: checkboxListItem.disabled.color,
        },
      },
    },
  };
});
