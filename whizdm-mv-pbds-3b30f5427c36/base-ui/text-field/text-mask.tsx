import React, { useMemo } from "react";
import MaskedInput from "react-text-mask";

export type TextMaskProps = {
  inputRef: React.ReactNode;
  maskType: keyof typeof maskConfig;
  last4digits: string;
};

const maskConfig = {
  date: {
    // DD/MM/YYYY
    mask: [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/],
    placeholderChar: "_",
    guide: false,
  },
  //____ ____ ____
  aadhaar: {
    mask: [/\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/, " "],
    placeholderChar: "_",
    guide: true,
  },
};

const TextMask = React.forwardRef<any, any>(function TextMask(props: TextMaskProps, inputRef) {
  const { maskType, last4digits, ...other } = props;

  let updatedMaskConfig = useMemo(() => {
    if (last4digits) {
      let last4digitsArray: string[] = last4digits.split("");
      let copyMaskConfig = { ...maskConfig };
      copyMaskConfig.aadhaar = { ...copyMaskConfig.aadhaar, mask: maskConfig.aadhaar.mask.concat(last4digitsArray) };
      return copyMaskConfig;
    }
    return maskConfig;
  }, [last4digits]);

  const { guide, mask, placeholderChar } = updatedMaskConfig[maskType];
  return (
    <MaskedInput
      {...other}
      guide={guide}
      mask={mask}
      keepCharPositions={true}
      showMask
      placeholderChar={placeholderChar}
      ref={(ref: any) => {
        // @ts-ignore
        inputRef(ref ? ref.inputElement : null);
      }}
    />
  );
});

export default TextMask;
