import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { TypographyVariants } from "@mvloans/base-ui.common";
import {
  InteractivePlanSelectorCard,
  SelectedPlanSelectorCard,
  UnselectedPlanSelectorCard,
  PlanSelectorCardWithoutDisplayCount,
} from "./plan-selector.composition";

it("should render a unselected card", async () => {
  const { getByTestId } = render(<InteractivePlanSelectorCard />);
  const rendered = getByTestId("InteractivePlanSelectorCard");

  expect(rendered).toBeTruthy();

  const toSelectCard = getByTestId("abcd");
  const selectedCardParagraph = toSelectCard.getElementsByTagName("p")[0];
  expect(selectedCardParagraph.classList.toString().includes(TypographyVariants.bodyLargeLowEmphasis)).toBe(true);

  await waitFor(() => fireEvent.click(toSelectCard));
  expect(selectedCardParagraph.classList.toString().includes(TypographyVariants.bodyLargeHighEmphasis)).toBe(true);
});

it("should render a unselected card and select card with given id", async () => {
  const { getByTestId } = render(<UnselectedPlanSelectorCard />);

  const toSelectCard = getByTestId("abcd");
  const firstCardParagraph = toSelectCard.getElementsByTagName("p")[0];
  console.log(firstCardParagraph.classList);
  expect(firstCardParagraph.classList.toString().includes(TypographyVariants.bodyLargeLowEmphasis)).toBe(true);

  await waitFor(() => fireEvent.click(toSelectCard));
  expect(firstCardParagraph.classList.toString().includes(TypographyVariants.bodyLargeHighEmphasis)).toBe(true);
});

it("should render a selected card, then click on card with given id", async () => {
  const { getByTestId } = render(<SelectedPlanSelectorCard />);

  const selectedCard = getByTestId("abcd");
  const selectedCardParagraph = selectedCard.getElementsByTagName("p")[0];
  expect(selectedCardParagraph.classList.toString().includes(TypographyVariants.bodyLargeHighEmphasis)).toBe(true);

  const toSelectCard = getByTestId("efgh");

  const toSelectCardParagraph = toSelectCard.getElementsByTagName("p")[0];
  expect(toSelectCardParagraph.classList.toString().includes(TypographyVariants.bodyLargeLowEmphasis)).toBe(true);
  await waitFor(() => fireEvent.click(toSelectCard));
  expect(toSelectCardParagraph.classList.toString().includes(TypographyVariants.bodyLargeHighEmphasis)).toBe(true);
  expect(selectedCardParagraph.classList.toString().includes(TypographyVariants.bodyLargeLowEmphasis)).toBe(true);
});

it("should render plan selector card with 'see 3 more' text", async () => {
  const { getByText } = render(<PlanSelectorCardWithoutDisplayCount />);

  const bottomText = getByText("See 3 more");
  expect(bottomText).toBeTruthy();
});
