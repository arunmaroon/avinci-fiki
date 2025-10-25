import React, { SyntheticEvent } from "react";
import MuiTab, { TabProps as MuiTabProps } from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useStyles } from "./styles";
import Typography from "@mvloans/base-ui.typography";
import { IconNames, MvSvgIcon } from "@mvloans/base-ui.mv-svg-icon";

interface tabsData {
  label: string;
  disabled?: boolean;
  iconProps?: { iconName: IconNames; width?: number; height?: number };
  tabProps?: MuiTabProps;
}

export enum TabIconPosition {
  top = "top",
  start = "start",
}

export type TabProps = {
  /**
   * Tab that is by default selected
   */
  value: number;

  /**
   *  Determines additional display behavior of the tabs:
   *
   *  - `scrollable` will invoke scrolling properties and allow for horizontally
   *  scrolling (or swiping) of the tab bar.
   *  -`fullWidth` will make the tabs grow to use all the available space,
   *  which should be used for small views, like on mobile.
   *  - `standard` will render the default state.
   */
  tabsVariant?: "standard" | "scrollable" | "fullWidth";

  /**
   * list of tabs. e.g:
   * tabsList={[
          { label: "a", tabProps: MuiTabProps, iconProps: IconProps },
          { label: "b", tabProps: MuiTabProps, iconProps: IconProps },
          { label: "c", tabProps: MuiTabProps, iconProps: IconProps },
        ]}
   */
  tabsList?: tabsData[];

  /**
   * The position of the icon relative to the label.
   */
  iconPosition?: TabIconPosition;

  // if it is open varient or closed one
  isOpen?: boolean;
  /**
   * Function to handle tab change
   */
  onChange: (event: SyntheticEvent, newValue: number) => void;

  /**
   * Additional classes to override.
   */
  classes?: TabClasses;
};

export interface TabClasses {
  tabsRoot?: string;
  tabRoot?: string;
  selectedTab?: string;
  unselectedTab?: string;
  bottomPill?: string;
}

export function Tab({
  value,
  tabsVariant = "fullWidth",
  tabsList = [],
  iconPosition = TabIconPosition.start,
  isOpen = false,
  onChange,
  classes: propsClasses = {},
}: TabProps) {
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    onChange(event, newValue);
  };

  const { classes, cx, theme } = useStyles({ isOpen, iconPosition });
  const { tabItem } = theme.tokens;
  const isClsoedHorizontal = !isOpen && iconPosition === "start";
  return (
    <Tabs
      onChange={handleChange}
      classes={{
        root: cx(classes.tabsRoot, propsClasses.tabsRoot),
        indicator: classes.tabIndicator,
      }}
      value={value}
      TabIndicatorProps={{
        children: <span />,
      }}
      variant={tabsVariant}>
      {tabsList &&
        tabsList.map((tabData, index) => {
          const isActiveTab = value === index;
          return (
            <MuiTab
              data-testid="tabs"
              key={index}
              label={
                <Typography
                  variant={isActiveTab ? tabItem.active.text.typography : tabItem.text.typography}
                  colorValue={isActiveTab && isClsoedHorizontal ? tabItem.closedHorizontal.active.text.color : tabItem.text.color}>
                  {tabData.label}
                </Typography>
              }
              disableRipple
              className={cx(
                isActiveTab ? classes.selectedTabClass : classes.unselectedTabClass,
                propsClasses.tabRoot,
                isActiveTab ? propsClasses.selectedTab : propsClasses.unselectedTab,
                isActiveTab ? "selectedTabClass" : "unselectedTabClass"
              )}
              icon={
                tabData?.iconProps?.iconName && (
                  <MvSvgIcon
                    name={tabData.iconProps.iconName}
                    width={tabData.iconProps.width ?? tabItem.icon.sizing}
                    height={tabData.iconProps.height ?? tabItem.icon.sizing}
                  />
                )
              }
              iconPosition={iconPosition}
              {...tabData.tabProps}
            />
          );
        })}
    </Tabs>
  );
}
