import { ReactElement, ReactNode } from "react";
import { Button, Tooltip as MuiTooltip } from "@mui/material";
import Typography from "@mvloans/base-ui.typography";
import { useStyles } from "./styles";

type Position = "top" | "bottom" | "left" | "right";
type Alignment = "start" | "center" | "end";
type Placement =
  | "bottom-end"
  | "bottom-start"
  | "bottom"
  | "left-end"
  | "left-start"
  | "left"
  | "right-end"
  | "right-start"
  | "right"
  | "top-end"
  | "top-start"
  | "top";

export type TooltipProps = {
  position: Position;
  alignment: Alignment;
  label: string | ReactNode;
  children: ReactElement;
  classses?: {
    titleClass: string;
    contentButtonClass: string;
  };
};

const getPlacement = (position: Position, alignment: Alignment): Placement => {
  if (alignment === "center") {
    return position;
  }
  return `${position}-${alignment}`;
};

const getLabel = (label: string | ReactNode, theme: any) => {
  if (typeof label === "string") {
    return (
      <Typography variant={theme.tokens.tooltip.text.typography} colorValue={theme.tokens.tooltip.text.color}>
        {label}
      </Typography>
    );
  }
  return label;
};

export const Tooltip = (props: TooltipProps) => {
  const { position, alignment, label, children, classses: { titleClass, contentButtonClass } = {} } = props;
  const placement = getPlacement(position, alignment);
  const { classes, cx, theme } = useStyles({ placement });

  return (
    <MuiTooltip
      classes={{ tooltip: classes.tooltip, tooltipArrow: classes.tooltipArrow }}
      placement={placement}
      title={getLabel(label, theme)}
      arrow>
      <Button className={cx(classes.button, contentButtonClass)}>{children}</Button>
    </MuiTooltip>
  );
};
