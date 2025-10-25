import React from "react";
import { render } from "@testing-library/react";
import {
  BasicConfigCard,
  CompletedConfigCard,
  DisabledConfigCard,
  IncompleteConfigCard,
  InProgressConfigCard,
  LoadingConfigCard,
  PendingConfigCard,
  ResubmitConfigCard,
} from "./config-card.composition";
import { colorType } from "./constants";

it("should render stepper", () => {
  const rendered = render(<BasicConfigCard />);
  expect(rendered).not.toBeNull();
});
it("should have the correct title and description", () => {
  const { getByText } = render(<BasicConfigCard />);
  const title = getByText("Loan Application");
  expect(title).toBeTruthy();
  const description = getByText("Continue your loan application to get a loan offer in few minutes");
  expect(description).toBeTruthy();
});
it("should have the correct button label", () => {
  const { getByRole } = render(<BasicConfigCard />);
  const buttonLabel = getByRole("button", { name: /Continue/i });
  expect(buttonLabel).toBeTruthy();
});
it("should have the correct Incomplete chip text", () => {
  const { getByText } = render(<IncompleteConfigCard />);
  const incompleteChip = getByText("Incomplete");
  expect(incompleteChip).toBeTruthy();
});
it("should have the correct In progress chip text", () => {
  const { getByText } = render(<InProgressConfigCard />);
  const inprogressChip = getByText("In progress");
  expect(inprogressChip).toBeTruthy();
});
it("should have the correct Pending chip text", () => {
  const { getByText } = render(<PendingConfigCard />);
  const pendingChip = getByText("Pending");
  expect(pendingChip).toBeTruthy();
});
// TODO: fix test cases
// it("should have the correct In progress chip text", () => {
//   const { getByText } = render(<ResubmitConfigCard />);
//   const resubmitChip = getByText("Resubmit");
//   expect(resubmitChip).toBeTruthy();
// });
// it("should render loading config card with loading icon", async () => {
//   const { getAllByRole } = render(<LoadingConfigCard />);
//   const rendered = getAllByRole("progressbar");
//   expect(rendered).toBeTruthy();
// });
it("should render the correct active border", async () => {
  const { getByTestId } = render(<BasicConfigCard />);
  const basicConfigCard = getByTestId("basicConfigCard");
  expect(basicConfigCard.classList.toString().includes(colorType.loadingBorderColor)).toBe(true);
});
it("should render the correct completed border", async () => {
  const { getByTestId } = render(<CompletedConfigCard />);
  const completedConfigCard = getByTestId("completedConfigCard");
  expect(completedConfigCard.classList.toString().includes(colorType.completedBorderColor)).toBe(true);
});
it("should render the correct error border", async () => {
  const { getByTestId } = render(<PendingConfigCard />);
  const errorConfigCard = getByTestId("errorConfigCard");
  expect(errorConfigCard.classList.toString().includes(colorType.errorBorderColor)).toBe(true);
});
it("should render the correct disabled border", async () => {
  const { getByTestId } = render(<DisabledConfigCard />);
  const disabledConfigCard = getByTestId("disabledConfigCard");
  expect(disabledConfigCard.classList.toString().includes(colorType.disabledBorderColor)).toBe(true);
});
