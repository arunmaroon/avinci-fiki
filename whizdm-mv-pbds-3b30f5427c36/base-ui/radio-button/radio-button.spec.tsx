import React from "react";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import {
  BasicRadioButton,
  BasicRadioButtonInRow,
  DisabledRadioButton,
  RadioButtonWithPrefixIconWithError,
  RadioButtonWithPrefixIconWithoutError,
  RadioButtonWithChildren,
} from "./radio-button.composition";

afterEach(cleanup);
/**
 * Here are all the test scenarios that have been addressed:
 * - Should render radio button successfully
 * - Should render radio button with default value as male if it is passes as default value
 * - Should change checked radio option on click
 * - Show radio buttons in disabled mode if disabled prop is passed
 * - Render radio butons in row mode if row prop passed as true
 * - Should render radio button with prefix icon without error successfully
 * - Should render radio button with prefix icon with error successfully
 * - Should show prefix icon in selected mode if corresponding option selected
 */

it("should render radio button successfully", () => {
  render(<BasicRadioButton />);
  const rendered = screen.getByTestId("basic-radio-button");
  expect(rendered).toBeTruthy();
  expect(screen.getByText("Male")).toBeInTheDocument();
  expect(screen.getByText("Female")).toBeInTheDocument();
});

it("should show default value as female", () => {
  render(<BasicRadioButton />);

  const rendered = screen.getByTestId("basic-radio-button").querySelector('input[type="radio"]');

  expect(rendered).toHaveAttribute("value", "female");
});

it("should change checked option on click", () => {
  render(<BasicRadioButton />);

  const maleRadioBtn = screen.getByLabelText("Male");
  fireEvent.click(maleRadioBtn);
  expect(maleRadioBtn).toBeChecked();

  const femaleRadioBtn = screen.getByLabelText("Female");
  fireEvent.click(femaleRadioBtn);
  expect(femaleRadioBtn).toBeChecked();
  expect(maleRadioBtn).not.toBeChecked();
});

it("show radio buttons in disabled if disabled passed", () => {
  render(<DisabledRadioButton />);
  const maleRadioBtn = screen.getByLabelText("Male");
  const femaleRadioBtn = screen.getByLabelText("Female");
  expect(maleRadioBtn).toBeDisabled();
  expect(femaleRadioBtn).toBeDisabled();
});

it("should not allow click in disabled mode", () => {
  render(<DisabledRadioButton />);
  const rendered = screen.getByTestId("basic-radio-button").querySelector('input[type="radio"]');
  const maleRadioBtn = screen.getByLabelText("Male");
  const femaleRadioBtn = screen.getByLabelText("Female");
  expect(maleRadioBtn).toBeDisabled();
  expect(femaleRadioBtn).toBeDisabled();

  fireEvent.click(maleRadioBtn);
  expect(maleRadioBtn).toBeDisabled();
  expect(rendered).not.toHaveAttribute("value", "male");
});

it("should render radio button in row mode if row prop passes", () => {
  render(<BasicRadioButtonInRow />);
  const rendered = screen.getByTestId("basic-radio-button");
  expect(rendered).toHaveClass("MuiFormGroup-row");
});

it("should render radio button with prefix icon without error", () => {
  render(<RadioButtonWithPrefixIconWithoutError />);
  const rendered = screen.getByTestId("radio-with-prefix-icon");
  expect(rendered).toBeTruthy();

  expect(screen.getByText("Salaried")).toBeInTheDocument();
  expect(screen.getByText("Self-employed")).toBeInTheDocument();

  expect(screen.queryByText("Error message")).toBeNull();
});

it("should render radio button with prefix icon with error", () => {
  render(<RadioButtonWithPrefixIconWithError />);
  const rendered = screen.getByTestId("radio-with-prefix-icon");
  expect(rendered).toBeTruthy();

  expect(screen.getByText("Salaried")).toBeInTheDocument();
  expect(screen.getByText("Self-employed")).toBeInTheDocument();

  expect(screen.queryByText("Error message")).not.toBeNull();
});

it("should select prefix icon if option selected", () => {
  const { container } = render(<RadioButtonWithPrefixIconWithoutError />);
  const rendered = screen.getByTestId("radio-with-prefix-icon");

  expect(rendered).toBeTruthy();

  const salariedRadioBtn = screen.getByDisplayValue("salaried");

  fireEvent.click(salariedRadioBtn);
  expect(salariedRadioBtn).toBeChecked();

  const iconElement = container.querySelector("svg");

  expect(iconElement).toBeInTheDocument();

  // const prefixIcon = screen.getByAltText("ic-radio-salaried-selected");
  // expect(prefixIcon).toBeTruthy();
  // expect(prefixIcon.className).toMatch(/selectedWithPrefixIconClass$/);

  // const prefixIconForSelfEmployed = screen.getByAltText("ic-radio-self-employed-selected");
  // expect(prefixIconForSelfEmployed.className).not.toMatch(/selectedWithPrefixIconClass$/);
});

describe("RadioButton with children", () => {
  it("should render radio button with children options", () => {
    render(<RadioButtonWithChildren />);
    const rendered = screen.getByTestId("radio-with-children");
    expect(rendered).toBeTruthy();
    expect(screen.getByText("My family members are earning")).toBeInTheDocument();
    expect(screen.getByText("My family members are not earning")).toBeInTheDocument();
  });

  it("should not show children content when option is not selected", () => {
    render(<RadioButtonWithChildren />);
    expect(screen.queryByTestId("member-form")).not.toBeInTheDocument();
  });

  it("should show children content when earning option is selected", async () => {
    render(<RadioButtonWithChildren />);

    // Find and click the earning option using the FormControlLabel
    const earningRadio = screen.getByRole("radio", { name: /my family members are earning/i });
    fireEvent.click(earningRadio);

    // Check if children content is displayed
    const memberForm = screen.getByTestId("member-form");
    expect(memberForm).toBeInTheDocument();

    // Check for form inputs using more specific queries
    expect(screen.getByRole("combobox", { name: /relation/i })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /income source/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add members/i })).toBeInTheDocument();
  });

  it("should hide children content when switching to not-earning option", () => {
    render(<RadioButtonWithChildren />);

    // First select earning option
    const earningRadio = screen.getByRole("radio", { name: /my family members are earning/i });
    fireEvent.click(earningRadio);
    expect(screen.getByTestId("member-form")).toBeInTheDocument();

    // Then select not-earning option
    const notEarningRadio = screen.getByRole("radio", { name: /my family members are not earning/i });
    fireEvent.click(notEarningRadio);
    expect(screen.queryByTestId("member-form")).not.toBeInTheDocument();
  });
});
