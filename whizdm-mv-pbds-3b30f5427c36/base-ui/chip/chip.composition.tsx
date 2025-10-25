import React from "react";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { IconNames } from "@mvloans/base-ui.mv-svg-icon";
import { Badge } from "@mvloans/base-ui.badge";

import { Chip } from "./chip";

export const BasicChip = () => {
  return (
    <ThemeProvider>
      <Chip
        label="Item name"
        dataTestId="basic-chip"
        variant="outlined"
        type="unselected"
        selected={false}
        checked={false}
        value={"item"}
        suffix={<Badge badgeContent={6} />}
      />
    </ThemeProvider>
  );
};

export const SelectedChipWhenMultiCheckDisabled = () => {
  return (
    <ThemeProvider>
      <Chip
        label="Item name"
        dataTestId="selected-multicheck-disabled-chip"
        variant="outlined"
        type="selectedNonMultiple"
        selected={true}
        value={"item"}
      />
    </ThemeProvider>
  );
};

export const SelectedChipWhenMultiCheck = () => {
  return (
    <ThemeProvider>
      <Chip
        label="Item name"
        dataTestId="selected-multicheck-chip"
        variant="outlined"
        type="selectedMultiple"
        selected={true}
        checked={true}
        value={"item"}
      />
    </ThemeProvider>
  );
};

export const SelectedChipWithDelete = () => {
  return (
    <ThemeProvider>
      <Chip
        label="Item name"
        dataTestId="selected-chip-delete"
        variant="outlined"
        type="selectedWithDeleteIcon"
        selected={true}
        onDelete={() => console.log("delete clicked")}
        value={"item"}
      />
    </ThemeProvider>
  );
};

export const SelectedChipWithIcon = () => {
  return (
    <ThemeProvider>
      <Chip
        label="Item name"
        dataTestId="selected-chip-with-icon"
        variant="outlined"
        type="selectedMultipleWithCustomIcon"
        selected={true}
        iconName={IconNames.badgeIcon}
        value={"item"}
      />
    </ThemeProvider>
  );
};

export const inputChipWithIconAndDelete = () => {
  return (
    <ThemeProvider>
      <Chip
        label="Item name"
        dataTestId="input-chip-with-icon-and-delete"
        variant="outlined"
        type="inputWithCustomAndDeleteIcon"
        iconName={IconNames.badgeIcon}
        onDelete={() => console.log("delete clicked")}
        value={"item"}
      />
    </ThemeProvider>
  );
};
