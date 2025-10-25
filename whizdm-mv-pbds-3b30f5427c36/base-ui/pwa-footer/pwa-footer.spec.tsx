import React from "react";
import { render } from "@testing-library/react";
import { BasicPwaFooter } from "./pwa-footer.composition";

it.skip("renders with the correct text", () => {
  const { getByText } = render(<BasicPwaFooter />);
  const rendered = getByText("hello world!");
  expect(rendered).toBeTruthy();
});
