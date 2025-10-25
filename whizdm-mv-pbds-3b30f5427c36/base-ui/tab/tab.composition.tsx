import React, { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";

import { Tab, TabIconPosition, TabProps } from "./tab";
import { IconNames } from "@mvloans/base-ui.common";

const tabsPanel: { [key: number]: JSX.Element } = {
  0: <Box sx={{ p: 3 }}>Item one</Box>,
  1: <Box sx={{ p: 3 }}>Item two</Box>,
  2: <Box sx={{ p: 3 }}>Item three</Box>,
};

export const Tabs = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabsList: TabProps["tabsList"] = useMemo(
    () => [
      {
        label: "a",
        iconProps: {
          iconName: selectedTab === 0 ? IconNames.badgeIcon : IconNames.badgeIcon,
          height: 16,
          width: 16,
        },
      },
      {
        label: "b",
        iconProps: {
          iconName: selectedTab === 1 ? IconNames.badgeIcon : IconNames.badgeIcon,
          height: 16,
          width: 16,
        },
      },
      {
        label: "c",
        iconProps: {
          iconName: selectedTab === 2 ? IconNames.badgeIcon : IconNames.badgeIcon,
          height: 16,
          width: 16,
        },
      },
    ],
    [selectedTab]
  );

  return (
    <ThemeProvider>
      <Tab
        value={selectedTab}
        onChange={(_, newValue) => {
          setSelectedTab(newValue);
        }}
        tabsList={tabsList}
      />
      {tabsPanel[selectedTab]}
    </ThemeProvider>
  );
};

export const TabsOpen = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabsList: TabProps["tabsList"] = useMemo(
    () => [
      {
        label: "a",
        iconProps: {
          iconName: IconNames.badgeIcon,
          height: 16,
          width: 16,
        },
      },
      {
        label: "b",
        iconProps: {
          iconName: IconNames.badgeIcon,
          height: 16,
          width: 16,
        },
      },
      {
        label: "c",
        iconProps: {
          iconName: IconNames.badgeIcon,
          height: 16,
          width: 16,
        },
      },
    ],
    [selectedTab]
  );

  return (
    <ThemeProvider>
      <Tab
        value={selectedTab}
        onChange={(_, newValue) => {
          setSelectedTab(newValue);
        }}
        tabsList={tabsList}
        isOpen
        iconPosition={TabIconPosition.top}
      />
      {tabsPanel[selectedTab]}
    </ThemeProvider>
  );
};

const tabsWithHideIconPanel: { [key: number]: JSX.Element } = {
  0: <Box sx={{ p: 3 }}>EMI list</Box>,
  1: <Box sx={{ p: 3 }}>Transactions list</Box>,
};

const tabsWithHideIconList: TabProps["tabsList"] = [{ label: "EMI details" }, { label: "Transactions" }];

export const TabsWithHideIcon = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <ThemeProvider>
      <Tab
        value={selectedTab}
        onChange={(_, newValue) => {
          setSelectedTab(newValue);
        }}
        tabsList={tabsWithHideIconList}
      />
      {tabsWithHideIconPanel[selectedTab]}
    </ThemeProvider>
  );
};
