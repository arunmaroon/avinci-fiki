import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { Variant1WithChildrenAndChip, Variant1WithChip, Variant1WithFooterAndChildrenAndChip, Variant1WithFooterAndChip, Variant2WithChildrenAndChip, Variant2WithChip, Variant2WithFooterAndChildrenAndChip, Variant2WithFooterAndChip } from "./card.composition";

afterEach(cleanup);
/**
 * Here are all the test scenarios that have been addressed:
 * - should render variant 1 with footer, children and chip
 * - should render variant 1 with footer and chip
 * - should render variant 1 with children and chip
 * - should render variant 1 with chip
 * - should render variant 2 with footer, children and chip
 * - should render variant 2 with footer and chip
 * - should render variant 2 with children and chip
 * - should render variant 2 with chip
 */

it("should render variant 1 with footer, children and chip", () => {
  // variant
  const { getByText } = render(<Variant1WithFooterAndChildrenAndChip />);
  const rendered = screen.getByTestId("variant1-footer-children-chip");
  expect(rendered).toBeTruthy();

  // footer
  const footer = getByText("Less than 1min");
  expect(footer).toBeInTheDocument();

  // chip
  const chip = getByText("Recommended");
  expect(chip).toBeInTheDocument();

  // children
  const children = getByText("children");
  expect(children).toBeTruthy();
});

it("should render variant 1 with footer and chip", () => {
  // variant
  const { getByText } = render(<Variant1WithFooterAndChip />);
  const rendered = screen.getByTestId("variant1-footer-chip");
  expect(rendered).toBeTruthy();

  // footer
  const footer = getByText("Less than 1min");
  expect(footer).toBeInTheDocument();

  // chip
  const chip = getByText("Recommended");
  expect(chip).toBeInTheDocument();

  // children
  const children = screen.queryByText("children");
  expect(children).not.toBeTruthy();
});

it("should render variant 1 with children and chip", () => {
  // variant
  const { getByText } = render(<Variant1WithChildrenAndChip />);
  const rendered = screen.getByTestId("variant1-children-chip");
  expect(rendered).toBeTruthy();

  // footer
  const footer = screen.queryByText("Less than 1min");
  expect(footer).not.toBeTruthy();

  // chip
  const chip = getByText("Recommended");
  expect(chip).toBeInTheDocument();

  // children
  const children = getByText("children");
  expect(children).toBeTruthy();
});

it("should render variant 1 with chip", () => {
  // variant
  const { getByText } = render(<Variant1WithChip />);
  const rendered = screen.getByTestId("variant1-chip");
  expect(rendered).toBeTruthy();

  // footer
  const footer = screen.queryByText("Less than 1min");
  expect(footer).not.toBeTruthy();

  // chip
  const chip = getByText("Recommended");
  expect(chip).toBeInTheDocument();

  // children
  const children = screen.queryByText("children");
  expect(children).not.toBeTruthy();
});

it("should render variant 2 with footer, children and chip", () => {
  // variant
  const { getByText } = render(<Variant2WithFooterAndChildrenAndChip />);
  const rendered = screen.getByTestId("variant2-footer-children-chip");
  expect(rendered).toBeTruthy();

  // footer
  const footer = getByText("Less than 1min");
  expect(footer).toBeInTheDocument();

  // chip
  const chip = getByText("Recommended");
  expect(chip).toBeInTheDocument();

  // children
  const children = getByText("children");
  expect(children).toBeTruthy();
});

it("should render variant 2 with footer and chip", () => {
  // variant
  const { getByText } = render(<Variant2WithFooterAndChip />);
  const rendered = screen.getByTestId("variant2-footer-chip");
  expect(rendered).toBeTruthy();

  // footer
  const footer = getByText("Less than 1min");
  expect(footer).toBeInTheDocument();

  // chip
  const chip = getByText("Recommended");
  expect(chip).toBeInTheDocument();

  // children
  const children = screen.queryByText("children");
  expect(children).not.toBeTruthy();
});

it("should render variant 2 with children and chip", () => {
  // variant
  const { getByText } = render(<Variant2WithChildrenAndChip />);
  const rendered = screen.getByTestId("variant2-children-chip");
  expect(rendered).toBeTruthy();

  // footer
  const footer = screen.queryByText("Less than 1min");
  expect(footer).not.toBeTruthy();

  // chip
  const chip = getByText("Recommended");
  expect(chip).toBeInTheDocument();

  // children
  const children = getByText("children");
  expect(children).toBeTruthy();
});

it("should render variant 2 with chip", () => {
  // variant
  const { getByText } = render(<Variant2WithChip />);
  const rendered = screen.getByTestId("variant2-chip");
  expect(rendered).toBeTruthy();

  // footer
  const footer = screen.queryByText("Less than 1min");
  expect(footer).not.toBeTruthy();

  // chip
  const chip = getByText("Recommended");
  expect(chip).toBeInTheDocument();

  // children
  const children = screen.queryByText("children");
  expect(children).not.toBeTruthy();
});