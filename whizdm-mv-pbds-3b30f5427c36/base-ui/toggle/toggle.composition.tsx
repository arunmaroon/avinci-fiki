import React, { useState } from "react";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { Toggle } from "./toggle";

export const BasicToggle = () => {
  const [checked, setChecked] = useState(true);
  return (
    <ThemeProvider>
      <Toggle checked={checked} onChange={() => setChecked(!checked)} />
    </ThemeProvider>
  );
};

export const DisabledToggleWhenChecked = () => {
  const [checked, setChecked] = useState(true);
  return (
    <ThemeProvider>
      <Toggle checked={checked} disabled onChange={() => setChecked(!checked)} />
    </ThemeProvider>
  );
};

export const DisabledToggleWhenUnchecked = () => {
  const [checked, setChecked] = useState(false);
  return (
    <ThemeProvider>
      <Toggle checked={checked} disabled onChange={() => setChecked(!checked)} />
    </ThemeProvider>
  );
};

export const SkeletonToggle = () => {
  const [checked, setChecked] = useState(false);
  return (
    <ThemeProvider>
      <Toggle isSkeleton disabled onChange={() => setChecked(!checked)} />
    </ThemeProvider>
  );
};
