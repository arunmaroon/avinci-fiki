import React from "react";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { Typography } from "./typography";
import { TypographyVariants } from "@mvloans/base-ui.common";

export const H1 = () => {
  return (
    <ThemeProvider>
      <Typography variant={TypographyVariants.headline1}>Heading H1</Typography>
    </ThemeProvider>
  );
};

export const H2 = () => {
  return (
    <ThemeProvider>
      <Typography variant={TypographyVariants.headline2}>Heading H2</Typography>
    </ThemeProvider>
  );
};

export const H3 = () => {
  return (
    <ThemeProvider>
      <Typography variant={TypographyVariants.headline2}>Heading H3</Typography>
    </ThemeProvider>
  );
};

export const H4 = () => {
  return (
    <ThemeProvider>
      <Typography variant={TypographyVariants.title1}>Heading H4</Typography>
    </ThemeProvider>
  );
};

export const PageTitle = () => {
  return (
    <ThemeProvider>
      <Typography variant={TypographyVariants.title2}>PageTitle Typography</Typography>
    </ThemeProvider>
  );
};

export const SectionTitle = () => {
  return (
    <ThemeProvider>
      <Typography variant={TypographyVariants.title2}>SectionTitle Typography</Typography>
    </ThemeProvider>
  );
};

export const SubTitle = () => {
  return (
    <ThemeProvider>
      <Typography variant={TypographyVariants.bodyLargeMediumEmphasis}>SubTitle Typography</Typography>
    </ThemeProvider>
  );
};

export const ParagraphLeading = () => {
  return (
    <ThemeProvider>
      <Typography variant={TypographyVariants.title2}>Paragraph Leading Typography</Typography>
    </ThemeProvider>
  );
};

export const ParagraphDefault = () => {
  return (
    <ThemeProvider>
      <Typography variant={TypographyVariants.bodyLargeLowEmphasis}>Paragraph Default Typography</Typography>
    </ThemeProvider>
  );
};
export const ParagraphSmall = () => {
  return (
    <ThemeProvider>
      <Typography variant={TypographyVariants.bodyMediumLowEmphasis}>Paragraph Small Typography</Typography>
    </ThemeProvider>
  );
};

export const Caption = () => {
  return (
    <ThemeProvider>
      <Typography variant={TypographyVariants.bodySmallLowEmphasis}>Caption Typography</Typography>
    </ThemeProvider>
  );
};

export const CaptionSmall = () => {
  return (
    <ThemeProvider>
      <Typography variant={TypographyVariants.bodyTinyLowEmphasis}>Caption Small Typography</Typography>
    </ThemeProvider>
  );
};

export const CaptionSmallLink = () => {
  return (
    <ThemeProvider>
      <Typography variant={TypographyVariants.bodyTinyLink} href="#">
        Caption Small Link Typography
      </Typography>
    </ThemeProvider>
  );
};

export const H1DefaultColor = () => {
  return (
    <ThemeProvider>
      <Typography variant={TypographyVariants.headline1}>Heading H1 Default</Typography>
    </ThemeProvider>
  );
};
