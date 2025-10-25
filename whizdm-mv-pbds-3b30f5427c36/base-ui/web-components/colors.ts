type ColorKeys = keyof typeof colors;

interface ColorsTypes extends Record<ColorKeys, string> {}

const colors = {
  "--primary-color": "#144835",
  "--white-color": "#ffffff",
  "--black-color": "#000000",
  "--black-ash": "#101012",

  "--green-lightest-2": "#e7f4ed",
  "--chalk-white": "#fafafa",
  "--blue-secondary-light": "#558fe5",
  "--black01": "#0000001A",
  "--black02": "#28292D",
  "--black03": "#34353A",
  "--orange00": "#efd9d7",
  "--orange01": "#ffe5db",
  "--orange05": "#ff7f4c",
  "--orange06": "#DE5E2B",
  "--orange07": "#F27A4A",
  "--yellow01": "#f59d33",
  "--magenta01": "#f5e4ff",
  "--magenta03": "#d8aaf3",
  "--magenta04": "#ca9ce5",
  "--magenta07": "#764891",
  "--magenta08": "#582A73",
  "--magenta10": "#e8e1ee",
  "--magenta11": "#EBD2FF",
  "--grey01": "#F6F6F6",
  "--grey02": "#ECECEC",
  "--grey03": "#D9D9D9",
  "--grey04": "#c6c6c6",
  "--grey05": "#b2b2b2",
  "--grey06": "#9f9f9f",
  "--grey07": "#7f7f7f",
  "--grey08": "#5e5e5e",
  "--grey09": "#202020",
  "--grey10": "#5E5E5E14",
  "--grey11": "#4D4F56",
  "--grey12": "#38393d",
  "--grey13": "#505259",
  "--grey14": "#73757A",
  "--grey15": "#B9BABD",
  "--green01": "#D7F4E9",
  "--green02": "#AFE9D4",
  "--green05": "#37c893",
  "--green07": "#217858",
  "--green06": "#2CA076",
  "--green10": "#BEF5C3",
  "--error01": "#d6273c",
  "--error02": "#d6273c",
} as const;

export default colors;

export const navbarColor: { [key: string]: string } = {
  "/": "#144835",
  "/personal-loan": "linear-gradient(109deg, #F0F8F3 37.69%, #FFF 86.94%)",
  "/prosaver": "linear-gradient(109deg, #E8E1EE 37.69%, #FFF 86.94%)",
  "/credit-score": "linear-gradient(109deg, rgba(255, 236, 228, 0.89) 37.69%, #FFF 86.94%)",
  "/business-loan": "linear-gradient(269deg, #D9E2DF 42.58%, #D9E2DF 43.45%)",
  "/smart-pay": "linear-gradient(109.47deg, rgba(20, 72, 53, 0.16) 37.69%, rgba(20, 72, 53, 0.08) 86.94%), #FFFFFF",
};
