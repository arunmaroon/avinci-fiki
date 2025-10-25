import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { SearchTextField } from "./autocomplete.composition";

it("should render the Autocomplete", () => {
  render(<SearchTextField />);
  const rendered = screen.getByTestId("Basic");
  expect(rendered).toBeTruthy();
});

it("should render with the Autocomplete options list", async () => {
  render(<SearchTextField />);
  const rendered = screen.getByTestId("Basic");
  const input = within(rendered).getByRole("combobox");
  rendered.focus();
  await waitFor(() => fireEvent.change(input, { target: { value: "y" } }));
  await waitFor(() => fireEvent.keyDown(rendered, { key: "ArrowDown" }));
  await waitFor(() => fireEvent.keyDown(rendered, { key: "Enter" }));
  expect(input).toHaveValue("Yes Bank");
});

it("should render with the Autocomplete Group", async () => {
  render(<SearchTextField />);
  const rendered = screen.getByTestId("Basic");
  rendered.focus();
  const input = within(rendered).getByRole("combobox");
  await waitFor(() => fireEvent.change(input, { target: { value: "y" } }));
  const rendered1 = screen.getByText("Popular banks");
  expect(rendered1).toBeTruthy();
});
