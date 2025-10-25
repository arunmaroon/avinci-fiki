import React from "react";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { Faq } from "./faq";

export const FaqAccordion = () => {
  return (
    <ThemeProvider>
      <Box sx={{ width: 312 }}>
        <Faq
          id={"faq-accordion"}
          label={"Q. Who is eligible to apply for a loan on the Money View app?"}
          description={`A. You can get an instant loan on Money View without any paperwork by following these steps: Complete and submit your loan
          application on the app. Once you've submitted your loan application, we'll go throught your documents and assess your
          creditworthiness along with the other important details on your application. Post the verification process, we’ll send you a
          NACH form, which you're required to print, sing on, scan, and send back to us. This NACH form is to enable the auto debit
          facility for your bank account so you can pay your EMIs on time automatically. On recieving your NACH form, we’ll send you a
          loan agreement on the app. You'll need to review and submit the agreement. Post this, your loan amount will be credited into
          your bank account in a few hours.`}></Faq>
      </Box>
    </ThemeProvider>
  );
};

export const FirstFaqAccordion = () => {
  return (
    <ThemeProvider>
      <Box sx={{ width: 312 }}>
        <Faq
          id={"first-faq-accordion"}
          label={"Q. Who is eligible to apply for a loan on the Money View app?"}
          isFirstFaq={true}
          description={`A. You can get an instant loan on Money View without any paperwork by following these steps: Complete and submit your loan
          application on the app. Once you've submitted your loan application, we'll go throught your documents and assess your
          creditworthiness along with the other important details on your application. Post the verification process, we’ll send you a
          NACH form, which you're required to print, sing on, scan, and send back to us. This NACH form is to enable the auto debit
          facility for your bank account so you can pay your EMIs on time automatically. On recieving your NACH form, we’ll send you a
          loan agreement on the app. You'll need to review and submit the agreement. Post this, your loan amount will be credited into
          your bank account in a few hours.`}></Faq>
      </Box>
    </ThemeProvider>
  );
};

export const LastFaqAccordion = () => {
  return (
    <ThemeProvider>
      <Box sx={{ width: 312 }}>
        <Faq
          id={"last-faq-accordion"}
          label={"Q. Who is eligible to apply for a loan on the Money View app?"}
          isLastFaq={true}
          description={`A. You can get an instant loan on Money View without any paperwork by following these steps: Complete and submit your loan
          application on the app. Once you've submitted your loan application, we'll go throught your documents and assess your
          creditworthiness along with the other important details on your application. Post the verification process, we’ll send you a
          NACH form, which you're required to print, sing on, scan, and send back to us. This NACH form is to enable the auto debit
          facility for your bank account so you can pay your EMIs on time automatically. On recieving your NACH form, we’ll send you a
          loan agreement on the app. You'll need to review and submit the agreement. Post this, your loan amount will be credited into
          your bank account in a few hours.`}></Faq>
      </Box>
    </ThemeProvider>
  );
};

export const DisabledFaqAccordion = () => {
  return (
    <ThemeProvider>
      <Box sx={{ width: 312 }}>
        <Faq
          id={"disabled-faq-accordion"}
          disabled={true}
          label={"Q. Who is eligible to apply for a loan on the Money View app?"}
          description={`A. You can get an instant loan on Money View without any paperwork by following these steps: Complete and submit your loan
          application on the app. Once you've submitted your loan application, we'll go throught your documents and assess your
          creditworthiness along with the other important details on your application. Post the verification process, we’ll send you a
          NACH form, which you're required to print, sing on, scan, and send back to us. This NACH form is to enable the auto debit
          facility for your bank account so you can pay your EMIs on time automatically. On recieving your NACH form, we’ll send you a
          loan agreement on the app. You'll need to review and submit the agreement. Post this, your loan amount will be credited into
          your bank account in a few hours.`}></Faq>
      </Box>
    </ThemeProvider>
  );
};

export const ExpandedFaqAccordion = () => {
  return (
    <ThemeProvider>
      <Box sx={{ width: 312 }}>
        <Faq
          id={"expanded-faq-accordion"}
          expanded={true}
          label={"Q. Who is eligible to apply for a loan on the Money View app?"}
          description={`A. You can get an instant loan on Money View without any paperwork by following these steps: Complete and submit your loan
          application on the app. Once you've submitted your loan application, we'll go throught your documents and assess your
          creditworthiness along with the other important details on your application. Post the verification process, we’ll send you a
          NACH form, which you're required to print, sing on, scan, and send back to us. This NACH form is to enable the auto debit
          facility for your bank account so you can pay your EMIs on time automatically. On recieving your NACH form, we’ll send you a
          loan agreement on the app. You'll need to review and submit the agreement. Post this, your loan amount will be credited into
          your bank account in a few hours.`}></Faq>
      </Box>
    </ThemeProvider>
  );
};