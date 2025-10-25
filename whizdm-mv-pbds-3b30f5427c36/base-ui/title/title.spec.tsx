import React from "react";
import { render } from "@testing-library/react";
import { BasicScreenTitle } from "./title.composition";

it.skip("renders with the correct text", () => {
  const { getByText } = render(<BasicScreenTitle />);
  const rendered = getByText("Title");
  expect(rendered).toBeTruthy();
});
