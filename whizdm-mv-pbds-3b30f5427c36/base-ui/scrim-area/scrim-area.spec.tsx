import React from "react";
import { render } from "@testing-library/react";
import { BasicScrimArea } from "./scrim-area.composition";

it.skip("renders with the correct text", () => {
  const { getByText } = render(<BasicScrimArea />);
  const rendered = getByText("hello world!");
  expect(rendered).toBeTruthy();
});
