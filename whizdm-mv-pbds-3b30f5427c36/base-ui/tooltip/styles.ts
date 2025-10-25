import { makeStyles } from "tss-react/mui";
import { placementPos } from "./constants";
import { projectTokens } from "@mvloans/base-ui.common";

export const useStyles: Function = makeStyles()((theme, { placement }: any) => {
  const { tooltip, spacing, radius } = theme.tokens;

  const getRadiusPropertyName = () => {
    switch (placement) {
      case placementPos.topEnd:
      case placementPos.topStart:
      case placementPos.top:
        return "border-bottom-right-radius";
      case placementPos.leftEnd:
      case placementPos.leftStart:
      case placementPos.left:
        return "border-top-right-radius";
      case placementPos.bottom:
      case placementPos.bottomStart:
      case placementPos.bottomEnd:
        return "border-top-left-radius";
      case placementPos.rightEnd:
      case placementPos.rightStart:
      case placementPos.right:
        return "border-bottom-left-radius";
      default:
        return "";
    }
  };

  return {
    tooltip: {
      "&&": {
        borderRadius: radius.small,
        padding: `${spacing.xCompact} ${spacing.default}`,
        backgroundColor: tooltip.background.color,
        filter: "drop-shadow(0px 8px 16px rgba(16, 16, 18, 0.08))",
        color: tooltip.text.color,
        "& .MuiTooltip-arrow": {
          color: tooltip.background.color,
          "&::before": {
            [getRadiusPropertyName()]: projectTokens.radius[2],
          },
        },
      },
    },
  };
});
