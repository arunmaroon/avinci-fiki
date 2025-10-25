import React, { ReactNode, useEffect, useState } from "react";
import { TextField, TextFieldProps } from "@mvloans/base-ui.text-field";
import { useStyles } from "./style";
import { GroupCheckbox, GroupCheckboxProps } from "@mvloans/base-ui.grouped-checkbox";
import Dialog, { DialogProps } from "@mvloans/base-ui.dialog";

export type SelectDialogProps = {
  /**
   * Additional props for the TextField
   */
  textFieldProps?: TextFieldProps;
  testId?: string;
  /**
   * Additional props for the Dialog
   */
  dialogProps?: DialogProps & { persistent?: boolean; onOpen?: Function };
  selectedValue: string[];
  setSelectedValue: Function;
  options: GroupCheckboxProps["options"] | TextFieldProps["options"];

  maxSelectionAllowed: number;
  children?: ReactNode;

  groupCheckboxProps?: {
    classes?: GroupCheckboxProps["classes"];
    showDivider: boolean;
  };
};

interface Option {
  label: string;
  value: string;
}

const renderSelectedValues = (selected: string[], options: Option[]): string => {
  return options
    ?.filter((option) => selected.includes(option.value))
    .map((option) => option.label)
    .join(", ");
};

export function SelectDialog({
  options,
  textFieldProps,
  dialogProps,
  groupCheckboxProps,
  selectedValue,
  setSelectedValue,
  maxSelectionAllowed,
  children,
  testId,
}: SelectDialogProps) {
  const { classes } = useStyles();
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setOpenDialog(!!dialogProps?.open);
  }, [dialogProps?.open]);
  const maximumSelectionAllowed = maxSelectionAllowed ?? options?.length;

  const handleSelection = (e: any, value: any) => {
    let updatedValues = [...selectedValue];
    if (updatedValues.includes(value) && !e.target.checked) {
      updatedValues = updatedValues.filter((item) => item !== value);
    } else {
      updatedValues.push(value);
    }
    if (updatedValues.length > maximumSelectionAllowed) {
      updatedValues.shift();
    }
    setSelectedValue(updatedValues);
  };

  return (
    <div className={classes.root}>
      <div
        onClick={() => {
          setOpenDialog(true);
          dialogProps?.onOpen?.(true);
        }}
        data-testid={testId}
        className={classes.wrapper}></div>
      {textFieldProps && (
        <TextField
          value={selectedValue}
          className={classes.root}
          selectProps={{
            multiple: true,
            renderValue: (selected) => {
              return renderSelectedValues(selected as string[], options as Option[]);
            },
            hideOptions: true,
          }}
          onChange={(e) => setSelectedValue(e.target.value as string[])}
          options={options as TextFieldProps["options"]}
          {...textFieldProps}
        />
      )}
      <Dialog
        {...dialogProps}
        open={openDialog}
        onClose={() => {
          if (!dialogProps?.persistent) {
            setOpenDialog(false);
          }
          dialogProps?.onClose?.(false);
        }}>
        <GroupCheckbox
          value={selectedValue}
          title=""
          options={options as GroupCheckboxProps["options"]}
          id={"multiselect"}
          onChange={handleSelection}
          classes={groupCheckboxProps?.classes}
          showDivider={groupCheckboxProps?.showDivider}
        />
        <> {children}</>
      </Dialog>
    </div>
  );
}
