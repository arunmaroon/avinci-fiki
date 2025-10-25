import { PageDetails, SidebarSection } from "./web-componentsConstants";

export const getPageCategory = (pathname: string) => {
  const pageDetail = PageDetails.find((page) => page.route === pathname);
  return pageDetail ? pageDetail.pageCategory : "Unknown Page";
};

export const getHrefValues = (url: string, pageCategory: string, section: string): string => {
  let pathSegments = url.split("/");
  let pathname = pathSegments.pop() || "";
  if (pathname === "login") {
    let secondPath = pathSegments.pop() || "";
    pathname = `${secondPath}-login`;
  }
  const utmSource = pageCategory.replace(/ /g, "-").toLowerCase();
  const utmMedium = `${pathname}-${section}-navbar`;
  const utmCampaign = `${utmSource}-${utmMedium}`;
  return `${url}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`;
};

export const getCampaignClass = (url: string, pageCategory: string, section: string): string => {
  const pathname = url === "/credit-score/login" ? "credit-score-login" : url.split("/").pop();
  const utmSource = pageCategory && pageCategory.replace(/ /g, "-").toLowerCase();
  return `${utmSource}-${pathname}-${section}-navbar`;
};

export const getSideBarData = (mvSiteUrl: string, crossSellUrl: string, fdRate: string): SidebarSection[] => {
  return [
    {
      title: "Loans",
      icon: "ic-hamburger-loans.svg",
      links: [
        {
          title: "Personal Loan",
          description: "Get up to ₹10L in 10 mins",
          redirection: `${mvSiteUrl}/personal-loan`,
          icon: "ic-pl-loan-product.svg",
        },
        {
          title: "Business Loan",
          description: "Get up to ₹5L with 60M tenure",
          redirection: `${mvSiteUrl}/business-loan`,
          icon: "ic-bl-loan-product.svg",
        },
        {
          title: "Home Loan",
          description: "Interest starts from 8.50%* p.a.",
          redirection: `${crossSellUrl}/products/home-loan/login`,
          icon: "ic-hl-loan-product.svg",
        },
        {
          title: "Credit Card",
          description: "Choose cards from HDFC or AU banks",
          redirection: `${crossSellUrl}/products/hdfc-cc/login`,
          icon: "ic-cc-loan-product.svg",
        },
        // {
        //   title: "Smart Pay",
        //   description: "Shop now and pay in easy EMIs",
        //   redirection: `${mvSiteUrl}/smart-pay`,
        //   icon: "ic-sp-loan-product.svg",
        // },
        {
          title: "Loan Against Property",
          description: "Up to ₹75L without ITR",
          redirection: `${crossSellUrl}/products/lap/login`,
          icon: "ic-lap-loan-product.svg",
        },
      ],
    },
    {
      title: "Save",
      icon: "ic-invest-selected.svg",
      links: [
        {
          title: "Moneyview Gold",
          description: "Buy 24K Gold from as low as ₹10",
          redirection: `${crossSellUrl}/products/digital-gold/login`,
          icon: "ic-gold-invest-product.svg",
        },
        {
          title: "FD Select",
          description: `Earn ${fdRate} from top-trending FDs`,
          redirection: `${mvSiteUrl}/fd-select/fixed-deposit`,
          icon: "ic-fd-invest-product.svg",
        },
      ],
    },
    {
      title: "Insure",
      icon: "ic-insure-selected.svg",
      links: [
        {
          title: "Vehicle Insurance",
          description: "Buy or renew bike and car insurance",
          redirection: `${crossSellUrl}/products/motor-insurance/login`,
          icon: "ic-vehicle-insure-product.svg",
        },
        // { title: "Health Insurance", description: "Ensure health safety", redirection: `${mvSiteUrl}#`, icon: "ic-homeLoan.webp" },
      ],
    },
    {
      title: "Track",
      icon: "ic-track-selected.svg",
      links: [
        {
          title: "Credit Tracker",
          description: "Free credit report with deeper insights",
          redirection: `${mvSiteUrl}/credit-score/login`,
          icon: "ic-ct-track-product.svg",
        },
        // { title: "Money Manager", description: "Keep a track of your spends", redirection: `${mvSiteUrl}/money-manager`, icon: "ic-mm-track-product.svg" },
      ],
    },
    // {
    //   title: "Pay",
    //   icon: "ic-mv-pay.svg",
    //   links: [
    //     {
    //       title: "Moneyview UPI",
    //       description: "Pay to any UPI app instantly",
    //       redirection: `${mvSiteUrl}/upi/upi-payments`,
    //       icon: "ic-upi-pay-product.svg",
    //     },
    //   ],
    // },
    {
      title: "Calculators",
      icon: "ic-calculators-selected.svg",
      links: [
        {
          title: "Personal Loan",
          redirection: `${mvSiteUrl}/emi-calculator/personal-loan-emi-calculator`,
        },
        {
          title: "Education Loan",
          redirection: `${mvSiteUrl}/emi-calculator/education-loan-emi-calculator`,
        },
        { title: "Bike Loan", redirection: `${mvSiteUrl}/emi-calculator/bike-loan-emi-calculator` },
        { title: "Car Loan", redirection: `${mvSiteUrl}/emi-calculator/car-loan-emi-calculator` },
        {
          title: "Business Loan",
          redirection: `${mvSiteUrl}/emi-calculator/business-loan-emi-calculator`,
        },
        { title: "Home Loan", redirection: `${mvSiteUrl}/emi-calculator/home-loan-emi-calculator` },
        {
          title: "Mortgage Loan",
          redirection: `${mvSiteUrl}/emi-calculator/mortgage-loan-emi-calculator`,
        },
        // { title: "Gold Loan", redirection: `${mvSiteUrl}/emi-calculator/gold-loan-emi-calculator` },
      ],
    },
  ];
};

