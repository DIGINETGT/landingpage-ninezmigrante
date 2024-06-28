import { Stack, Image } from "@chakra-ui/react";
import React from "react";
import { colors } from "../../../../../../../utils/theme";

// ASSETS

import GroupedChartIcon from "../../../../../../../assets/chart-stacked.svg";
import AreaChartIcon from "../../../../../../../assets/area-chart.svg";
import BarChartIcon from "../../../../../../../assets/bar-chart.svg";

import ConditionIcon from "../../../../../../../assets/charts/condicion.svg";
import AgeGroupIcon from "../../../../../../../assets/charts/edad.svg";
import GenderIcon from "../../../../../../../assets/charts/genero.svg";
import CountryIcon from "../../../../../../../assets/charts/pais.svg";
import ViaIcon from "../../../../../../../assets/charts/via.svg";

export const itemColors = [
  "rgba(51, 132, 169, 0.5)",
  "rgba(117, 184, 65, 0.5)",
  "rgba(226, 175, 29, 0.5)",
  "rgba(0,0, 0, 0.7)",
];

export const defaultItemColors = [
  colors.blue[700],
  colors.green[700],
  colors.yellow[700],
  "#555",
];

export const graphDataTypes = {
  condition: "Condicion de Viaje",
  return: "Pais de Retorno",
  via: "Via de Retorno",
  age: "Rango Etario",
  gender: "Sexo",
};

export const customPeriods = [
  "Año en curso",
  "Ultimos 4 meses",
  "Ultimos 3 años",
];
export const customDataTypes = [
  {
    id: "gender",
    name: "Sexo",
    Content: (
      <Stack
        height="100%"
        direction="column"
        alignItems="center"
        justifyContent="center"
        transition="transform 0.2s ease-in-out"
        _hover={{ transform: "scale(1.1)" }}
      >
        <Image src={GenderIcon} height="55px" />
      </Stack>
    ),
  },
  {
    id: "via",
    name: "Via de retorno",
    Content: (
      <Stack
        height="100%"
        direction="column"
        alignItems="center"
        justifyContent="center"
        transition="transform 0.2s ease-in-out"
        _hover={{ transform: "scale(1.1)" }}
      >
        <Image src={ViaIcon} height="55px" />
      </Stack>
    ),
  },
  {
    id: "condition",
    name: "Condicion de viaje",
    Content: (
      <Stack
        height="100%"
        direction="column"
        alignItems="center"
        justifyContent="center"
        transition="transform 0.2s ease-in-out"
        _hover={{ transform: "scale(1.1)" }}
      >
        <Image src={ConditionIcon} height="55px" />
      </Stack>
    ),
  },
  {
    id: "return",
    name: "Pais de retorno",
    Content: (
      <Stack
        height="100%"
        direction="column"
        alignItems="center"
        justifyContent="center"
        transition="transform 0.2s ease-in-out"
        _hover={{ transform: "scale(1.1)" }}
      >
        <Image src={CountryIcon} height="55px" />
      </Stack>
    ),
  },
  {
    id: "age",
    name: "Rango etario",
    Content: (
      <Stack
        height="100%"
        direction="column"
        alignItems="center"
        justifyContent="center"
        transition="transform 0.2s ease-in-out"
        _hover={{ transform: "scale(1.1)" }}
      >
        <Image src={AgeGroupIcon} height="55px" />
      </Stack>
    ),
  },
];

export const customDataChart = [
  {
    id: "bar",
    name: "Barras",
    Content: (
      <Image
        transition="transform 0.2s ease-in-out"
        _hover={{ transform: "scale(1.1)" }}
        src={BarChartIcon}
        height="55px"
      />
    ),
  },
  {
    id: "area",
    name: "Área",
    Content: (
      <Image
        transition="transform 0.2s ease-in-out"
        _hover={{ transform: "scale(1.1)" }}
        src={AreaChartIcon}
        height="55px"
      />
    ),
  },
  {
    id: "group",
    name: "Agrupado",
    Content: (
      <Image
        transition="transform 0.2s ease-in-out"
        _hover={{ transform: "scale(1.1)" }}
        src={GroupedChartIcon}
        height="55px"
      />
    ),
  },
];

export const datasetLabels = {
  gender: ["Femenino", "Masculino"],
  age: ["Primera infancia", "Niñez", "Adolescencia", "No registrado"],
  via: ["Terrestre", "Aérea"],
  condition: ["Acompañado", "No acompañado"],
  return: ["Estados Unidos", "México", "Canada"],
};
