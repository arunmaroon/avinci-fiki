import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { BasicCheckbox, DisabledCheckbox, DefaultSelectedCheckbox, IndeterminateCheckbox } from './checkbox.composition';

it('should render with the correct label', () => {
  const { getByText } = render(<BasicCheckbox />);
  const rendered = getByText('My label');
  expect(rendered).toBeTruthy();
});


it('should show checked mark if clicked when unchecked', () => {
  const { getByTestId } = render(<BasicCheckbox />);
  const checkbox = getByTestId("checkbox");
  let checkboxvalue = checkbox.getAttribute("checked")
  if (checkboxvalue) {
    expect(checkboxvalue).toEqual(false);
    fireEvent.click(checkbox);
    expect(checkboxvalue).toEqual(true)
  }
})

it('should show dash mark if in indeterminate state', () => {
  const { getByTestId } = render(<IndeterminateCheckbox />);
  const checkbox = getByTestId("indeterminate-checkbox").querySelector('input[type="checkbox"]');
  expect(checkbox).toHaveAttribute("data-indeterminate", "true")

})

it('should render checkbox in  disabled mode if disabled specified', () => {
  const { getByTestId } = render(<DisabledCheckbox />);
  const checkbox = getByTestId("disabled-checkbox");
  expect(checkbox).toHaveAttribute("aria-disabled");

})

it('should be checked if checked is passed specified', () => {
  const { getByTestId } = render(<DefaultSelectedCheckbox />);
  const checkbox = getByTestId("default-selected-checkbox").querySelector('input[type="checkbox"]');
  expect(checkbox).toHaveProperty("checked", true);



})