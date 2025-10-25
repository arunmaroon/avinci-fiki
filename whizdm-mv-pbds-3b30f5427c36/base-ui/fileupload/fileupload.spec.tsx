import React from "react";
import { render } from "@testing-library/react";
import { BasicFileupload } from "./fileupload.composition";

it("should render with the correct id", () => {
  const { getByTestId } = render(<BasicFileupload />);
  const rendered = getByTestId("upload");
  expect(rendered).toBeTruthy();
});
