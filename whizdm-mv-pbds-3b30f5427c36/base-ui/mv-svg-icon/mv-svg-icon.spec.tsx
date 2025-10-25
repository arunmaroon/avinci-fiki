import React from "react";
import { render } from "@testing-library/react";
import { BasicMvSvgIcon } from "./mv-svg-icon.composition";

test("renders BasicMvSvgIcon component", () => {
  const { container } = render(<BasicMvSvgIcon />);
  const iconElement = container.querySelector("svg");

  expect(iconElement).toBeInTheDocument();
});
