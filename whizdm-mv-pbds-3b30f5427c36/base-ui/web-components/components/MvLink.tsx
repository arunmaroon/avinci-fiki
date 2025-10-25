import React, { Component } from "react";
import MuiLink from "@mui/material/Link";
import { Link, SxProps, Theme } from "@mui/material";

interface MvinkProps {
  href: string;
  newTab?: boolean;
  overrideStyle?: SxProps<Theme>;
  children: React.ReactNode;
  scroll?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  prefetch?: boolean;
  className?: string;
  linkComponent?: React.ElementType;
}

const MvLink = ({
  href,
  className,
  children,
  newTab = false,
  prefetch = false,
  overrideStyle = {},
  linkComponent,
  ...props
}: MvinkProps) => {
  return (
    <MuiLink
      href={href}
      component={linkComponent ?? Link}
      target={newTab ? "_blank" : "_self"}
      rel={newTab ? "noopener noreferrer" : undefined}
      className={className}
      sx={{
        display: "block",
        textDecoration: "none",
        ...overrideStyle,
      }}
      {...props}>
      {children}
    </MuiLink>
  );
};

export default MvLink;
