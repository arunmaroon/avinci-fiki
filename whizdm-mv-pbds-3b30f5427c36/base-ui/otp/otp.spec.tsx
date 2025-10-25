import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BasicOtp, OtpWithFiveInputs, OtpWithSixInputs, OtpWithSixInputsWithError } from "./otp.composition";
import { act } from "react-dom/test-utils";

beforeEach(cleanup);

it("should render Basic Otp component", () => {
  render(<BasicOtp />);
  const otpContaineComponent = screen.getByTestId("basic");
  expect(otpContaineComponent).toBeVisible();
  const inputs = screen.getAllByRole("textbox");
  expect(inputs).toHaveLength(4);
  // enter first otp value
  act(() => {
    fireEvent.change(inputs[0], { target: { value: 4 } });
  });
  let updatedInputs = screen.getAllByRole("textbox");
  expect(updatedInputs[0]).toHaveValue("4");
  expect(updatedInputs[1]).toHaveFocus();
  expect(updatedInputs[0]).not.toHaveFocus();
  // enter second otp value
  act(() => {
    fireEvent.change(updatedInputs[1], { target: { value: 3 } });
  });
  updatedInputs = screen.getAllByRole("textbox");
  expect(updatedInputs[1]).toHaveValue("3");
  expect(updatedInputs[2]).toHaveFocus();
  expect(updatedInputs[1]).not.toHaveFocus();
  // enter third otp value
  act(() => {
    fireEvent.change(updatedInputs[2], { target: { value: 2 } });
  });
  updatedInputs = screen.getAllByRole("textbox");
  expect(updatedInputs[2]).toHaveValue("2");
  expect(updatedInputs[3]).toHaveFocus();
  expect(updatedInputs[2]).not.toHaveFocus();
  // enter 4th otp value
  act(() => {
    fireEvent.change(updatedInputs[2], { target: { value: 1 } });
  });
  updatedInputs = screen.getAllByRole("textbox");
  expect(updatedInputs[3]).toHaveValue("1");
  expect(updatedInputs[3]).toHaveFocus();
  expect(updatedInputs[2]).not.toHaveFocus();
  // back arrow press
  act(() => {
    fireEvent.keyDown(updatedInputs[3], { keyCode: 37 });
  });
  updatedInputs = screen.getAllByRole("textbox");
  expect(updatedInputs[3]).toHaveValue("1");
  expect(updatedInputs[3]).not.toHaveFocus();
  expect(updatedInputs[2]).toHaveFocus();
  // update corrent value after back arrow press
  act(() => {
    fireEvent.change(updatedInputs[2], { target: { value: 5 } });
  });
  updatedInputs = screen.getAllByRole("textbox");
  expect(updatedInputs[2]).toHaveValue("5");
  expect(updatedInputs[2]).not.toHaveFocus();
  expect(updatedInputs[3]).toHaveFocus();
  // back space press
  act(() => {
    fireEvent.keyDown(updatedInputs[3], { keyCode: 8 });
  });
  updatedInputs = screen.getAllByRole("textbox");
  expect(updatedInputs[3]).toHaveValue("");
  expect(updatedInputs[3]).not.toHaveFocus();
  expect(updatedInputs[2]).toHaveFocus();
  // right arrow press
  act(() => {
    fireEvent.keyDown(updatedInputs[2], { keyCode: 39 });
  });
  updatedInputs = screen.getAllByRole("textbox");
  expect(updatedInputs[2]).toHaveValue("5");
  expect(updatedInputs[2]).not.toHaveFocus();
  expect(updatedInputs[3]).toHaveFocus();
});

it("should render Otp with Five inputs component", () => {
  render(<OtpWithFiveInputs />);
  const otpContaineComponent = screen.getByTestId("otpWithFiveInputs");
  expect(otpContaineComponent).toBeVisible();
  const inputs = screen.getAllByRole("textbox");
  expect(inputs).toHaveLength(5);
});

it("should render Otp with Six inputs component", () => {
  render(<OtpWithSixInputs />);
  const otpContaineComponent = screen.getByTestId("otpWithSixInputs");
  expect(otpContaineComponent).toBeVisible();
  const inputs = screen.getAllByRole("textbox");
  expect(inputs).toHaveLength(6);
});

it("should render Otp with Six inputs and with Error", () => {
  render(<OtpWithSixInputsWithError />);
  const otpContaineComponent = screen.getByTestId("otpWithSixInputsWithError");
  expect(otpContaineComponent).toBeVisible();
  const inputs = screen.getAllByRole("textbox");
  expect(inputs).toHaveLength(6);
  const errorText = screen.getByText("Please enter valid otp");
  expect(errorText).toBeVisible();
});
