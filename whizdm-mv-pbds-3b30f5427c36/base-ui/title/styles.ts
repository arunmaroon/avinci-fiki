import { makeStyles } from "tss-react/mui";
import { TitleType } from "./constants";
import { Css, Cx } from "tss-react";
import { MVTheme } from "@mvloans/base-ui.theme-provider";

export const useStyles: (params: { variant: TitleType }) => {
  classes: Record<"titleContainer" | "titleText" | "subtitleText", string>;
  theme: MVTheme;
  css: Css;
  cx: Cx;
} = makeStyles<{ variant: TitleType }>()((theme: MVTheme, props) => {
  const { variant } = props;
  const { spacing } = theme.tokens;

  return {
    titleContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      gap: variant === TitleType.Dialog ? spacing["2xCompact"] : spacing.xCompact,
    },
    titleText: {
      margin: spacing["4xCompact"],
    },
    subtitleText: {
      margin: spacing["4xCompact"],
    },
  };
});
