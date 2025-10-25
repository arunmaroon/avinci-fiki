import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { BasicAlertCard, BasicAlertCardWithImage } from "./alert-card.composition";

it("renders basic alert card", () => {
  render(<BasicAlertCard />);
  const button = screen.getByRole("button", { name: "Click To Open" });
  fireEvent.click(button);
  const dialog = screen.getByRole("dialog");
  expect(dialog).toBeVisible();
  const title = screen.getByText("Title");
  expect(title).toBeVisible();
});

it("should close alert card dialog on close icon click", () => {
  render(<BasicAlertCard />);
  const button = screen.getByRole("button", { name: "Click To Open" });
  fireEvent.click(button);
  const dialog = screen.getByRole("dialog");
  expect(dialog).toBeVisible();

  const closeIcon = screen.getByTestId("closeIcon-svg");
  expect(closeIcon).toBeVisible();
  fireEvent.click(closeIcon);
  const alert = screen.queryByRole("dialog");
  expect(alert).not.toBeVisible();
});

it("should render alert card with image", () => {
  render(<BasicAlertCardWithImage />);
  const button = screen.getByRole("button", { name: "Click To Open" });
  fireEvent.click(button);
  const dialog = screen.getByRole("dialog");
  expect(dialog).toBeVisible();

  const image = screen.getByAltText("ic-image-placeholder");
  expect(image).toBeVisible();
  const title = screen.getByText("Title");
  expect(title).toBeVisible();
});
