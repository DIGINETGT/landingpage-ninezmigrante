import React, { useState } from "react";

import { Stack, Text } from "@chakra-ui/react";

import Gender from "../../../country/components/statistics/components/gender";
import AgeRanges from "../../../country/components/statistics/components/ageRanges";
import TravelCondition from "../../../country/components/statistics/components/travelCondition";
import ReturnPath from "../../../country/components/statistics/components/returnPath";
import ReturnCountry from "../../../country/components/statistics/components/returnCountry";
import HeatMap from "../../../country/components/statistics/components/heatMap";

import {
  GET_RETURNEDS,
  GET_RETURNEDS_BY_COUNTRY,
} from "../../../../utils/query/returned";

import { monthNames } from "../../../../hooks/fetch";
import { isMonthInRange } from "../../../../utils/tools";
import { useQuery } from "@apollo/client";

const Statistics = ({ data }) => {
  const { data: dataReturned } = useQuery(
    GET_RETURNEDS_BY_COUNTRY(data.country)
  );

  const returneds = dataReturned?.monthlyReports?.data?.filter((report) => {
    const [reportYear, reportMonth] =
      report?.attributes?.reportMonth.split("-");

    return (
      isMonthInRange(+reportMonth, data.period) &&
      reportYear?.toString() === data?.year?.toString()
    );
  });

  const totalAmount = returneds?.reduce(
    (acc, returned) =>
      acc + +(returned?.attributes?.returned?.data?.attributes?.total ?? 0),
    0
  );

  return (
    <Stack spacing="40px">
      <Stack
        spacing="16px"
        alignItems="center"
        justifyContent="center"
        direction={{ base: "column", md: "column" }}
      >
        <Text
          lineHeight="1"
          fontFamily="Oswald"
          textAlign="center"
          fontSize={{ base: "4xl", md: "6xl" }}
        >
          {data.country === "guatemala" && "GUATEMALA"}
          {data.country === "honduras" && "HONDURAS"}
          {data.country === "elsalvador" && "EL SALVADOR"}
        </Text>
        <Text
          lineHeight="1"
          fontSize="2xl"
          textAlign="center"
          fontFamily="Oswald"
        >
          Total de niñez migrante retornanda
        </Text>
        <Text
          fontSize="xl"
          lineHeight="1"
          fontWeight="600"
          fontFamily="Times"
          textAlign={{ base: "center", md: "left" }}
        >
          {`${monthNames[data.period[0]]} - ${monthNames[data.period[1]]} - ${
            data.year ?? ""
          }`}
        </Text>
        <Text
          fontFamily="Oswald"
          fontSize={{ base: "6xl", md: "7xl" }}
          lineHeight="1"
        >
          {totalAmount}
        </Text>
      </Stack>

      <Gender {...data} />
      <TravelCondition {...data} />
      <AgeRanges {...data} />
      <ReturnPath {...data} />
      <ReturnCountry {...data} />
      <HeatMap {...data} />
    </Stack>
  );
};

export default Statistics;
