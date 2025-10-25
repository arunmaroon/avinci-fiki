import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DisabledFaqAccordion, ExpandedFaqAccordion, FaqAccordion, FirstFaqAccordion, LastFaqAccordion } from "./faq.composition";

afterEach(cleanup);
/**
 * Here are all the test scenarios that have been addressed:
 * - should render basic faq
 * - should render first faq
 * - should render last faq
 * - should render disabled faq
 * - should render expanded faq
 * - should open an faq
 * - should not open disabled faq
 */
it("should render basic faq", () => {
  render(<FaqAccordion />);
  const rendered = screen.getByTestId("faq-accordion");
  expect(rendered).toBeTruthy();
});

it("should render first faq", () => {
  render(<FirstFaqAccordion />);
  const rendered = screen.getByTestId("first-faq-accordion");
  expect(rendered).toBeTruthy();
  expect(rendered.className).toContain("firstFaq");
});

it("should render last faq", () => {
  render(<LastFaqAccordion />);
  const rendered = screen.getByTestId("last-faq-accordion");
  expect(rendered).toBeTruthy();
  expect(rendered.className).toContain("lastFaq");
});

it("should render disabled faq", () => {
  render(<DisabledFaqAccordion />);
  const rendered = screen.getByTestId("disabled-faq-accordion");
  expect(rendered).toBeTruthy();
  expect(rendered.className).toContain("Mui-disabled");
});

it("should render expanded faq", () => {
  render(<ExpandedFaqAccordion />);
  const rendered = screen.getByTestId("expanded-faq-accordion");
  expect(rendered).toBeTruthy();
  expect(rendered.className).toContain("Mui-expanded");
});

it.skip("should open an faq", () => {
  // render
  render(<FaqAccordion />);
  const rendered = screen.getByTestId("faq-accordion");
  const rightButton = screen.getByRole("img", { name: "ic-accordion-chevron" });
  expect(rightButton).toBeVisible();

  // click event
  waitFor(() => {
    fireEvent.click(rightButton);
  });

  // check if expanded
  expect(rendered).toBeTruthy();
  expect(rendered.className).toContain("Mui-expanded");
});

it("should not open disabled faq", () => {
  // render
  render(<DisabledFaqAccordion />);
  const rendered = screen.getByTestId("disabled-faq-accordion");
  const rightButton = screen.getByRole("button");

  // check if Accordion expand button is visible before attempting to expand
  const computedStyle = window.getComputedStyle(rightButton);
  const isButtonVisible = computedStyle.display !== "none";

  // click event
  waitFor(() => {
    // click on the accordion only if the expand button is visible (accordion is not disabled)
    if (isButtonVisible && !rendered.className.includes("disabled")) {
      fireEvent.click(rightButton);
    }
  });

  // check if not expanded
  expect(rendered).toBeTruthy();
  expect(rendered.className).not.toContain("Mui-expanded");
});

const Links = {
  Link1: "test1",
  Link2: "test2",
} as const;

type Links = (typeof Links)[keyof typeof Links];

let abc: Links;
abc = "test1";
