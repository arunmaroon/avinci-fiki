import React from "react";
import { render } from "@testing-library/react";
import { TooltipWithNodeLabel, TooltipWithStringLabelAtEnd } from "./tooltip.composition";

it("Renders with the correct text", () => {
  const { getByText } = render(<TooltipWithStringLabelAtEnd />);
  const rendered = getByText("hover to see tooltip");
  expect(rendered).toBeTruthy();
});

it("Renders with the correct text when passing title as child", () => {
  const { getByText } = render(<TooltipWithNodeLabel />);
  const rendered = getByText("hover to see tooltip");
  expect(rendered).toBeTruthy();
});
