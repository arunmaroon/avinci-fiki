import React, { useState } from "react";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import Button, { buttonVariantConstants } from "@mvloans/base-ui.button";
import { variantConstants } from "@mvloans/base-ui.common";
import TextField from "@mvloans/base-ui.text-field";
import { AlertCard } from "./alert-card";

export const BasicAlertCard = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const handleChange = (event: any) => {
    setValue(event.target.value);
  };
  const buttonConfig = [
    {
      variant: buttonVariantConstants.PRIMARY,
      btnText: "Continue",
      onClick: () => console.log("Continue Clicked"),
      size: variantConstants.BUTTONSMALL,
    },
    {
      variant: buttonVariantConstants.SUPPORT_SECONDARY,
      btnText: "Cancel",
      size: variantConstants.BUTTONSMALL,
    },
  ];
  return (
    <ThemeProvider>
      <Button variant={buttonVariantConstants.PRIMARY} onClick={() => setOpen(true)}>
        {"Click To Open"}
      </Button>
      <AlertCard
        open={open}
        title="Title"
        description="Description"
        buttonConfig={buttonConfig}
        onClose={(val) => {
          setOpen(val);
          setValue("");
        }}
        children={
          <TextField
            placeholder={"label"}
            disabled={false}
            error={false}
            value={value}
            maxRows={4}
            onChange={handleChange}
            maxLength={300}
            helperText={"Helper text"}
          />
        }
      />
    </ThemeProvider>
  );
};
export const BasicAlertCardWithImage = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const handleChange = (event: any) => {
    setValue(event.target.value);
  };

  const buttonConfig = [
    {
      variant: buttonVariantConstants.PRIMARY,
      btnText: "Continue",
      onClick: () => console.log("Continue Clicked"),
    },
    {
      variant: buttonVariantConstants.SUPPORT_SECONDARY,
      btnText: "Cancel",
    },
  ];
  return (
    <ThemeProvider>
      <Button variant={buttonVariantConstants.PRIMARY} onClick={() => setOpen(true)}>
        {"Click To Open"}
      </Button>
      <AlertCard
        iconName="ic-image-placeholder"
        open={open}
        title="Title"
        description="This is a short description"
        buttonConfig={buttonConfig}
        onClose={(val) => {
          setOpen(val);
          setValue("");
        }}
        children={
          <TextField
            placeholder={"label"}
            disabled={false}
            error={false}
            value={value}
            maxRows={4}
            onChange={handleChange}
            maxLength={300}
            helperText={"Helper text"}
          />
        }
      />
    </ThemeProvider>
  );
};
