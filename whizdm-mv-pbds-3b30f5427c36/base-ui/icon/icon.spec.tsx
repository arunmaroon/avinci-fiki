import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { BasicIcon } from "./icon.composition";
import Icon from "./icon";
import { commonConfig } from "@mvloans/base-ui.common";

it("should render with the correct text", () => {
  render(<BasicIcon />);
  const icon = screen.getByAltText("home-banner");
  expect(icon).toBeVisible();
});

it("should call onclick function on click", () => {
  const onClick = jest.fn();
  render(<Icon iconName={"home-banner"} onClick={onClick} />);

  const icon = screen.getByAltText("home-banner");
  fireEvent.click(icon);

  expect(onClick).toHaveBeenCalledTimes(1);
});

it("should append to  url if append prop present", () => {
  render(<Icon iconName={"home-banner"} append="pwa-icons/" />);

  const icon = screen.getByAltText("home-banner");
  expect(icon).toHaveAttribute("src", `${commonConfig.resourceBaseUrl}pwa-icons/home-banner.svg`);
});

it("check if passed iconExt is present in src of icon", () => {
  render(<Icon iconName={"home-banner"} iconExt="jpeg" />);

  const icon = screen.getByAltText("home-banner");
  expect(icon).toHaveAttribute("src", `${commonConfig.resourceBaseUrl}home-banner.jpeg`);
});

it("should not  lazy load image if flag false with height and width attribute", async () => {
  const afterImageLoad = jest.fn();
  render(<Icon iconName={"home-banner"} height={32} width={32} noLazyLoad={false} afterImageLoad={afterImageLoad} />);

  const icon = screen.getByAltText("home-banner");
  expect(icon).toBeVisible();

  expect(icon).toHaveAttribute("height", "32");
  expect(icon).toHaveAttribute("width", "32");
});

it("should lazy load image if flag true without height and width attribute", async () => {
  const afterImageLoad = jest.fn();
  render(<Icon iconName={"home-banner"} height={32} width={32} noLazyLoad={true} afterImageLoad={afterImageLoad} />);

  const icon = screen.getByAltText("home-banner");
  expect(icon).toBeVisible();

  expect(icon).not.toHaveAttribute("height", "32");
  expect(icon).not.toHaveAttribute("width", "32");
});

it("should call onClick on click of icon when noLazyload true", () => {
  const onClick = jest.fn();
  render(<Icon iconName={"home-banner"} height={32} width={32} noLazyLoad={true} onClick={onClick} />);

  const icon = screen.getByAltText("home-banner");
  fireEvent.click(icon);

  expect(onClick).toHaveBeenCalledTimes(1);
});

it("should call onClick on click of icon when noLazyload false", () => {
  const onClick = jest.fn();
  render(<Icon iconName={"home-banner"} height={32} width={32} noLazyLoad={false} onClick={onClick} />);

  const icon = screen.getByAltText("home-banner");
  fireEvent.click(icon);

  expect(onClick).toHaveBeenCalledTimes(1);
});

it("should have alt text as icon-image when no iconName passed", () => {
  render(<Icon noLazyLoad={true} />);

  const icon = screen.getByAltText("icon-image");
  expect(icon).toBeVisible();
});

it("icon should have passed styles when noLazyload true", () => {
  render(<Icon style={{ background: "red" }} noLazyLoad />);

  const icon = screen.getByAltText("icon-image");
  expect(icon).toBeVisible();

  expect(icon).toHaveAttribute("style", "background: red;");
});

it("icon should have passed className when noLazyload true", () => {
  render(<Icon className="icon-class" noLazyLoad />);

  const icon = screen.getByAltText("icon-image");
  expect(icon).toBeVisible();

  expect(icon).toHaveClass("icon-class");
});

it("icon should have passed styles when noLazyload false", () => {
  render(<Icon style={{ background: "red" }} noLazyLoad={false} />);

  const icon = screen.getByAltText("icon-image");
  expect(icon).toBeVisible();

  expect(icon).toHaveAttribute("style", "background: red;");
});

it("icon should have passed className when noLazyload false", () => {
  render(<Icon className="icon-class" noLazyLoad={false} />);

  const icon = screen.getByAltText("icon-image");
  expect(icon).toBeVisible();

  expect(icon).toHaveClass("icon-class");
});
