import React from "react";
import { Header } from "./header";
import { FooterSection } from "./footerSection";

export const BasicHeader = () => {
  return <Header pathname="/" />;
};

export const BasicFooter = () => {
  return <FooterSection pathname="/" />;
};
