import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BasicGroupCheckbox, BasicGroupCheckboxWithError } from "./grouped-checkbox.composition";

it("should render BasicGroupCheckbox with the correct text", () => {
  const { getByText } = render(<BasicGroupCheckbox />);
  const rendered = getByText("Choose communication preferences");
  expect(rendered).toBeVisible();

  const sms = getByText("SMS");
  expect(sms).toBeVisible();

  const email = getByText("Email");
  expect(email).toBeVisible();

  const whatsapp = getByText("Whatsapp");
  expect(whatsapp).toBeVisible();
});

it.skip("should select checkbox on click", async () => {
  const { getByText } = render(<BasicGroupCheckbox />);
  const whatsapp = getByText("Whatsapp");
  expect(whatsapp).toBeVisible();

  await waitFor(() => fireEvent.click(whatsapp));
  expect(screen.getByAltText("ic-checkbox-selected-v2")).toBeVisible();

  await waitFor(() => fireEvent.click(whatsapp));
  expect(screen.queryByAltText("ic-checkbox-selected-v2")).not.toBeInTheDocument();
});

it("should render BasicGroupCheckboxWithError with the correct text", () => {
  const { getByText } = render(<BasicGroupCheckboxWithError />);

  const errorText = getByText("Select one preference");
  expect(errorText).toBeVisible();
});
