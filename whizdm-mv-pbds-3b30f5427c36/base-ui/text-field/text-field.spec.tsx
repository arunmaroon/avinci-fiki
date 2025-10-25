import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import {
  UnfilledWithPlaceholder,
  Filled,
  UnfilledDisabled,
  FilledDisabled,
  UnfilledErrorWithPlaceholder,
  FilledError,
  UnfilledIconPrefix,
  UnfilledIconPrefixTimer,
  UnfilledIconPrefixLink,
  FilledIconPrefixLink,
  FilledIconPrefixLinkSuccess,
  FilledIconPrefixLinkError,
  SearchTextField,
  AadharTextField,
  DateTextField,
  InteractivePromocode,
  InteractivePromocodeWithoutStartAdornment,
  InteractivePromocodeWithoutPrefix,
  MultilineTextfield,
  SelectTextField,
} from "./text-field.composition";

it("should render textfild", () => {
  const { container } = render(<UnfilledWithPlaceholder />);
  const UnfilledWithPlaceholderRendered = container.querySelector("#unfilledWithPlaceholder");
  expect(UnfilledWithPlaceholderRendered).toBeInTheDocument();
  expect(UnfilledWithPlaceholderRendered?.parentNode).not.toHaveClass("Mui-error");
  expect(UnfilledWithPlaceholderRendered).not.toHaveAttribute("disabled");
});

it("should render filled textfield", () => {
  const { container } = render(<Filled />);
  const FilledRendered = container.querySelector("#filled");
  expect(FilledRendered).toBeInTheDocument();
  expect(FilledRendered?.parentNode).not.toHaveClass("Mui-error");
  expect(FilledRendered).not.toHaveAttribute("disabled");
});

it("should render disabled textfild", () => {
  const { container } = render(<UnfilledDisabled />);
  const UnfilledDisabledRendered = container.querySelector("#unfilledDisabled");
  expect(UnfilledDisabledRendered).toBeInTheDocument();
  expect(UnfilledDisabledRendered?.parentNode).not.toHaveClass("Mui-error");
  expect(UnfilledDisabledRendered).toHaveAttribute("disabled");
});

it("should render disabled textfild", () => {
  const { container } = render(<FilledDisabled />);
  const FilledDisabledRendered = container.querySelector("#filledDisabled");
  expect(FilledDisabledRendered).toBeInTheDocument();
  expect(FilledDisabledRendered?.parentNode).not.toHaveClass("Mui-error");
  expect(FilledDisabledRendered).toHaveAttribute("disabled");
});

it("should render with the correct text", () => {
  const { container } = render(<UnfilledErrorWithPlaceholder />);
  const UnfilledErrorWithPlaceholderRendered = container.querySelector("#unfilledErrorWithPlaceholder");
  expect(UnfilledErrorWithPlaceholderRendered).toBeInTheDocument();
  expect(UnfilledErrorWithPlaceholderRendered?.parentNode).toHaveClass("Mui-error");
  expect(UnfilledErrorWithPlaceholderRendered).not.toHaveAttribute("disabled");
});

it.skip("should render with the correct text", () => {
  const { container } = render(<FilledError />);
  const FilledErrorRendered = container.querySelector("#filledError");
  expect(FilledErrorRendered).toBeInTheDocument();
  expect(FilledErrorRendered?.parentNode).toHaveClass("Mui-error");
  expect(FilledErrorRendered).not.toHaveAttribute("disabled");
});

it("should render textfild with prefix icon and suffix link", () => {
  const { container } = render(<UnfilledIconPrefix />);
  const UnfilledIconPrefixRendered = container.querySelector("#unfilledIconPrefix");
  expect(UnfilledIconPrefixRendered).toBeInTheDocument();
  expect(UnfilledIconPrefixRendered?.parentNode).not.toHaveClass("Mui-error");
  expect(UnfilledIconPrefixRendered).not.toHaveAttribute("disabled");
});

it("should render textfild with prefix icon and suffix timer", () => {
  const { container } = render(<UnfilledIconPrefixTimer />);
  const UnfilledIconPrefixTimerRendered = container.querySelector("#unfilledIconPrefixTimer");
  expect(UnfilledIconPrefixTimerRendered).toBeInTheDocument();
  expect(UnfilledIconPrefixTimerRendered?.parentNode).not.toHaveClass("Mui-error");
  expect(UnfilledIconPrefixTimerRendered).not.toHaveAttribute("disabled");
});

it("should render textfild with prefix icon and suffix link", () => {
  const { container } = render(<UnfilledIconPrefixLink />);
  const UnfilledIconPrefixLinkRendered = container.querySelector("#unfilledIconPrefixLink");
  expect(UnfilledIconPrefixLinkRendered).toBeInTheDocument();
  expect(UnfilledIconPrefixLinkRendered?.parentNode).not.toHaveClass("Mui-error");
  expect(UnfilledIconPrefixLinkRendered).not.toHaveAttribute("disabled");
});

