import React from "react";
import { render, screen } from "@testing-library/react";
import {
  PennyItemActiveNumber,
  PennyItemDisabledNumber,
  PennyItemEnabledNumber,
  PennyItemIcon1,
  PennyItemIcon2,
  PennyItemIcon3,
  PennyItemIcon4,
  PennyItemProfileCustomIcon,
  PennyItemProfileDefaultUserIcon,
  PennyItemProfileText,
} from "./penny-item.composition";

describe("PennyItem testcases", () => {
  // VARIANT = NUMBER
  describe("Number Variant testcases", () => {
    it("should render penny item number active state", () => {
      render(<PennyItemActiveNumber />);
      const numElement = screen.getByText(1);
      expect(numElement).toBeVisible();
      const parent = numElement.parentElement as HTMLElement;

      const classNameRegex = /active/;
      const classList = parent.className;
      expect(classList).toMatch(classNameRegex);
    });

    it("should render penny item number disabled state", () => {
      render(<PennyItemDisabledNumber />);
      const numElement = screen.getByText(2);
      expect(numElement).toBeVisible();
      const parent = numElement.parentElement as HTMLElement;

      const classNameRegex = /disabled/;
      const classList = parent.className;
      expect(classList).toMatch(classNameRegex);
    });

    it("should render penny item number enabled state", () => {
      render(<PennyItemEnabledNumber />);
      const numElement = screen.getByText(3);
      expect(numElement).toBeVisible();
      const parent = numElement.parentElement as HTMLElement;

      const classNameRegex = /enabled/;
      const classList = parent.className;
      expect(classList).toMatch(classNameRegex);
    });
  });

  // VARIANT = PROFILE
  describe("Profile Variant testcases", () => {
    it("should render profile penny item with default user icon", () => {
      const { container } = render(<PennyItemProfileDefaultUserIcon />);
      expect(container.querySelector("svg")).toBeVisible();
    });

    it("should render profile penny item with text", () => {
      render(<PennyItemProfileText />);
      const textElement = screen.getByText("NK");
      expect(textElement).toBeVisible();
    });

    it("should render profile penny item with custom icon", () => {
      const { container } = render(<PennyItemProfileCustomIcon />);
      expect(container.querySelector("svg")).toBeVisible();
    });
  });

  // VARIANT = ICON
  describe("Icon Variant testcases", () => {
    it("should render icon penny item with circular radius and small size", () => {
      const { container } = render(<PennyItemIcon1 />);
      const iconElement = container.querySelector("svg");

      expect(iconElement).toBeVisible();
      const parent = iconElement?.parentElement as HTMLElement;
      const classList = parent.className;

      const radiusRegex = /circle/;
      const sizeRegex = /small/;
      expect(classList).toMatch(radiusRegex);
      expect(classList).toMatch(sizeRegex);
    });

    it("should render icon penny item with circular radius and medium size", () => {
      const { container } = render(<PennyItemIcon2 />);
      const iconElement = container.querySelector("svg");

      expect(iconElement).toBeVisible();
      const parent = iconElement?.parentElement as HTMLElement;
      const classList = parent.className;

      const radiusRegex = /circle/;
      const sizeRegex = /small/;
      expect(classList).toMatch(radiusRegex);
      expect(classList).not.toMatch(sizeRegex);
    });

    it("should render icon penny item with square radius and medium size", () => {
      const { container } = render(<PennyItemIcon3 />);
      const iconElement = container.querySelector("svg");

      expect(iconElement).toBeVisible();
      const parent = iconElement?.parentElement as HTMLElement;
      const classList = parent.className;

      const radiusRegex = /square/;
      const sizeRegex = /small/;
      expect(classList).toMatch(radiusRegex);
      expect(classList).not.toMatch(sizeRegex);
    });

    it("should render icon penny item with square radius and small size", () => {
      const { container } = render(<PennyItemIcon4 />);
      const iconElement = container.querySelector("svg");

      expect(iconElement).toBeVisible();
      const parent = iconElement?.parentElement as HTMLElement;
      const classList = parent.className;

      const radiusRegex = /square/;
      const sizeRegex = /small/;
      expect(classList).toMatch(radiusRegex);
      expect(classList).toMatch(sizeRegex);
    });
  });
});
