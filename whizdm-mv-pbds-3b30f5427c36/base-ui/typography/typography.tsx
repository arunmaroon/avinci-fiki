import React, { HTMLAttributeAnchorTarget } from "react";
import { Link, Typography as MuiTypography } from "@mui/material";
import { useStyles } from "./styles";
import { TypographyVariants } from "@mvloans/base-ui.common";

export type TypographyProps = {
  /**
   * The component maps the variant prop to a range of different HTML element types.
   * For instance, subtitle1 to `<h6>`.
   * If you wish to change that mapping, you can provide your own.
   * Alternatively, you can use the `component` prop.
   */

  /**
   *  Applies the theme typography styles.
   */
  variant?: TypographyVariants;

  colorValue?: string;

  /**
   *  The component used for the root node. A string to use a DOM element. Overrides the behavior of the variantMapping prop.
   */

  component?: any;

  /**
   * Override or extend the styles applied to the component.
   */

  classes?: Object;

  className?: string;

  /**
   * The content of the component.
   */

  children?: React.ReactNode;

  /**
   *  Set the font-weight property on the component.
   */
  fontWeight?: "regular" | "medium" | "semiBold";

  /**
   *  Set the text case property on the component.
   */

  textTransform?: "upper" | "lower" | "capital";

  /**
   * Set the text-align on the component.
   */

  align?: "inherit" | "left" | "center" | "right" | "justify";

  /**
   *  Remove underline typography if used as suffix
   */
  noUnderline?: boolean;

  /**
   * If `true`, the text will not wrap, but instead will truncate with a text overflow ellipsis.
   *
   * Note that text overflow can only happen with block or inline-block level elements
   * (the element needs to have a width in order to overflow).
   */

  noWrap?: boolean;
  dataAttr?: string;
  href?: string;
  onClick?: (e: any) => void;
  target?: HTMLAttributeAnchorTarget;
};

export const Typography = ({
  variant,
  className,
  children,
  fontWeight,
  textTransform,
  align,
  noWrap = false,
  component,
  dataAttr,
  colorValue,
  href,
  onClick,
  noUnderline,
  target = "_blank",
}: TypographyProps) => {
  const { classes, cx } = useStyles({ colorValue });

  return (
    <MuiTypography
      variant={variant as any}
      component={component}
      className={cx(
        className,
        textTransform && classes[textTransform],
        fontWeight && classes[fontWeight],
        colorValue && classes.colorClass
      )}
      align={align}
      noWrap={noWrap}
      data-attr={dataAttr}>
      {href || onClick ? (
        <Link href={href} onClick={onClick} underline={noUnderline ? "none" : "always"} target={target} className={classes.link}>
          {children}
        </Link>
      ) : (
        children
      )}
    </MuiTypography>
  );
};
