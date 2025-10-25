import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  AlertWrapper as Alert,
  FullScreenDialogWrapper as FullScreenDialog,
  InformationDialogWrapper as InformationDialog,
  ModalWrapper as Modal,
  PanCardDialogWrapper as PanCardDialog,
  PrimaryDialogWrapper as PrimaryDialog,
  SecondaryAlertWrapper as SecondaryAlert,
  SecondaryDialogWrapper as SecondaryDialog,
  TertiaryDialogWrapper as TertiaryDialog,
} from "./dialog.composition";
import { cleanup } from "@testing-library/react";

/**
 * Following testcases are being verified:
 * - Checks if primary dialog is rendered correctly
 * - Should close primary dialog on btn click
 * - Checks if modal  is rendered correctly.
 * - Should close modal on close icon click
 * - Should close modal on btn click
 * - Should render secondary dialog correctly
 * - Should close secondary dialog on btn click
 * - Should render tertiary dialog correctly
 * - Should close teritary dailog on submit click
 * - Should render alert correctly
 * - Should close alert on cancel click
 * - Should render full screen dialog correctly
 * - Should render information dialog correctly
 * - Should close information dialog on let's go button click
 * - Should render pan card dialog correctly
 * - Should close pan card dailog on continue click
 * - Should render secondary alert properly
 * - Should close secondary alert on cancel click
 */

afterEach(cleanup);

/**Checks if primary dialog is rendered correctly */
it("should render primary dailog with the correct text on button click", async () => {
  const { getByText } = render(<PrimaryDialog />);
  const rendered = getByText("Click To Open");

  fireEvent.click(rendered);

  const renderText = getByText("Verify employment");
  expect(renderText).toBeVisible();

  const subText = getByText("OTP has been sent to your work email ID");
  expect(subText).toBeVisible();

  const inputLabel = screen.getByLabelText("OTP");
  expect(inputLabel).toBeVisible();

  const verifyOtpBtn = screen.getByRole("button");
  expect(verifyOtpBtn).toBeVisible();

  //should close dialog on btn click
  fireEvent.click(verifyOtpBtn);
  expect(verifyOtpBtn).not.toBeVisible();
});

/**Should close primary dialog on btn click */
it("should close primary dialog on btn click", async () => {
  const { getByText } = render(<PrimaryDialog />);
  const rendered = getByText("Click To Open");

  fireEvent.click(rendered);

  const verifyOtpBtn = screen.getByRole("button");
  expect(verifyOtpBtn).toBeVisible();

  //should close dialog on btn click
  fireEvent.click(verifyOtpBtn);
  expect(verifyOtpBtn).not.toBeVisible();
});

/**Checks if modal  is rendered correctly.  */
it("should render modal with the correct text on button click", async () => {
  const { getByText } = render(<Modal />);
  const rendered = getByText("Click To Open");

  fireEvent.click(rendered);

  const renderText = getByText("Verify employment");
  expect(renderText).toBeVisible();

  const subText = getByText("OTP has been sent to your work email ID");
  expect(subText).toBeVisible();

  const inputLabel = screen.getByLabelText("OTP");
  expect(inputLabel).toBeVisible();

  const verifyOtpBtn = screen.getByRole("button");
  expect(verifyOtpBtn).toBeVisible();

  const closeIcon = screen.getByTestId("closeSvgIcon");
  expect(closeIcon).toBeVisible();
});

/**Should close modal on close icon click */
it("Should close modal on close icon click", async () => {
  const { getByText } = render(<Modal />);
  const rendered = getByText("Click To Open");

  fireEvent.click(rendered);

  const closeIcon = screen.getByTestId("closeSvgIcon");
  expect(closeIcon).toBeVisible();

  fireEvent.click(closeIcon);
  expect(closeIcon).not.toBeVisible();
});

