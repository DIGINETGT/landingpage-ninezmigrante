import React, { useState, useEffect } from "react";

import { Stack, Text } from "@chakra-ui/react";

import Gender from "../../../country/components/statistics/components/gender";
import AgeRanges from "../../../country/components/statistics/components/ageRanges";
import TravelCondition from "../../../country/components/statistics/components/travelCondition";
import ReturnPath from "../../../country/components/statistics/components/returnPath";
import ReturnCountry from "../../../country/components/statistics/components/returnCountry";
import HeatMap from "../../../country/components/statistics/components/heatMap";

import useFetch, { monthNames } from "../../../../hooks/fetch";

const Statistics = ({ data, setUpdateDate, setPeriodId }) => {
  const [total, setTotal] = useState(0);

  useFetch({
    url: "/consultas/totalporpaisanioperiodo/country?anio=selectedYear&periodRange",
    year: data.year,
    periodStart: data.period[0],
    periodEnd: data.period[1],
    country: data.country,
    resolve: (resData) => {
      const lastData = resData?.data?.[resData?.data?.length - 1];
      const lastDate = lastData?._id["Fecha de actualización"];
      const uDate = new Date(lastDate);

      setPeriodId(lastData?._id?._id);
      setUpdateDate(
        `${uDate.getDate()} de ${monthNames[
          uDate.getMonth() + 1
        ]?.toLowerCase()} del ${uDate.getFullYear()}`
      );

      const total = resData?.data?.reduce(
        (acc, item) => acc + (item?.total ?? 0),
        0
      );
      setTotal(total);
    },
  });

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
          {total}
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
