import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { Tabs } from "./tab.composition";

const tabsList = [{ label: "a" }, { label: "b" }, { label: "c" }];

it("should render all tabs correctly", () => {
  render(<Tabs />);
  const tabElement = screen.getAllByTestId("tabs");
  expect(tabElement.length).toBe(3);
});

it("should render tabs with correct label", () => {
  render(<Tabs />);
  tabsList.map((item) => {
    let tabElement = screen.getByText(item.label);
    expect(tabElement).toBeInTheDocument();
  });
});
it("activates second tab when clicking on it", () => {
  const { getByText } = render(<Tabs />);
  const tab1 = getByText("a").closest("button");
  const tab2 = getByText("b").closest("button");
  expect(tab1).toHaveAttribute("aria-selected", "true");
  expect(tab2).toHaveAttribute("aria-selected", "false");
  if (tab2) {
    fireEvent.click(tab2);
    expect(tab1).toHaveAttribute("aria-selected", "false");
    expect(tab2).toHaveAttribute("aria-selected", "true");
  }
});

it.skip("render icon for all tabs", () => {
  render(<Tabs />);
  const icon = screen.getAllByRole("img");
  expect(icon.length).toBe(3);
});

it("renders default tab as selected and others as unselected", () => {
  const rendered = render(<Tabs />);
  const selectedTab = screen.getByText("a").closest("button");
  expect(selectedTab).toHaveClass("selectedTabClass");

  const unselectedTab = screen.getByText("b").closest("button");
  expect(unselectedTab).toHaveClass("unselectedTabClass");
});
