import React from "react";
import { Title } from './title';
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { TitleType } from "./constants";

export const BasicScreenTitle = () => {
  return (
    <ThemeProvider>
      <Title title="Title" subtitle="This is the description" />
    </ThemeProvider>
  );
}

export const BasicDialogTitle = () => {
  return (
    <ThemeProvider>
      <Title title="Verify mobile number" subtitle="5 digit OTP has been sent to your mobile number" variant={TitleType.Dialog} />
    </ThemeProvider>
  );
}