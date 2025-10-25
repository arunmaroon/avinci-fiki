import React from "react";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { IconNames } from "@mvloans/base-ui.common";
import { PennyItem } from "./penny-item";
import { radiusConstants, sizeConstants, pennyItemVariant, numberStates } from "./constants";

const ThemeProviderWrapper = ({ Component }: { Component: React.ComponentType }) => {
  return (
    <ThemeProvider>
      <Component />
    </ThemeProvider>
  );
};
const PennyItem1 = () => {
  return <PennyItem variant={pennyItemVariant.ICON} radius={radiusConstants.CIRCLE} size={sizeConstants.SMALL} />;
};

const PennyItem2 = () => {
  return <PennyItem variant={pennyItemVariant.ICON} radius={radiusConstants.CIRCLE} size={sizeConstants.MEDIUM} />;
};

const PennyItem3 = () => {
  return <PennyItem variant={pennyItemVariant.ICON} radius={radiusConstants.SQUARE} size={sizeConstants.MEDIUM} />;
};

const PennyItem4 = () => {
  return <PennyItem variant={pennyItemVariant.ICON} radius={radiusConstants.SQUARE} size={sizeConstants.SMALL} />;
};
const ActiveNumber = () => {
  return <PennyItem variant={pennyItemVariant.NUMBER} numberState={numberStates.ACTIVE} label={1} />;
};

const DisabledNumber = () => {
  return <PennyItem variant={pennyItemVariant.NUMBER} numberState={numberStates.DISABLED} label={2} />;
};

const EnabledNumber = () => {
  return <PennyItem variant={pennyItemVariant.NUMBER} numberState={numberStates.ENABLED} label={3} />;
};

const ProfilePennyItem1 = () => {
  return <PennyItem variant={pennyItemVariant.PROFILE} />;
};

const ProfilePennyItem2 = () => {
  return <PennyItem variant={pennyItemVariant.PROFILE} profileLabel="NK" />;
};

const ProfilePennyItem3 = () => {
  return <PennyItem variant={pennyItemVariant.PROFILE} profileLabel={IconNames.accordionSuccessCircledTickIcon} />;
};

export const PennyItemIcon1 = () => <ThemeProviderWrapper Component={PennyItem1} />;
export const PennyItemIcon2 = () => <ThemeProviderWrapper Component={PennyItem2} />;
export const PennyItemIcon3 = () => <ThemeProviderWrapper Component={PennyItem3} />;
export const PennyItemIcon4 = () => <ThemeProviderWrapper Component={PennyItem4} />;
export const PennyItemActiveNumber = () => <ThemeProviderWrapper Component={ActiveNumber} />;
export const PennyItemDisabledNumber = () => <ThemeProviderWrapper Component={DisabledNumber} />;
export const PennyItemEnabledNumber = () => <ThemeProviderWrapper Component={EnabledNumber} />;
export const PennyItemProfileDefaultUserIcon = () => <ThemeProviderWrapper Component={ProfilePennyItem1} />;
export const PennyItemProfileText = () => <ThemeProviderWrapper Component={ProfilePennyItem2} />;
export const PennyItemProfileCustomIcon = () => <ThemeProviderWrapper Component={ProfilePennyItem3} />;