export const getFooterModel = (mvSiteUrl: string, crossSellUrl: string) => {
  return {
    "THE COMPANY": [
      { title: "About", href: `${mvSiteUrl}/about-us` },
      { title: "Founding Member: DLAI", href: "https://www.dlai.in/", newTab: true },
      { title: "Security", href: `${mvSiteUrl}/security-money-view-app` },
      { title: "Careers", href: `${mvSiteUrl}/careers` },
    ],
    LOANS: [
      { title: "Personal Loan", href: `${mvSiteUrl}/personal-loan` },
      { title: "Business Loan", href: `${mvSiteUrl}/business-loan` },
      { title: "Home Loan", href: `${crossSellUrl}/products/home-loan/login` },
      { title: "Credit Card", href: `${crossSellUrl}/products/hdfc-cc/login` },
      // { title: "Smart Pay", href: `${mvSiteUrl}/smart-pay` },
      { title: "Loan Against Property", href: `${crossSellUrl}/products/lap/login` },
    ],
    SAVE: [
      { title: "24K Gold", href: `${crossSellUrl}/products/digital-gold/login` },
      { title: "FD Select", href: `${mvSiteUrl}/fd-select/fixed-deposit` },
    ],
    INSURE: [
      { title: "Vehicle Insurance", href: `${crossSellUrl}/products/motor-insurance/login` },
      // { title: "Health Insurance", href: "https://moneyview.in/products/health-insurance/login" },
    ],
    TRACK: [
      { title: "Credit Tracker", href: `${mvSiteUrl}/credit-score/login` },
      // { title: "Money Manager", href: "/credit-score/login" },
    ],
    // PAY: [
    //   { title: "Moneyier UPI", href: "/credit-score/login" },
    // ],
    PARTNERS: [
      { title: "Lending Partners", href: `${mvSiteUrl}/our-lending-partners` },
      { title: "Banking Partners", href: `${mvSiteUrl}/bank-partners` },
      { title: "Business Partners", href: `${mvSiteUrl}/business-partner` },
      { title: "Digital Lead Partners", href: `${mvSiteUrl}/digital-lead-partners` },
      { title: "Collection Agencies", href: `${mvSiteUrl}/debt-collection-agencies` },
    ],
    "GRIEVANCE REDRESSAL": [
      { title: "Loan Grievance Redressal", href: `${mvSiteUrl}/grievance` },
      { title: "Banking Grievance Redressal", href: `${mvSiteUrl}/banking-grievance-redressal` },
      // { title: "Pro Saver Grievance Redressal", href: "/pro-saver-banking-grievance-redressal" },
    ],
    RESOURCES: [
      { title: "Blogs", href: "https://moneyview.in/blog" },
      { title: "Media Coverage", href: `${mvSiteUrl}/media-coverages` },
    ],
    "CONTACT US": [
      { title: "care@moneyview.in", href: "mailto:care@moneyview.in" },
      { title: "080 6939 0476", href: "tel:+9108069390476" },
      { title: "Customer Support", href: `${mvSiteUrl}/contact-us` },
      // { title: "FAQs", href: "/credit-tracker-faq", newTab: true },
      { title: "FAQs", href: `${mvSiteUrl}/loans-faq-en`, newTab: true },
    ],
  };
};
