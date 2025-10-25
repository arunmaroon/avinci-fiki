import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BasicSlider } from "./slider.composition";

const onChange = jest.fn(() => {
  console.log("here:");
});

const getBoundingClientRect = jest.fn(() => {
  return {
    bottom: 10,
    height: 10,
    left: 0,
    right: 100,
    top: 0,
    width: 100,
    x: 0,
    y: 0,
    toJSON: jest.fn(() => {}),
  };
});

it("should render the slider and response to slider clicks", () => {
  const { container } = render(<BasicSlider onChange={onChange} />);
  const rendered = screen.getByTestId("Basic");
  expect(rendered).toBeTruthy();
  // const iconElement = container.querySelector("svg");
  // expect(iconElement).toBeInTheDocument();
  let slider = screen.getByRole("slider");
  fireEvent.change(slider, { target: { value: 100 } });
  expect(onChange).toHaveBeenCalled();
  slider = screen.getByRole("slider");
  expect(slider).toHaveValue("100");
});

it("should render the labels", () => {
  render(<BasicSlider />);
  const rendered = screen.getByText("Min ₹10,000");
  expect(rendered).toBeTruthy();
  const renderedMax = screen.getByText("Max ₹90,000");
  expect(renderedMax).toBeTruthy();
});

it("should call the onChange on thumb value change", async () => {
  const { getByTestId } = render(<BasicSlider />);
  const rendered = getByTestId("Basic");
  rendered.getBoundingClientRect = getBoundingClientRect;
  expect(rendered).toBeInTheDocument();
  await waitFor(() => fireEvent.mouseDown(rendered, { clientX: 100, clientY: 10 }));
  expect(rendered.getBoundingClientRect).toBeCalledTimes(1);
});

it.skip("should change the focus to slider on thumb value change", async () => {
  const { getByTestId, getByRole } = render(<BasicSlider />);
  const rendered = getByTestId("Basic");
  const renderedInput = getByRole("slider");
  rendered.getBoundingClientRect = getBoundingClientRect;
  expect(renderedInput).not.toHaveFocus();
  await waitFor(() => fireEvent.mouseDown(rendered, { clientX: 100, clientY: 10 }));
  expect(renderedInput).toHaveFocus();
});
