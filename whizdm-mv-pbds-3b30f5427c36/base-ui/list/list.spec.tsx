import React from "react";
import { render, screen } from "@testing-library/react";
import { BasicList, BasicListWithJSXElement } from "./list.composition";

it("should render basic list", () => {
  const rendered = render(<BasicList />);
  expect(rendered).toBeTruthy();

  const primaryText = screen.getByText("Location");
  expect(primaryText).toBeVisible();

  const secondaryText = screen.getByText("To verify address details");
  expect(secondaryText).toBeVisible();
});

it("should render children if options contain children ", () => {
  render(<BasicList />);

  const childNode = screen.getByText("This is child node");
  expect(childNode).toBeVisible();
});

it("should render icon  if icon  passed", () => {
  render(<BasicList />);

  const icon = screen.getAllByAltText("ic-print");
  expect(icon).toHaveLength(3);
});

it("should apply passed class to icon", () => {
  render(<BasicList />);

  const icon = screen.getAllByAltText("ic-print")[0];

  expect(icon.closest("div")?.className).toMatch(/iconClass/);
});

it("should render an icon of type JSX.Element", () => {
  render(<BasicListWithJSXElement />);

  const iconElement = screen.getByAltText("stepper");
  expect(iconElement).toBeInTheDocument();
});
