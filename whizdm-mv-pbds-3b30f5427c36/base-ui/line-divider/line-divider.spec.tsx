import React from "react";
import { render } from "@testing-library/react";
import { HorizontalLineDivider } from "./line-divider.composition";

it.skip("renders with the correct text", () => {
  const { getByText } = render(<HorizontalLineDivider />);
  const rendered = getByText("hello world!");
  expect(rendered).toBeTruthy();
});
