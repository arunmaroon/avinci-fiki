import React from "react";
import { render, screen } from "@testing-library/react";
import { Badge } from "./badge"; // Assuming this is the path to your Badge component

describe("Badge Component", () => {
  test.skip("renders badge with correct badge content", () => {
    const { container } = render(<Badge badgeContent={5} />);
    expect(container.getElementsByClassName("MuiBadge-colorPrimary")[0].textContent).toBe("5");
  });

  test.skip("renders badge with correct badge color", () => {
    const { container } = render(<Badge badgeContent={10} />);
    expect(container.getElementsByClassName("MuiBadge-colorPrimary").length).toBe(1);
  });

  test.skip("does not render icon when iconName prop is not provided", () => {
    render(<Badge badgeContent={5} />);
    const iconElement = screen.getAllByAltText("yourIconName");
    expect(iconElement).toBeNull();
  });

  test.skip("renders icon when iconName prop is provided", () => {
    render(<Badge iconName="yourIconName" badgeContent={5} />);
    const iconElement = screen.getAllByAltText("yourIconName");
    expect(iconElement).toBeInTheDocument();
  });
});
