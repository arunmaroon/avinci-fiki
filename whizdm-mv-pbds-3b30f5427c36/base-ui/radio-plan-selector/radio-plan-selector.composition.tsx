import React from "react";
import { RadioPlanSelector } from "./radio-plan-selector";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { Box } from "@mui/material";

export const BasicRadioPlanSelector = () => {
  const options = [
    {
      id: "8a8382d0906c466101906d5f634100a2",
      title: "₹3,552 X 4 months",
      subTitle: "Total interest: ₹205",
      value: "₹7,590",
      titleChild: "",
      content: [
        {
          label: "Downpayment",
          helper: "",
          value: "₹7,000",
        },
        {
          label: "Processing fee",
          helper: "(Inclusive of GST @18%)",
          value: "₹590",
        },
      ],
    },
    {
      id: "8a8382d0906c466101906d5f634100a0",
      title: "₹3,562 X 5 months",
      subTitle: "Total interest: ₹308",
      value: "₹4,090",
      titleChild: "",
      content: [
        {
          label: "Downpayment",
          helper: "",
          value: "₹3,500",
        },
        {
          label: "Processing fee",
          helper: "(Inclusive of GST @18%)",
          value: "₹590",
        },
      ],
    },
    {
      id: "8a8382d0906c466101906d5f6341009e",
      title: "₹3,500 X 6 months",
      subTitle: "",
      value: "₹ 0",
      titleChild: "",
      content: [
        {
          label: "Downpayment",
          helper: "",
          value: "₹ 0",
        },
        {
          label: "Processing fee",
          helper: "(Inclusive of GST @18%)",
          value: "₹ 0",
        },
      ],
    },
    {
      id: "8a8382d0906c466101906d5f6341009f",
      title: "₹3,334 X 6 months",
      subTitle: "",
      value: "₹1,590",
      titleChild: "",
      content: [
        {
          label: "Downpayment",
          helper: "",
          value: "₹1,000",
        },
        {
          label: "Processing fee",
          helper: "(Inclusive of GST @18%)",
          value: "₹590",
        },
      ],
    },
    {
      id: "8a8382d0906c466101906d5f634100a1",
      title: "₹3,394 X 6 months",
      subTitle: "Total interest: ₹409",
      value: "₹1,640",
      titleChild: "",
      content: [
        {
          label: "Downpayment",
          helper: "",
          value: "₹1,050",
        },
        {
          label: "Processing fee",
          helper: "(Inclusive of GST @18%)",
          value: "₹590",
        },
      ],
    },
    {
      id: "8a8382d0906c466101906d5f634100a6",
      title: "₹2,973 X 6 months",
      subTitle: "Total interest: ₹404",
      value: "₹4,156",
      titleChild: "",
      content: [
        {
          label: "Downpayment",
          helper: "",
          value: "₹3,566",
        },
        {
          label: "Processing fee",
          helper: "(Inclusive of GST @18%)",
          value: "₹590",
        },
      ],
    },
    {
      id: "8a8382d0906c466101906d5f6341009d",
      title: "₹1,567 X 14 months",
      subTitle: "Total interest: ₹931",
      value: "₹1,239",
      titleChild: "",
      content: [
        {
          label: "Downpayment",
          helper: "",
          value: "₹ 0",
        },
        {
          label: "Processing fee",
          helper: "(Inclusive of GST @18%)",
          value: "₹1,239",
        },
      ],
    },
    {
      id: "8a8382d0906c466101906d5f634100a3",
      title: "₹1,492 X 14 months",
      subTitle: "Total interest: ₹887",
      value: "₹1,590",
      titleChild: "",
      content: [
        {
          label: "Downpayment",
          helper: "",
          value: "₹1,000",
        },
        {
          label: "Processing fee",
          helper: "(Inclusive of GST @18%)",
          value: "₹590",
        },
      ],
    },
    {
      id: "8a8382d0906c466101906d5f634100a4",
      title: "₹1,489 X 14 months",
      subTitle: "Total interest: ₹883",
      value: "₹2,228",
      titleChild: "",
      content: [
        {
          label: "Downpayment",
          helper: "",
          value: "₹1,050",
        },
        {
          label: "Processing fee",
          helper: "(Inclusive of GST @18%)",
          value: "₹1,178",
        },
      ],
    },
    {
      id: "8a8382d0906c466101906d5f634100a5",
      title: "₹1,496 X 14 months",
      subTitle: "Total interest: ₹988",
      value: "₹2,228",
      titleChild: "",
      content: [
        {
          label: "Downpayment",
          helper: "",
          value: "₹1,050",
        },
        {
          label: "Processing fee",
          helper: "(Inclusive of GST @18%)",
          value: "₹1,178",
        },
      ],
    },
  ];
  return (
    <Box sx={{ width: { xs: 312, md: 480 } }}>
      <ThemeProvider>
        <RadioPlanSelector options={options} />
      </ThemeProvider>
    </Box>
  );
};
