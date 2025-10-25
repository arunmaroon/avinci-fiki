import React from "react";
import TermsAndCondition from "./TermsAndCondition";
import FooterInfoSection from "./FooterInfoSection";
import { Divider } from "@mui/material";
import { pageCategoryConstants, routesPage } from "../web-componentsConstants";

export type ConditionalFooterItemsProps = {
  pathname: string;
};

const ConditionalFooterItems = (props: ConditionalFooterItemsProps) => {
  const { pathname } = props;
  return (
    <>
      <Divider sx={{ borderColor: "initial" }} />
      {pathname == routesPage.default && <FooterInfoSection />}
      {pathname == routesPage.smartPay && <TermsAndCondition pageCategory={pageCategoryConstants.SMART_PAY_PAGE} />}
    </>
  );
};

export default ConditionalFooterItems;