/**Should close modal on btn click */
it("Should close modal on btn click ", async () => {
  const { getByText } = render(<Modal />);
  const rendered = getByText("Click To Open");

  fireEvent.click(rendered);

  const verifyOtpBtn = screen.getByRole("button");
  expect(verifyOtpBtn).toBeVisible();
  fireEvent.click(verifyOtpBtn);
  expect(verifyOtpBtn).not.toBeVisible();
});

/**Should render secondary dialog correctly */
it("Should render secondary dialog correctly", async () => {
  const { getByText } = render(<SecondaryDialog />);
  const rendered = getByText("Click To Open");

  fireEvent.click(rendered);

  const renderText = getByText("Netbanking verification failed");
  expect(renderText).toBeVisible();

  const subText = getByText("Your netbanking verification has failed. Please try uploading bank statements");
  expect(subText).toBeVisible();

  const actionBtn = screen.getAllByRole("button");
  expect(actionBtn).toHaveLength(2);

  const uploadBtn = screen.getByText("Upload Bank Statement");
  expect(uploadBtn).toBeVisible();

  const tryAgainBtn = screen.getByText("Try Again");
  expect(tryAgainBtn).toBeVisible();
});

/**Should close secondary dialog on btn click*/
it("Should close secondary dialog on btn click  ", async () => {
  const { getByText } = render(<SecondaryDialog />);
  const rendered = getByText("Click To Open");

  fireEvent.click(rendered);

  const uploadBtn = screen.getByText("Upload Bank Statement");
  expect(uploadBtn).toBeVisible();

  fireEvent.click(uploadBtn);
  expect(uploadBtn).not.toBeVisible();
});

/**Should render tertiary dialog correctly */
it("Should render tertiary dialog correctly", async () => {
  const { getByText } = render(<TertiaryDialog />);
  const rendered = getByText("Click To Open");

  fireEvent.click(rendered);

  const renderText = getByText("Did something go wrong?");
  expect(renderText).toBeVisible();

  const subText = getByText("Select a reason for not completing your KYC");
  expect(subText).toBeVisible();

  const radioBtns = screen.getAllByRole("radiogroup");
  expect(radioBtns).not.toHaveLength(0);

  const actionBtn = screen.getAllByRole("button");
  expect(actionBtn).toHaveLength(2);

  const uploadBtn = screen.getByText("Continue");
  expect(uploadBtn).toBeVisible();

  const tryAgainBtn = screen.getByText("Submit");
  expect(tryAgainBtn).toBeVisible();
});

/**Should close teritary dailog on submit click */
it("Should close teritary dailog on submit click", async () => {
  const { getByText } = render(<TertiaryDialog />);
  const rendered = getByText("Click To Open");

  fireEvent.click(rendered);

  const tryAgainBtn = screen.getByText("Submit");
  expect(tryAgainBtn).toBeVisible();

  fireEvent.click(tryAgainBtn);
  expect(tryAgainBtn).not.toBeVisible();
});

/** Should render alert correctly */
it("Should render alert dialog correctly", async () => {
  const { getByText } = render(<Alert />);
  const rendered = getByText("Click To Open");

  fireEvent.click(rendered);

  const renderText = getByText("Are you sure you want to go back?");
  expect(renderText).toBeVisible();

  const subText = getByText("Don’t worry, you KYC details are saved and won’t be affected");
  expect(subText).toBeVisible();

  const actionBtn = screen.getAllByRole("button");
  expect(actionBtn).toHaveLength(2);

  const continueBtn = screen.getByText("Continue");
  expect(continueBtn).toBeVisible();

  const cancelBtn = screen.getByText("Cancel");
  expect(cancelBtn).toBeVisible();
});

/** Should close alert on cancel click */
it("Should close alert on cancel click", async () => {
  const { getByText } = render(<Alert />);
  const rendered = getByText("Click To Open");

  fireEvent.click(rendered);

  const cancelBtn = screen.getByText("Cancel");
  expect(cancelBtn).toBeVisible();

  fireEvent.click(cancelBtn);
  expect(cancelBtn).not.toBeVisible();
});

