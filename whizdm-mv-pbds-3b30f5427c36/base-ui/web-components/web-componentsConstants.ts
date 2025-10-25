export const mvImgUrl = "https://moneyview.in/images/";
export const mvIcons = {
  HamburgerMenuIcon: `${mvImgUrl}ic-hamburger-menu.svg`,
  MvGreenLogo: `${mvImgUrl}mv-green-logo-v3Compressed.svg`,
  ContactUs: `${mvImgUrl}ic-contact-selected.svg`,
};

export const pageCategoryConstants = {
  HOME_PAGE: "Home Page",
  PERSONAL_LOAN_PAGE: "Personal Loan Page",
  SMART_PAY_PAGE: "Smart Pay Page",
  CREDIT_SCORE_PAGE: "Credit Score Page",
  BRAND_PAGE: "Brand Page",
  FIXED_DEPOSIT_PRODUCT_PAGE: "Fixed Deposit Product Page",
  UPI_PAGE: "UPI Page",
  CT_CAMPAIGN_PAGE: "CT_CAMPAIGN_PAGE",
  PRODUCT_CREDIT_SCORE_PAGE: "PRODUCT_CREDIT_SCORE_PAGE",
};

export const pageCategoryConstantsCrossSell = {
  HOME_LOAN: "Home Loan Page",
  LAP: "LAP Page",
  DIGITAL_GOLD: "Digital Gold Page",
  MOTOR_INSURANCE: "Motor Insurance Page",
  CREDIT_CARD: "Credit Card Page",
  HDFC_CC: "HDFC CC Page",
  AU_CC: "AU CC Page",
  SBI_CC: "SBI CC Page",
};

export const PageDetailsCrossSell = [
  { route: "/home-loan/login", pageCategory: pageCategoryConstantsCrossSell.HOME_LOAN },
  { route: "/lap/login", pageCategory: pageCategoryConstantsCrossSell.LAP },
  { route: "/digital-gold/login", pageCategory: pageCategoryConstantsCrossSell.DIGITAL_GOLD },
  { route: "/motor-insurance/login", pageCategory: pageCategoryConstantsCrossSell.MOTOR_INSURANCE },
  { route: "/credit-cards/login", pageCategory: pageCategoryConstantsCrossSell.CREDIT_CARD },
  { route: "/credit-cards-static/login", pageCategory: pageCategoryConstantsCrossSell.CREDIT_CARD },
  { route: "/hdfc-cc/login", pageCategory: pageCategoryConstantsCrossSell.HDFC_CC },
  { route: "/au-cc/login", pageCategory: pageCategoryConstantsCrossSell.AU_CC },
  { route: "/sbi-cc/login", pageCategory: pageCategoryConstantsCrossSell.SBI_CC },
];

//pages
export const PageDetails = [
  { route: "/", pageCategory: pageCategoryConstants.HOME_PAGE },
  { route: "/personal-loan", pageCategory: pageCategoryConstants.PERSONAL_LOAN_PAGE },
  { route: "/smart-pay", pageCategory: pageCategoryConstants.SMART_PAY_PAGE },
  { route: "/credit-tracker-faq", pageCategory: pageCategoryConstants.CREDIT_SCORE_PAGE },
  { route: "/loans-faq-en", pageCategory: pageCategoryConstants.PERSONAL_LOAN_PAGE },
  { route: "/fixed-deposits-faq", pageCategory: pageCategoryConstants.FIXED_DEPOSIT_PRODUCT_PAGE },
  { route: "/upi-faq", pageCategory: pageCategoryConstants.UPI_PAGE },
  { route: "/money-view-app-faq", pageCategory: pageCategoryConstants.BRAND_PAGE },
  ...PageDetailsCrossSell,
];

export const routesPage = {
  smartPay: "/smart-pay",
  default: "/",
};

export type Link = {
  title: string;
  description?: string;
  redirection: string;
  icon?: string;
};

export type SidebarSection = {
  title: string;
  icon: string;
  links: Link[];
};

export const FooterLang = {
  WhizDmInovationWithCurrentYear: `©${new Date().getFullYear()} WhizDM Innovations Pvt. Ltd.`,
  FooterComplianceText: "CIN: U72200KA2014PTC075775 &nbsp;&nbsp;|&nbsp;&nbsp; IRDAI Registration No: CA0925 as Corporate Agent (Composite)",
};

export const footerItems = [
  { title: "Sitemap", href: "https://moneyview.in/sitemap.html" },
  { title: "Privacy Policy", href: "https://moneyview.in/privacy-policy-loans" },
  { title: "Other Disclosures", href: "https://moneyview.in/other-disclosures" },
  { title: "Terms & Conditions", href: "https://moneyview.in/terms-and-conditions" },
];

export const fontWeights = {
  "--font-weight-regular": 350,
  "--font-weight-semibold": 600,
  "--font-weight-bold": 700,
  "--font-weight-extrabold": 800,
};

export const footerInfoSections = [
  {
    items: [
      {
        description: "Personalized Financial Products For All",
        boldText: "Moneyview: ",
      },
      {
        description:
          "Moneyview, a digital lending platform, provides collateral-free personal loans from its lending partners with less paperwork and no end-use restrictions for all your needs.",
        boldText: "Personal Loans: ",
      },
      {
        description: "Track your credit score and behavior with our credit tracker and stay on top of your finances around the clock!",
        boldText: "Credit Tracker: ",
      },
      {
        description: "Get collateral-free business loans from Moneyview with minimal documentation and grow your business",
        boldText: "Business Loans: ",
      },
      // {
      //   description: "Split your online and offline purchases into easy EMIs with one tap and enjoy stress-free shopping!",
      //   boldText: "Smart Pay: ",
      // },
      {
        description: "Apply for high-limit Moneyview credit cards, powered by HDFC Bank, for various attractive features and benefits",
        boldText: "Credit Card: ",
      },
      {
        description: "Build your dream home with easy to apply home loans from Moneyview",
        boldText: "Home Loan: ",
      },
      {
        description: "Get a secured loan against your property with no end-use restrictions from Moneyview",
        boldText: "Loan Against Property: ",
      },
      {
        description: "Select the fixed deposit with the highest returns from our vast range of FDs",
        boldText: "Fixed Deposit Select: ",
      },
      {
        description: "Insure your car or bike with Moneyview at affordable prices and drive your worries away!",
        boldText: "Vehicle insurance: ",
      },
      {
        description: "Moneyview Gold offers 24K pure gold investment with 100% secure lockers in partnership with Caratlane",
        boldText: "Moneyview Gold: ",
      },
      {
        description: "Calculate your EMIs before applying for a loan and take control of your finances",
        boldText: "EMI Calculators: ",
      },
    ],
  },
];

export const termsAndConditionList = [
  {
    pageCategory: pageCategoryConstants.SMART_PAY_PAGE,
    content: `*May vary, subject to merchant offer and user creditworthiness at the time of plan selection.`,
  },
];
