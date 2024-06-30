import { extendTheme } from "@chakra-ui/react";

export const colors = {
  blue: {
    500: "#CAD7D8",
    700: "#3384A9",
  },
  heat: {
    gt: {
      100: "#6b8695",
      200: "#96afbc",
      300: "#bac6ce",
      400: "#afc5ae",
      500: "#cedec4",
      600: "#c9dbb6",
      700: "#b6d196",
      800: "#9bc265",
      900: "#92bd57",
    },
    hn: {
      100: "#507986",
      200: "#78a1ae",
      300: "#9eb7c0",
      400: "#d4d6d4",
      500: "#b4b1b0",
      600: "#e2d8af",
      700: "#e2cf8b",
      800: "#dec466",
      900: "#ddb841",
    },
    sv: {
      100: "#2f4872",
      200: "#3b577f",
      300: "#46678c",
      400: "#53769a",
      500: "#6086a7",
      600: "#6c95b5",
      700: "#79a5c3",
      800: "#86b4d0",
      900: "#93c4dd",
    }
  },
  heatMin: {
    100: "#cad7d8",
  },
  green: {
    500: "#85c355",
    700: "#75b841",
  },
  gray: {
    500: "#929697",
  },
  yellow: {
    500: "#e2af1d",
    700: "#e2af1d",
  },
};

export const theme = extendTheme({ colors });
