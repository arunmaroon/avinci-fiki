import { makeStyles } from "tss-react/mui";

export const useStyles: Function = makeStyles()((theme, { colorValue = theme.tokens.semColors.neutral.text.lowEmphasis }: any) => ({
  colorClass: {
    color: colorValue,
  },
  /* Styles applied to the root element if `textTransform="upper"`. */
  upper: {
    textTransform: "uppercase",
  },

  /* Styles applied to the root element if `textTransform="lower"`. */
  lower: {
    textTransform: "lowercase",
  },

  /* Styles applied to the root element if `textTransform="capital"`. */
  capital: {
    textTransform: "capitalize",
  },

  /* Styles applied to the root element if `fontWeight="regular"`. */
  regular: {
    fontWeight: "400",
  },

  /* Styles applied to the root element if `fontWeight="medium"`. */
  medium: {
    fontWeight: "500",
  },

  /* Styles applied to the root element if `fontWeight="semiBold"`. */
  semiBold: {
    fontWeight: "600",
  },

  link: {
    textUnderlineOffset: "3px",
  },
}));
