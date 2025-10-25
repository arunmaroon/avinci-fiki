import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { BasicChipContainerWithError, BasicChipContainerWithoutError } from "./chip-container.composition";

it.skip("should render BasicChipContainerWithoutError with the correct text", () => {
  const { getByText } = render(<BasicChipContainerWithoutError />);
  const rendered = getByText("Gender");
  expect(rendered).toBeVisible();

  const male = getByText("Male");
  expect(male).toBeVisible();

  const female = getByText("Female");
  expect(female).toBeVisible();

  const other = getByText("Other");
  expect(other).toBeVisible();
});

it.skip("should select chip on click", async () => {
  const { getByText } = render(<BasicChipContainerWithoutError />);
  const male = getByText("Male");
  expect(male).toBeVisible();

  await waitFor(() => fireEvent.click(male));
  expect(screen.getByTestId("chipTickIcon-svg")).toBeVisible();
});

it("should render BasicChipContainerWithoutError with the correct text", () => {
  const { getByText } = render(<BasicChipContainerWithError />);
  const rendered = getByText("Gender");
  expect(rendered).toBeVisible();

  const male = getByText("Male");
  expect(male).toBeVisible();

  const female = getByText("Female");
  expect(female).toBeVisible();

  const other = getByText("Other");
  expect(other).toBeVisible();

  const erroText = getByText("Please choose one of the following options");
  expect(erroText).toBeVisible();
});
