import React from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { TypographyVariants } from "@mvloans/base-ui.common";
import { BasicStepper } from "./stepper.composition";
import { icons } from "./constants";
import { Stepper } from "./stepper";

it("should render stepper", () => {
  const rendered = render(<BasicStepper />);
  expect(rendered).not.toBeNull();
});

it("should render the completed step icon", () => {
  render(<BasicStepper />);
  const successIcon = screen.getByTestId("stepperUnFilledSuccess");
  expect(successIcon).toBeVisible();
});

it("should render the active step and incomplete icon", () => {
  render(<BasicStepper />);
  const activeIcon = screen.getByTestId("stepperFilledSuccess");
  expect(activeIcon).toBeVisible();
  const incompleteIcon = screen.getByTestId("stepperOutlineSuccess");
  expect(incompleteIcon).toBeVisible();
});

it("check if passed selected step is in completed state", () => {
  render(<BasicStepper />);
  const activeStep = screen.getByTestId("Select Plan");

  expect(activeStep).toBeVisible();
  expect(activeStep).toBeEnabled();

  const label = screen.getByText("Select Plan");
  expect(label).toBeVisible();
  expect(label.className).toMatch(TypographyVariants.bodySmallHighEmphasis);
});

it("check if complete steps are in disabled state", () => {
  render(<BasicStepper />);

  const activeStep = screen.getByTestId("Verify KYC");
  expect(activeStep).toBeVisible();
  expect(activeStep).toBeDisabled();
});

it("check if current active step is in active state", () => {
  render(<BasicStepper />);

  const activeStep = screen.getByTestId("Enter Details");
  expect(activeStep).toBeVisible();
  expect(activeStep).toBeEnabled();

  const activeIcon = screen.getByTestId("stepperOutlineSuccess");
  expect(activeIcon).toBeVisible();
});

it("check if onclick is triggered on active/completed step click", async () => {
  render(<BasicStepper />);

  const activeStep = screen.getByTestId("Enter Details");
  expect(activeStep).toBeVisible();

  await act(() => fireEvent.click(activeStep));

  const snackbarText = screen.getByText("The OnClick Returns a path to be redirected to depending on the current index");
  expect(snackbarText).toBeVisible();
});

it("should change previous step icon to completed on click", async () => {
  render(<BasicStepper />);

  const activeStep = screen.getByTestId("Income Verification");
  expect(activeStep).toBeVisible();

  const currentStepIconBeforeClick = within(activeStep).getByTestId("stepperUnFilledSuccess");
  expect(currentStepIconBeforeClick).toBeVisible();

  await act(() => fireEvent.click(activeStep));
  const currentStepIconAfterClick = within(activeStep).getByTestId("stepperFilledSuccess");
  expect(currentStepIconAfterClick).toBeVisible();
});

it("should not change selected step icon on click", async () => {
  render(<BasicStepper />);

  const activeStep = screen.getByTestId("Select Plan");
  expect(activeStep).toBeVisible();

  const currentStepIconBeforeClick = within(activeStep).getByTestId("stepperFilledSuccess");
  expect(currentStepIconBeforeClick).toBeVisible();

  await act(() => fireEvent.click(activeStep));
  const currentStepIconAfterClick = within(activeStep).getByTestId("stepperFilledSuccess");
  expect(currentStepIconAfterClick).toBeInTheDocument();
});

it("should change active step icon on click", async () => {
  render(<BasicStepper />);

  const activeStep = screen.getByTestId("Enter Details");
  expect(activeStep).toBeVisible();

  const currentStepIconBeforeClick = within(activeStep).getByTestId("stepperOutlineSuccess");
  expect(currentStepIconBeforeClick).toBeVisible();

  await act(() => fireEvent.click(activeStep));
  expect(screen.getByText("3")).toBeInTheDocument();
});

it("should call onStepClick fn on step click", () => {
  const steps = [
    {
      stepperKey: "incomeVerification",
      order: 1,
      label: "Income Verification",
      route: "getOffer",
      status: "COMPLETED",
    },
    {
      stepperKey: "planSelector",
      order: 2,
      label: "Select Plan",
      route: "selectPlan",
      status: "COMPLETED",
    },
    {
      stepperKey: "additionalDetails",
      order: 3,
      label: "Enter Details",
      route: "add-details",
      status: "ACTIVE",
    },
    {
      stepperKey: "kycVerification",
      order: 4,
      label: "Verify KYC",
      route: "kyc-select",
      status: "DISABLED",
    },
    {
      stepperKey: "uploadDocs",
      order: 5,
      label: "Upload documents",
      route: "upload-document",
      status: "DISABLED",
    },
  ];
  const props = {
    steps: steps,
    activeStepIndex: 2,
    onStepClick: jest.fn(),
    controlSelectedKey: "planSelector",
  };
  render(
    <ThemeProvider>
      <Stepper {...props} />
    </ThemeProvider>
  );

  const activeStep = screen.getByTestId("Select Plan");
  expect(activeStep).toBeVisible();

  fireEvent.click(activeStep);
  expect(props.onStepClick).toHaveBeenCalledTimes(1);
});
