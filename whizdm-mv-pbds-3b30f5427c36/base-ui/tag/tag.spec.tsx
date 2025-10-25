import React from "react";

import { render } from "@testing-library/react";

import { Tag } from "./tag"; // Assuming your component file is named Tag.js and exported Tag component
import { defaultTagDarkSubVariant, defaultTagVariant, tagType } from "./constants";

describe("Tag component", () => {
  const props = {
    type: tagType.DEFAULT,
    variant: defaultTagVariant.DARK,
    subVariant: defaultTagDarkSubVariant.PRIMARY,
    label: "Test Label",
    color: "red",
  };
  test.skip("renders a chip with the specified label", () => {
    const { getByText } = render(<Tag {...props} />);

    expect(getByText("Test Label")).toBeInTheDocument();
  });
});
