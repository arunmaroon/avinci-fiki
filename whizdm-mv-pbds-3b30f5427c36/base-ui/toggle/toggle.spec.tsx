import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BasicToggle, DisabledToggleWhenChecked } from "./toggle.composition";

it("renders on switch correctly", () => {
  render(<BasicToggle />);

  const switchElement = screen.getByRole("checkbox");
  expect(switchElement).toBeChecked();
});

it("should toggle switch state on click", () => {
  render(<BasicToggle />);

  const switchElement = screen.getByRole("checkbox");
  // Click on the switch to toggle its state
  fireEvent.click(switchElement);

  // Assert the updated state
  expect(switchElement).not.toBeChecked();
});

it("should be in disabled state when disabled prop passesd", () => {
  render(<DisabledToggleWhenChecked />);

  const switchElement = screen.getByRole("checkbox");
  expect(switchElement).toBeDisabled();
});
