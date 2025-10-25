import React from "react";
import RadioPlanSelector, { RadioPlanSelectorProps } from "./radio-plan-selector";
import { StateIcons } from "@mvloans/base-ui.radio-button";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { render, screen, fireEvent } from "@testing-library/react";

const options = [
  {
    title: "Plan A",
    subTitle: "Basic Plan",
    value: "A",
    titleChild: <div>Child A</div>,
    content: [
      { label: "Feature 1", helper: "Description 1", value: "Value 1" },
      { label: "Feature 2", helper: "Description 2", value: "Value 2" },
    ],
    id: "1",
  },
  {
    title: "Plan B",
    subTitle: "Premium Plan",
    value: "B",
    titleChild: <div>Child B</div>,
    content: [
      { label: "Feature 3", helper: "Description 3", value: "Value 3" },
      { label: "Feature 4", helper: "Description 4", value: "Value 4" },
    ],
    id: "2",
  },
];

const stateIcons: StateIcons = {
  default: "default_icon",
  selected: "selected_icon",
  disabled: "",
};

const renderComponent = (props: Partial<RadioPlanSelectorProps> = {}) => {
  const defaultProps: RadioPlanSelectorProps = {
    options: options,
    value: null,
    stateIcons: stateIcons,
    displayCount: 1,
    ...props,
  };
  return render(
    <ThemeProvider>
      <RadioPlanSelector {...defaultProps} />
    </ThemeProvider>
  );
};

test("renders options", () => {
  renderComponent();

  expect(screen.getByText("Plan A")).toBeInTheDocument();
});

test("displays subtitle", () => {
  renderComponent();

  expect(screen.getByText("Basic Plan")).toBeInTheDocument();
});

test("calls onChange when option is selected", () => {
  const handleChange = jest.fn();
  renderComponent({ onChange: handleChange });

  const optionA = screen.getByText("Plan A");

  fireEvent.click(optionA);

  expect(handleChange).toHaveBeenCalledWith(expect.any(Object), "1");
});

test("displays title child", () => {
  renderComponent();

  expect(screen.getByText("Child A")).toBeInTheDocument();
});

test("toggles collapse content", () => {
  renderComponent();

  const optionA = screen.getByText("Plan A");
  fireEvent.click(optionA);

  expect(screen.getByText("Feature 1")).toBeInTheDocument();
  expect(screen.getByText("Feature 2")).toBeInTheDocument();
});

test("handles display count", () => {
  renderComponent();

  expect(screen.queryByText("See 1 more")).toBeInTheDocument();

  const seeMoreButton = screen.getByText("See 1 more");
  fireEvent.click(seeMoreButton);

  expect(screen.queryByText("See less")).toBeInTheDocument();
});
