import React from "react";

import { cleanup, fireEvent, getByAltText, queryAllByAltText, render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { pothosTokens } from "@mvloans/base-ui.tokens";
import { IconNames } from "@mvloans/base-ui.mv-svg-icon";

import {
  BasicChip,
  SelectedChipWhenMultiCheck,
  SelectedChipWhenMultiCheckDisabled,
  SelectedChipWithDelete,
  SelectedChipWithIcon,
} from "./chip.composition";
import { Chip } from "./chip";

const { chip } = pothosTokens;
afterEach(cleanup);

/**
 * Here are all the test scenarios that have been addressed:
 * - Should render chip with correct text successfully
 * - Should render chip in unselected mode successfully
 * - Should render selected chip when multi check enabled successfully
 * - Should render selected chip when multi check disabled successfully
 * - Should render Selected chip with delete option enabled successfully
 * - Should be able to click chip
 */
it("should render with the correct text", () => {
  const { getByText } = render(<BasicChip />);
  const rendered = getByText("Item name");
  expect(rendered).toBeTruthy();
});

it("should render unselected chip", () => {
  const { getByText } = render(<BasicChip />);
  const rendered = screen.getByTestId("basic-chip");
  expect(rendered).toBeTruthy();

  const label = getByText("Item name");

  expect(label.className).toContain(chip.text.typography);
});

it("should render selected chip when multi check", () => {
  const { getByText } = render(<SelectedChipWhenMultiCheck />);
  const rendered = screen.getByTestId("selected-multicheck-chip");
  expect(rendered).toBeTruthy();

  const label = getByText("Item name");
  expect(label).toBeInTheDocument();
  expect(label.className).toContain(chip.selected.text.typography);

  const tick = screen.getByTestId(`${IconNames.chipTickIcon}-svg`);
  expect(tick).toBeVisible();
});

it("should render selected chip when multi check disabled", () => {
  const { getByText } = render(<SelectedChipWhenMultiCheckDisabled />);
  const rendered = screen.getByTestId("selected-multicheck-disabled-chip");
  expect(rendered).toBeTruthy();

  const label = getByText("Item name");
  expect(label).toBeInTheDocument();
  expect(label.className).toContain(chip.selected.text.typography);

  const tickIcon = screen.queryByTestId(`${IconNames.chipTickIcon}-svg`);
  expect(tickIcon).toBeNull();
});

it("should render Selected chip with delete", () => {
  const { container, getByText } = render(<SelectedChipWithDelete />);
  const rendered = screen.getByTestId("selected-chip-delete");
  expect(rendered).toBeTruthy();

  const label = getByText("Item name");
  expect(label).toBeInTheDocument();
  expect(label.className).toContain(chip.selected.text.typography);

  const deleteIcon = container.querySelector(".MuiChip-deleteIcon");
  expect(deleteIcon).toBeVisible();
});

it("should render Selected chip with icon", () => {
  const { getByText } = render(<SelectedChipWithIcon />);
  const rendered = screen.getByTestId("selected-chip-with-icon");
  expect(rendered).toBeTruthy();

  const label = getByText("Item name");
  expect(label).toBeInTheDocument();
  expect(label.className).toContain(chip.selected.text.typography);

  const customIcon = screen.getByTestId(`${IconNames.badgeIcon}-svg`);
  expect(customIcon).toBeVisible();
});

it("should render Skeleton for the chip, if isSkeleton is passed as true", () => {
  render(
    <ThemeProvider>
      <Chip
        label="Item name"
        dataTestId="selected-chip-with-icon"
        variant="outlined"
        type="selectedMultipleWithCustomIcon"
        selected={true}
        iconName={IconNames.badgeIcon}
        isSkeleton={true}
        value={"item"}
      />
    </ThemeProvider>
  );

  const label = screen.queryByText("Item name");
  expect(label).toBeNull();
});

it("Should be able to click chip", () => {
  const onClick = jest.fn();
  const { getByText } = render(
    <ThemeProvider>
      <Chip
        label="Item name"
        dataTestId="basic-chip"
        variant="outlined"
        type="unselected"
        selected={false}
        checked={false}
        value={"item"}
        onClick={onClick}
      />
    </ThemeProvider>
  );
  const rendered = getByText("Item name");
  expect(rendered).toBeTruthy();

  fireEvent.click(rendered);
  expect(onClick).toHaveBeenCalledTimes(1);
});

it("Should be able to run onDelete when clicked of close icon", () => {
  const onDelete = jest.fn();
  const { container } = render(
    <ThemeProvider>
      <Chip
        label="Item name"
        dataTestId="basic-chip"
        variant="outlined"
        type="unselected"
        selected={false}
        checked={false}
        value={"item"}
        onDelete={onDelete}
      />
    </ThemeProvider>
  );
  const deleteIcon = container.querySelector(".MuiChip-deleteIcon");
  expect(deleteIcon).toBeVisible();

  deleteIcon && fireEvent.click(deleteIcon);
  deleteIcon && expect(onDelete).toHaveBeenCalledTimes(1);
});
