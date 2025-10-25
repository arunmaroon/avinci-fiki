import React from "react";
import { render } from "@testing-library/react";
import { BasicSelectDialog } from "./select-dialog.composition";

it("should render basic select dialog", () => {
  const { getByTestId } = render(<BasicSelectDialog />);
  const rendered = getByTestId("BasicSelectDialog");
  expect(rendered).toBeInTheDocument();
});
