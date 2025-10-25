import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme) => {
  const { lineDivider } = theme.tokens;

  return {
    divider: {
      borderRadius: lineDivider.radius,
      borderColor: lineDivider.background.color,

      // If using children, styles for the line
      "&::before, &::after": {
        borderColor: lineDivider.background.color,
      }
    }
  }
});
