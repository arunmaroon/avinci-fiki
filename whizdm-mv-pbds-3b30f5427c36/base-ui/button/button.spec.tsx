import React from "react";

import { render } from "@testing-library/react";

import {
  PrimaryButtonWithIconOnLeft,
  SupportPrimaryButton,
  SupportSecondaryButton,
  DangerButton,
  LinkButton,
  DisabledButton,
  LoadingButton,
  SkeletonButton,
} from "./button.composition";

it("should render primary button with icon", () => {
  const { getByTestId } = render(<PrimaryButtonWithIconOnLeft />);
  const rendered = getByTestId("PrimaryWithIcon");
  expect(rendered).not.toHaveAttribute("disabled");
});

it("should render support primary button with icon", () => {
  const { getByTestId } = render(<SupportPrimaryButton />);
  const rendered = getByTestId("SupportPrimaryWithIcon");
  expect(rendered).not.toHaveAttribute("disabled");
});

it("should render support secondary button with icon", () => {
  const { getByTestId } = render(<SupportSecondaryButton />);
  const rendered = getByTestId("SupportSecondaryWithIcon");
  expect(rendered).not.toHaveAttribute("disabled");
});

it("should render danger button with icon", () => {
  const { getByTestId } = render(<DangerButton />);
  const rendered = getByTestId("DangerButtonWithIcon");
  expect(rendered).not.toHaveAttribute("disabled");
});

it("should render link button with icon", () => {
  const { getByTestId } = render(<LinkButton />);
  const rendered = getByTestId("LinkButtonWithIcon");
  expect(rendered).not.toHaveAttribute("disabled");
});

it("should render disabled button with icon", () => {
  const { getByTestId } = render(<DisabledButton />);
  const rendered = getByTestId("DisabledButtonWithIcon");
  expect(rendered).toHaveAttribute("disabled");
});

it("should render loading button", () => {
  const { getByTestId } = render(<LoadingButton />);
  const rendered = getByTestId("LoadingButton");
  expect(rendered).toHaveAttribute("disabled");
});

it("should render skeleton button", () => {
  const { getByTestId } = render(<SkeletonButton />);
  const rendered = getByTestId("SkeletonButton");
  expect(rendered).not.toHaveAttribute("disabled");
});
