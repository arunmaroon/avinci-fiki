import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  ErrorSnackbar,
  HideCloseErrorSnackbar,
  HideCloseInfoSnackbar,
  HideCloseSuccessSnackbar,
  HideCloseWarningSnackbar,
  InfoSnackbar,
  SuccessSnackbar,
  WarningSnackbar,
} from "./snackbar.composition";
import { cleanup } from "@testing-library/react";

/**
 * Following testcases are being checked:
 * - Check if error snackbar is rendered correctly wit.skiph error icon,closeicon
 *  and error background
 * - Checks if success snackbar is rendered correctly wit.skiph success icon,closeicon
 * and success background
 * - Checks if warning snackbar is rendered correctly wit.skiph warning icon,closeicon
 * and warning background
 * - Checks if info snackbar is rendered correctly wit.skiph info icon,closeicon
 * and info background
 * - Checks if error snackbar is rendered correctly wit.skiph error icon
 * and error background and no close icon
 * - Checks if info snackbar wit.skiph children is rendered correctly wit.skiph info icon
 * and info background and close icon
 */

afterEach(cleanup);
/**Checks if error snackbar is rendered correctly wit.skiph error icon,closeicon
 * and error background
 */
it("should check if the error snackbar is rendered correctly", () => {
  render(<ErrorSnackbar />);

  const textNode = screen.getByText("This is an error");
  expect(textNode).toBeInTheDocument();

  const erroIcon = screen.getByTestId("snackbarErrorIcon-svg");
  expect(erroIcon).toBeInTheDocument();

  const closeIcon = screen.getByTestId("closeIcon-svg");
  expect(closeIcon).toBeInTheDocument();

  const snackbarBody = screen.getByRole("alert");
  expect(snackbarBody.className).toMatch(/error/);
});

/**Checks if success snackbar is rendered correctly wit.skiph success icon,closeicon
 * and success background
 */
it("should check if the success snackbar is rendered correctly", () => {
  render(<SuccessSnackbar />);

  const textNode = screen.getByText(
    "This is a very long success message to demonstrate how long snack bar messages would look like on the UI"
  );
  expect(textNode).toBeInTheDocument();

  const erroIcon = screen.getByTestId("accordionSuccessCircledTickIcon-svg");
  expect(erroIcon).toBeInTheDocument();

  const closeIcon = screen.getByTestId("closeIcon-svg");
  expect(closeIcon).toBeInTheDocument();

  const snackbarBody = screen.getByRole("alert");
  expect(snackbarBody.className).toMatch(/success/);
});

/**Checks if warning snackbar is rendered correctly wit.skiph warning icon,closeicon
 * and warning background
 */
it("should check if the warning snackbar is rendered correctly", () => {
  render(<WarningSnackbar />);

  const textNode = screen.getByText("This is a warning");
  expect(textNode).toBeInTheDocument();

  const erroIcon = screen.getByTestId("snackbarErrorIcon-svg");
  expect(erroIcon).toBeInTheDocument();

  const closeIcon = screen.getByTestId("closeIcon-svg");
  expect(closeIcon).toBeInTheDocument();

  const snackbarBody = screen.getByRole("alert");
  expect(snackbarBody.className).toMatch(/warning/);
});

/**Checks if info snackbar is rendered correctly wit.skiph info icon,closeicon
 * and info background
 */
it("should check if the info snackbar is rendered correctly", () => {
  render(<InfoSnackbar />);

  const textNode = screen.getByText("This is an info");
  expect(textNode).toBeInTheDocument();

  const erroIcon = screen.getByTestId("infoIcon-svg");
  expect(erroIcon).toBeInTheDocument();

  const closeIcon = screen.getByTestId("closeIcon-svg");
  expect(closeIcon).toBeInTheDocument();

  const snackbarBody = screen.getByRole("alert");
  expect(snackbarBody.className).toMatch(/info/);
});

/**Checks if error snackbar is rendered correctly wit.skiph error icon
 * and error background and no close icon
 */
it("should check if the error snackbar is rendered correctly", () => {
  render(<HideCloseErrorSnackbar />);

  const textNode = screen.getByText("This is an error");
  expect(textNode).toBeInTheDocument();

  const erroIcon = screen.getByTestId("snackbarErrorIcon-svg");
  expect(erroIcon).toBeInTheDocument();

  const snackbarBody = screen.getByRole("alert");
  expect(snackbarBody.className).toMatch(/error/);
});

/**Checks if success snackbar is rendered correctly wit.skiph success icon
 * and success background and no close icon
 */
it("should check if the success snackbar is rendered correctly", () => {
  render(<HideCloseSuccessSnackbar />);

  const textNode = screen.getByText("This is a success");
  expect(textNode).toBeInTheDocument();

  const erroIcon = screen.getByTestId("accordionSuccessCircledTickIcon-svg");
  expect(erroIcon).toBeInTheDocument();

  const snackbarBody = screen.getByRole("alert");
  expect(snackbarBody.className).toMatch(/success/);
});

/**Checks if warning snackbar is rendered correctly wit.skiph warning icon
 * and warning background and no close icon
 */
it("should check if the warning snackbar is rendered correctly", () => {
  render(<HideCloseWarningSnackbar />);

  const textNode = screen.getByText("This is a warning");
  expect(textNode).toBeInTheDocument();

  const erroIcon = screen.getByTestId("snackbarErrorIcon-svg");
  expect(erroIcon).toBeInTheDocument();

  const snackbarBody = screen.getByRole("alert");
  expect(snackbarBody.className).toMatch(/warning/);
});

/**Checks if info snackbar is rendered correctly wit.skiph info icon
 * and info background and no close icon
 */
it("should check if the info snackbar is rendered correctly", () => {
  render(<HideCloseInfoSnackbar />);

  const textNode = screen.getByText("This is an info");
  expect(textNode).toBeInTheDocument();

  const erroIcon = screen.getByTestId("infoIcon-svg");
  expect(erroIcon).toBeInTheDocument();

  const snackbarBody = screen.getByRole("alert");
  expect(snackbarBody.className).toMatch(/info/);
});
