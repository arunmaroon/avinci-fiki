import React from "react";
import { render } from "@testing-library/react";
import { BasicBoundary } from "./boundary.composition";
import { Boundary } from "./boundary";

const child = <h1> hello world! </h1>;
it("should render with the correct text", () => {
  const { getByText } = render(<BasicBoundary />);
  const rendered = getByText("hello world!");
  expect(rendered).toBeTruthy();
});

it("should render with the children correct text", () => {
  const { getByText } = render(<Boundary> {child}</Boundary>);
  const rendered = getByText("hello world!");
  expect(rendered).toBeTruthy();
});
