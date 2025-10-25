import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { StatusCard, StatusCardProps } from "./status-card";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";

describe("StatusCard", () => {
  const defaultProps: StatusCardProps = {
    status: "success",
    title: "Test Title",
    description: "Test Description",
    buttonLabel: "Test Button",
    handleActionClick: jest.fn(),
    showCloseButton: true,
    handleOnClose: jest.fn(),
    classes: {},
  };

  it("renders without crashing", () => {
    render(
      <ThemeProvider>
        <StatusCard {...defaultProps} />
      </ThemeProvider>
    );
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("renders the correct icon based on the status", () => {
    render(
      <ThemeProvider>
        <StatusCard {...defaultProps} />
      </ThemeProvider>
    );
    expect(screen.getByAltText("ic-statusCard-success")).toBeInTheDocument();
  });

  it("renders the button when buttonLabel is provided", () => {
    render(
      <ThemeProvider>
        <StatusCard {...defaultProps} />
      </ThemeProvider>
    );
    expect(screen.getByText("Test Button")).toBeInTheDocument();
  });

  it("calls handleActionClick when the button is clicked", () => {
    render(
      <ThemeProvider>
        <StatusCard {...defaultProps} />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByText("Test Button"));
    expect(defaultProps.handleActionClick).toHaveBeenCalled();
  });

  it("renders the close button when showCloseButton is true", () => {
    render(
      <ThemeProvider>
        <StatusCard {...defaultProps} />
      </ThemeProvider>
    );
    expect(screen.getByTestId("closeIcon-svg")).toBeInTheDocument();
  });

  it("calls handleOnClose when the close button is clicked", () => {
    render(
      <ThemeProvider>
        <StatusCard {...defaultProps} />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByTestId("closeIcon-svg"));
    expect(defaultProps.handleOnClose).toHaveBeenCalled();
  });

  it("does not render the component when visible is false", () => {
    const { container, rerender } = render(
      <ThemeProvider>
        <StatusCard {...defaultProps} />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByTestId("closeIcon-svg"));
    rerender(
      <ThemeProvider>
        <StatusCard {...defaultProps} />
      </ThemeProvider>
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders children correctly", () => {
    render(
      <ThemeProvider>
        <StatusCard {...defaultProps}>
          <div data-testid="child">Child Component</div>
        </StatusCard>{" "}
      </ThemeProvider>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
