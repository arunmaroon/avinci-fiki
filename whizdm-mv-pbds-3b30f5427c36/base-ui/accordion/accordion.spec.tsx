import React from "react";
import { render, screen, waitFor, fireEvent, cleanup } from "@testing-library/react";
import {
  DefaultAccordion,
  ErrorAccordion,
  SavingAccordion,
  SecondaryAccordion,
  SecondaryAccordionDocuments,
  SecondaryAccordionOneByOne,
  SuccessAccordion,
} from "./accordion.composition";

beforeEach(cleanup);

it.skip("should render default accordion", () => {
  render(<DefaultAccordion />);
  const rendered = screen.getByTestId("default");
  const rightButton = screen.getByRole("img", { name: "ic-accordion-chevron" });
  expect(rightButton).toBeVisible();
  waitFor(() => {
    fireEvent.click(rightButton);
  });
  expect(rightButton.parentNode).toHaveClass("Mui-expanded");
  expect(rendered).toBeVisible();
});

it.skip("should render error accordion", () => {
  render(<ErrorAccordion />);
  const rendered = screen.getByTestId("error");
  expect(rendered).toBeVisible();
  const errorIcon = screen.getByRole("img", { name: "ic-accordion-alert" });
  expect(errorIcon).toBeVisible();
});

it("should render saving accordion", () => {
  render(<SavingAccordion />);
  const rendered = screen.getByTestId("saving");
  expect(rendered).toBeVisible();
  const progressbar = screen.getAllByRole("progressbar");
  expect(progressbar).not.toHaveLength(0);
});

it("should render success accordion", () => {
  render(<SuccessAccordion />);
  const rendered = screen.getByTestId("success");
  expect(rendered).toHaveClass("Mui-disabled");
});

it.skip("should render secondary accordion", () => {
  render(<SecondaryAccordion />);
  const rendered = screen.getByTestId("secondary");
  expect(rendered).toBeVisible();
  expect(screen.getByRole("img", { name: "ic-mail" })).toBeVisible();
});

it.skip("should render secondary documents accordion", () => {
  render(<SecondaryAccordionDocuments />);
  const rendered = screen.getByTestId("secondaryDocuments");
  expect(rendered).toBeVisible();
  expect(screen.getByRole("img", { name: "ic-documents" })).toBeVisible();
});

it.skip("should render secondary one by one accordion", () => {
  render(<SecondaryAccordionOneByOne />);
  const rendered = screen.getByTestId("secondaryOneByOne");
  expect(rendered).toBeVisible();
  expect(screen.getByRole("img", { name: "ic-one-by-one" })).toBeVisible();
});
