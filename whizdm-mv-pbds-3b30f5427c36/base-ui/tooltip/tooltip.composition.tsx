import Typography from "@mvloans/base-ui.typography";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { TypographyVariants } from "@mvloans/base-ui.common";
import { Tooltip } from "./tooltip";

export const TooltipWithStringLabelAtStart = () => {
  return (
    <ThemeProvider>
      <Tooltip label="tooltip label" position="top" alignment="start">
        <Typography variant={TypographyVariants.bodySmallHighEmphasis}>hover to see tooltip</Typography>
      </Tooltip>
    </ThemeProvider>
  );
};

export const TooltipWithStringLabelAtCenter = () => {
  return (
    <ThemeProvider>
      <Tooltip label="tooltip label" position="top" alignment="center">
        <Typography variant={TypographyVariants.bodySmallHighEmphasis}>hover to see tooltip</Typography>
      </Tooltip>
    </ThemeProvider>
  );
};

export const TooltipWithStringLabelAtEnd = () => {
  return (
    <ThemeProvider>
      <Tooltip label="tooltip label" position="top" alignment="end">
        <Typography variant={TypographyVariants.bodySmallHighEmphasis}>hover to see tooltip</Typography>
      </Tooltip>
    </ThemeProvider>
  );
};

export const TooltipWithStringLabelAtBottomEnd = () => {
  return (
    <ThemeProvider>
      <Tooltip label="tooltip label" position="bottom" alignment="end">
        <Typography variant={TypographyVariants.bodySmallHighEmphasis}>hover to see tooltip</Typography>
      </Tooltip>
    </ThemeProvider>
  );
};
export const TooltipWithNodeLabel = () => {
  const getLabel = () => {
    return <Typography variant={TypographyVariants.bodySmallHighEmphasis}>tooltip children label</Typography>;
  };
  return (
    <ThemeProvider>
      <Tooltip label={getLabel()} position="top" alignment="center">
        <Typography variant={TypographyVariants.bodySmallHighEmphasis}>hover to see tooltip</Typography>
      </Tooltip>
    </ThemeProvider>
  );
};
