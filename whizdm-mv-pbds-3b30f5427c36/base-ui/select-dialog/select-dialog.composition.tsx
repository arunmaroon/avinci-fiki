import React, { useState } from "react";
import { SelectDialog } from "./select-dialog";
import { ThemeProvider } from "@mvloans/base-ui.theme-provider";
import { Box } from "@mui/material";
import { buttonVariantConstants } from "@mvloans/base-ui.button";

export const BasicSelectDialog = () => {
  const [selectedValue, setSelectedValue] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = useState(true);
  const handleDialogSaveClick = () => {
    setOpenDialog(false);
  };
  const dialogButtonConfig = [
    {
      variant: buttonVariantConstants.PRIMARY,
      btnText: "Save",
      onClick: () => handleDialogSaveClick(),
      "data-testid": "BasicSelectDialogButton",
    },
  ];
  const options = [
    { label: "Option2", value: "value2" },
    { label: "Option3", value: "value3" },
    { label: "Option4", value: "value4" },
    { label: "Option5", value: "value5" },
    { label: "Option6", value: "value6" },
  ];
  return (
    <Box sx={{ width: { xs: 360, md: 312 } }}>
      <ThemeProvider>
        <SelectDialog
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          options={options}
          testId="BasicSelectDialog"
          dialogProps={{
            open: openDialog,
            showFullScreen: true,
            closeIcon: true,
            onClose: () => setOpenDialog(false),
            title: "Title",
            subTitle: "Sub Title",
            buttonConfig: dialogButtonConfig,
          }}
          textFieldProps={{ label: "Label", placeholder: "Placeholder", error: false, disabled: false, autoFocus: false }}
          maxSelectionAllowed={3}></SelectDialog>
      </ThemeProvider>
    </Box>
  );
};
