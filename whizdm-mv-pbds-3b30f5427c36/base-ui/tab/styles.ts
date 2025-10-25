import { makeStyles } from "tss-react/mui";
import { TabIconPosition, TabProps } from "./tab";

export const useStyles: Function = makeStyles<TabProps>()((theme, props) => {
  const { tab, tabItem, radius, spacing, sizing, semColors } = theme.tokens;
  const { isOpen, iconPosition } = props;

  const getIconWrapperMargin = (iconPosition?: TabIconPosition) => {
    switch (iconPosition) {
      case TabIconPosition.start:
        return { marginRight: spacing["2xCompact"] };
      case TabIconPosition.top:
        return { marginBottom: spacing["3xCompact"] };
      default:
        return {};
    }
  };

  const getIconWrapperColor = (isOpen?: boolean) => {
    if (isOpen) {
      return iconPosition === TabIconPosition.start ? tabItem.openHorizontal.active.icon.color : tabItem.openVertical.active.icon.color;
    } else {
      return tabItem.closedHorizontal.active.icon.color;
    }
  };

  return {
    tabsRoot: {
      "&.MuiTabs-root": {
        backgroundColor: isOpen ? semColors.neutral.background.primary : tab.closedHorizontalFrame.background.color,
        minHeight: "fit-content",
        padding: isOpen ? spacing["4xCompact"] : spacing["2xCompact"],
        borderRadius: isOpen ? "none" : radius.xLarge,
        "& .MuiTabs-flexContainer": {
          gap: spacing["xCompact"],
        },
      },
    },
    tabIndicator: {
      "&.MuiTabs-indicator": {
        display: isOpen ? "flex" : "none",
        backgroundColor: "transparent",
        justifyContent: "center",
        "& > span": {
          maxWidth: sizing.large,
          width: "100%",
          backgroundColor: `${tabItem.pillBackground.color}`,
        },
      },
    },
    selectedTabClass: {
      "&&.MuiTab-root": {
        borderRadius: isOpen ? "unset" : `${radius.large}`,
        padding: `${spacing.xCompact} ${spacing.compact}`,
        textTransform: "none",
        width: "fit-content",
        color: `${isOpen ? tabItem.text.color : tabItem.closedHorizontal.active.text.color}`,
        backgroundColor: isOpen ? semColors.neutral.background.primary : tabItem.closedHorizontal.active.background.color,
        minHeight: spacing.xSpacious,
        opacity: 1,
        "& .MuiTab-iconWrapper": {
          color: getIconWrapperColor(isOpen),
          ...getIconWrapperMargin(iconPosition),
        },
      },
    },
    unselectedTabClass: {
      "&&.MuiTab-root": {
        borderRadius: isOpen ? "unset" : `${radius.large}`,
        background: "none",
        textTransform: "none",
        color: `${tabItem.text.color}`,
        padding: `${spacing.xCompact} ${spacing.compact}`,
        minHeight: `${spacing.xSpacious}`,
        width: "fit-content",
        "& .MuiTab-iconWrapper": {
          color: tabItem.icon.color,
          ...getIconWrapperMargin(iconPosition),
        },
      },
    },
  };
});
