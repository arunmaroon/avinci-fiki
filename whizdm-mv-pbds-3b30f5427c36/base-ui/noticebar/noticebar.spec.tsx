import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { DefaultNoticebar, ErrorNoticebar, ErrorNoticebarWithTitleDescription } from "./noticebar.composition";
import { iconTypes } from "./constants";

/**Checks if error noticebar is rendered correctly with error icon,closeicon
 * and error background
 */
afterEach(cleanup);
it("should check if the error snackbar is rendered correctly", () => {
  render(<ErrorNoticebar />);

  const textNode = screen.getByText("Message");
  expect(textNode).toBeVisible();

  const noticeBody = screen.getByRole("alert");
  expect(noticeBody.className).toMatch(/error/);

  const leadingIcon = screen.getByTestId(`leadingIcon-${iconTypes.ERROR}`);
  expect(leadingIcon).toBeVisible();
});

it("should check if the error noticebar is rendered correctly with title and description", () => {
  render(<ErrorNoticebarWithTitleDescription />);

  const textNode = screen.getByText("Title");
  expect(textNode).toBeVisible();

  const desc = screen.getByText("Description");
  expect(desc).toBeVisible();

  const noticeBody = screen.getByRole("alert");
  expect(noticeBody.className).toMatch(/error/);

  const leadingIcon = screen.getByTestId(`leadingIcon-${iconTypes.ERROR}`);
  expect(leadingIcon).toBeVisible();
});

it("should render success snackbar when iconType not passed", () => {
  render(<DefaultNoticebar />);
  const text = screen.getByText("This is a success snackbar");
  expect(text).toBeVisible();

  const leadingIcon = screen.getByTestId(`leadingIcon-${iconTypes.SUCCESS}`);
  expect(leadingIcon).toBeVisible();

  const noticeBody = screen.getByRole("alert");
  expect(noticeBody.className).toMatch(/success/);
});