/**Should render full screen dialog correctly */
it("Should close alert on cancel click", async () => {
  const { getByText } = render(<FullScreenDialog />);
  const rendered = getByText("Click To Open");

  fireEvent.click(rendered);

  const renderText = getByText("Please wait...");
  expect(renderText).toBeVisible();

  const subText = getByText("Verifying your application/details. Please wait as we verify your details, this may take less than a minute");
  expect(subText).toBeVisible();

  const poolLoaderImage = screen.getByAltText("ic-pool-loader");
  expect(poolLoaderImage).toBeVisible();
});

/** Should render information dialog correctly */
it("Should render information dialog correctly", async () => {
  const { getByText } = render(<InformationDialog />);
  const rendered = getByText("Click To Open");

  fireEvent.click(rendered);

  const renderText = getByText("Great! You are just 4 steps away from getting the loan");
  expect(renderText).toBeVisible();

  const subText = getByText("Basic information");
  expect(subText).toBeVisible();

  const image = screen.getByAltText("ic-rocket");
  expect(image).toBeVisible();

  const btn = screen.getByText("Let’s go");
  expect(btn).toBeVisible();
});

/** Should close information dialog on let's go button click */
it("Should close information dialog on let's go button click", async () => {
  const { getByText } = render(<InformationDialog />);
  const rendered = getByText("Click To Open");

  fireEvent.click(rendered);

  const btn = screen.getByText("Let’s go");
  expect(btn).toBeVisible();

  fireEvent.click(btn);
  expect(btn).not.toBeVisible();
});

/** Should render pan card dialog correctly */
it("Should render information dialog correctly", async () => {
  const { getByText } = render(<PanCardDialog />);
  const rendered = getByText("Click To Open");

  fireEvent.click(rendered);

  const renderText = getByText("Confirm your PAN card number");
  expect(renderText).toBeVisible();

  const subText = getByText("ABCDE1234F");
  expect(subText).toBeVisible();

  const image = screen.getByAltText("ic-pan-card");
  expect(image).toBeVisible();

  const actionBtn = screen.getAllByRole("button");
  expect(actionBtn).toHaveLength(2);

  const continueBtn = screen.getByText("Yes, that’s correct");
  expect(continueBtn).toBeVisible();

  const cancelBtn = screen.getByText("No, I’ll enter manually");
  expect(cancelBtn).toBeVisible();
});

/** Should close pan card dailog on continue click */
it("Should close pan card dailog on continue click", async () => {
  const { getByText } = render(<PanCardDialog />);
  const rendered = getByText("Click To Open");

  fireEvent.click(rendered);

  const continueBtn = screen.getByText("Yes, that’s correct");
  expect(continueBtn).toBeVisible();
  fireEvent.click(continueBtn);
  expect(continueBtn).not.toBeVisible();
});

/**Should render secondary alert properly */
it("Should render information dialog correctly", async () => {
  const { getByText } = render(<SecondaryAlert />);
  const rendered = getByText("Click To Open");

  fireEvent.click(rendered);

  const renderText = getByText("Are you sure you want to skip income verification?");
  expect(renderText).toBeVisible();

  const subText = getByText("You will be eligible for a maximum loan amount of upto ₹10,000");
  expect(subText).toBeVisible();

  const actionBtn = screen.getAllByRole("button");
  expect(actionBtn).toHaveLength(2);

  const continueBtn = screen.getByText("Continue");
  expect(continueBtn).toBeVisible();

  const cancelBtn = screen.getByText("Cancel");
  expect(cancelBtn).toBeVisible();
});

/**Should close secondary alert on cancel click */
it("Should render information dialog correctly", async () => {
  const { getByText } = render(<SecondaryAlert />);
  const rendered = getByText("Click To Open");

  fireEvent.click(rendered);

  const cancelBtn = screen.getByText("Cancel");
  expect(cancelBtn).toBeVisible();
  fireEvent.click(cancelBtn);
  expect(cancelBtn).not.toBeVisible();
});
