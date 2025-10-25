import React, { useState } from "react";
import { Checkbox } from "./checkbox";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
export const BasicCheckbox = () => {
  const [checked, setChecked] = useState(false);
  return (
    <ThemeProvider>
      <Checkbox dataTestId="checkbox" label="My label" checked={checked} onChange={() => setChecked(!checked)} />
    </ThemeProvider>
  );
};

export const DisabledCheckbox = () => {
  return (
    <ThemeProvider>
      <Checkbox dataTestId="disabled-checkbox" label="My label" disabled />
    </ThemeProvider>
  );
};

export const DefaultSelectedCheckbox = () => {
  const [checked, setChecked] = useState(true);
  return (
    <ThemeProvider>
      <Checkbox dataTestId="default-selected-checkbox" label="My label" checked={checked} onChange={() => setChecked(!checked)} />
    </ThemeProvider>
  );
};

export const IndeterminateCheckbox = () => {
  return (
    <ThemeProvider>
      <Checkbox dataTestId="indeterminate-checkbox" label="My label" indeterminate={true} />
    </ThemeProvider>
  );
};