it("should render textfild with prefix icon and suffix link", () => {
  const { container } = render(<FilledIconPrefixLink />);
  const FilledIconPrefixLinkRendered = container.querySelector("#filledIconPrefixLink");
  expect(FilledIconPrefixLinkRendered).toBeInTheDocument();
  expect(FilledIconPrefixLinkRendered?.parentNode).not.toHaveClass("Mui-error");
  expect(FilledIconPrefixLinkRendered).not.toHaveAttribute("disabled");
});

it("should render textfild with prefix icon and success", () => {
  const { container } = render(<FilledIconPrefixLinkSuccess />);
  const FilledIconPrefixLinkSuccessRendered = container.querySelector("#filledIconPrefixLinkSuccess");
  expect(FilledIconPrefixLinkSuccessRendered).toBeInTheDocument();
  expect(FilledIconPrefixLinkSuccessRendered?.parentNode).not.toHaveClass("Mui-error");
  expect(FilledIconPrefixLinkSuccessRendered).not.toHaveAttribute("disabled");
});

it("should render textfild with prefix icon and error", () => {
  const { container } = render(<FilledIconPrefixLinkError />);
  const FilledIconPrefixLinkErrorRendered = container.querySelector("#filledIconPrefixLinkError");
  expect(FilledIconPrefixLinkErrorRendered).toBeInTheDocument();
  expect(FilledIconPrefixLinkErrorRendered?.parentNode).toHaveClass("Mui-error");
  expect(FilledIconPrefixLinkErrorRendered).not.toHaveAttribute("disabled");
});

it("should render text field with select", async () => {
  const { getByLabelText } = render(<SearchTextField />);
  const rendered = getByLabelText("Label");
  expect(rendered).toBeInTheDocument();
});

it("should render text field with select option labels", async () => {
  const { getByText, getByLabelText } = render(<SearchTextField />);
  const rendered = getByLabelText("Label");
  await waitFor(() => fireEvent.keyDown(rendered, { key: "ArrowDown" }));
  const renderedElement1 = getByText("POPULAR BANKS");
  const renderedElement2 = getByText("OTHER BANKS");
  expect(renderedElement1).toBeInTheDocument();
  expect(renderedElement2).toBeInTheDocument();
});

it("should render text field with date", async () => {
  const { getByLabelText } = render(<DateTextField />);
  const rendered = getByLabelText("Label Value");
  expect(rendered).toBeInTheDocument();
});

it("should render text field with aadhaar", async () => {
  const { getByText, getByRole } = render(<AadharTextField />);
  const rendered = getByText("Enter first 8 digits of aadhaar");
  const renderInput = getByRole("textbox");
  expect(rendered).toBeInTheDocument();
  expect(renderInput).toHaveValue("____ ____ 1234");
});

it("should render text field with suffix on Change", async () => {
  const { getByText, getByRole } = render(<InteractivePromocode />);
  const renderInput = getByRole("textbox");
  await waitFor(() => fireEvent.change(renderInput, { target: { value: "2" } }));
  const suffix = getByText("Submit");
  await waitFor(() => fireEvent.click(suffix));
  const success = getByText("Yay! You received ₹500 discount on the felicitation fee");
  expect(success).toBeInTheDocument();
  expect(suffix).toBeInTheDocument();
});

it("should render text field with suffix on Change without start Adornment", async () => {
  const { getByText, getByRole } = render(<InteractivePromocodeWithoutStartAdornment />);
  const renderInput = getByRole("textbox");
  await waitFor(() => fireEvent.change(renderInput, { target: { value: "2" } }));
  const suffix = getByText("Submit");
  await waitFor(() => fireEvent.click(suffix));
  const success = getByText("Yay! You received ₹500 discount on the felicitation fee");
  const prefix = getByRole("img", { name: "ic-promocode-tag" });
  expect(success).toBeInTheDocument();
  expect(suffix).toBeInTheDocument();
  expect(prefix).toBeInTheDocument();
});

it("should render text field with suffix on Change without prefix", async () => {
  const { getByText, getByRole } = render(<InteractivePromocodeWithoutPrefix />);
  const renderInput = getByRole("textbox");
  await waitFor(() => fireEvent.change(renderInput, { target: { value: "2" } }));
  const suffix = getByText("Submit");
  await waitFor(() => fireEvent.click(suffix));
  const success = getByText("Yay! You received ₹500 discount on the felicitation fee");
  const startAdornment = getByText("₹");
  expect(success).toBeInTheDocument();
  expect(startAdornment).toBeInTheDocument();
  expect(suffix).toBeInTheDocument();
});

it("should render text field with Multiline", async () => {
  const { getByRole } = render(<MultilineTextfield />);
  expect(getByRole("textbox")).toHaveClass("MuiInputBase-inputMultiline");
});

it("should render text field with Select Dropdown", async () => {
  const { getByLabelText } = render(<SelectTextField />);
  const rendered = getByLabelText("Label");
  expect(rendered).toBeInTheDocument();
});
