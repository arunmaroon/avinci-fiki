import React from "react";
import { render, fireEvent } from "@testing-library/react";
import {
  H1,
  H2,
  H3,
  H4,
  PageTitle,
  SectionTitle,
  SubTitle,
  ParagraphLeading,
  ParagraphDefault,
  ParagraphSmall,
  Caption,
  H1DefaultColor,
} from "./typography.composition";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { Typography } from "./typography";
import { TypographyVariants } from "@mvloans/base-ui.common";

it("should render with the correct Heading H1 props", () => {
  const { getByText } = render(<H1 />);
  const rendered = getByText("Heading H1");
  expect(rendered).toBeTruthy();
});
it("should render with the correct Heading H2 props", () => {
  const { getByText } = render(<H2 />);
  const rendered = getByText("Heading H2");
  expect(rendered).toBeTruthy();
});
it("should render with the correct Heading H3 props", () => {
  const { getByText } = render(<H3 />);
  const rendered = getByText("Heading H3");
  expect(rendered).toBeTruthy();
});
it("should render with the correct Heading H4 props", () => {
  const { getByText } = render(<H4 />);
  const rendered = getByText("Heading H4");
  expect(rendered).toBeTruthy();
});
it("should render with the correct PageTitle props", () => {
  const { getByText } = render(<PageTitle />);
  const rendered = getByText("PageTitle Typography");
  expect(rendered).toBeTruthy();
});
it("should render with the correct SectionTitle props", () => {
  const { getByText } = render(<SectionTitle />);
  const rendered = getByText("SectionTitle Typography");
  expect(rendered).toBeTruthy();
});
it("should render with the correct SubTitle props", () => {
  const { getByText } = render(<SubTitle />);
  const rendered = getByText("SubTitle Typography");
  expect(rendered).toBeTruthy();
});
it("should render with the correct Paragraph Leading props", () => {
  const { getByText } = render(<ParagraphLeading />);
  const rendered = getByText("Paragraph Leading Typography");
  expect(rendered).toBeTruthy();
});
it("should render with the correct Paragraph Default props", () => {
  const { getByText } = render(<ParagraphDefault />);
  const rendered = getByText("Paragraph Default Typography");
  expect(rendered).toBeTruthy();
});
it("should render with the correct Paragraph Small props", () => {
  const { getByText } = render(<ParagraphSmall />);
  const rendered = getByText("Paragraph Small Typography");
  expect(rendered).toBeTruthy();
});

it("should render with the correct Caption props", () => {
  const { getByText } = render(<Caption />);
  const rendered = getByText("Caption Typography");
  expect(rendered).toBeTruthy();
});

it("should render with the correct Overline props", () => {
  const { getByText } = render(<H1DefaultColor />);
  const rendered = getByText("Heading H1 Default");
  expect(rendered).toBeTruthy();
});

it("should render with the correct Overline props", () => {
  const onClick = jest.fn();
  const { getByRole } = render(
    <ThemeProvider>
      <Typography variant={TypographyVariants.bodyTinyLowEmphasis} onClick={onClick} href={"#"}>
        Caption Small Link Typography
      </Typography>
    </ThemeProvider>
  );
  const rendered = getByRole("link");
  fireEvent.click(rendered);
  expect(onClick).toHaveBeenCalledTimes(1);
});
