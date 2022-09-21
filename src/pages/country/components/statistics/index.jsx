import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { Box, Stack, Text, Divider } from "@chakra-ui/react";

import GraphFooter from "../../../../components/graphFooter";
import TravelCondition from "./components/travelCondition";
import ReturnCountry from "./components/returnCountry";
import DownloadTable from "./components/downloadTable";
import HeatMap from "./components/heatMap/index";
import ReturnPath from "./components/returnPath";
import AgeRanges from "./components/ageRanges";
import Gender from "./components/gender";

import useFetch, { quarters } from "../../../../hooks/fetch";

const Statistics = ({ period, year, satisticsRef }) => {
  // STATES
  const { countryID } = useParams();
  const [total, setTotal] = useState(0);
  const [periodId, setPeriodId] = useState("");
  const [departments, setDepartments] = useState([]);

  // OBTENER TOTAL POR PERIODO
  useFetch({
    url: "/consultas/totalporpaisanioperiodo/country/year/quarter",
    year,
    period,
    country: countryID,
    resolve: (data) => {
      const periodData = data?.data?.[0];
      setPeriodId(periodData?._id ?? "");
      setTotal(periodData?.totalRegistros ?? 0);
    },
  });

  // OBTENER TOTAL POR DEPARTAMENTO
  useFetch({
    url: "/consultas/totalpordepartamento/country/year/quarter",
    year,
    period,
    country: countryID,
    resolve: (data) => {
      const filteredData = data.data.map((department) => ({
        ...department,
        name: department._id.replace("Department", "").toUpperCase(),
      }));
      setDepartments(filteredData.sort((a, b) => b.total - a.total));
    },
  });

  return (
    <>
      <Box
        ref={satisticsRef}
        padding={{ base: "40px 24px", md: "80px 40px" }}
        bgColor="#eee"
      >
        <Stack
          margin="auto"
          maxWidth="800px"
          alignItems="center"
          justifyContent="space-between"
          gap={{ base: "24px", md: "40px" }}
          direction={{ base: "column", md: "row" }}
          marginBottom={{ base: "40px", md: "80px" }}
        >
          <Stack direction="column" spacing="16px">
            <Text
              lineHeight="1"
              fontFamily="Oswald"
              fontSize={{ base: "4xl", md: "6xl" }}
              textAlign={{ base: "center", md: "left" }}
            >
              {countryID === "guatemala" ? "GUATEMALA" : "HONDURAS"}
            </Text>
            <Text
              lineHeight="1"
              fontFamily="Oswald"
              fontSize={{ base: "2xl", md: "4xl" }}
              textAlign={{ base: "center", md: "left" }}
            >
              Total de niñez migrante retornanda
            </Text>
            <Text
              lineHeight="1"
              fontWeight="600"
              fontFamily="Times"
              fontSize={{ base: "xl", md: "2xl" }}
              textAlign={{ base: "center", md: "left" }}
            >
              {`${quarters[period] ?? ""} ${year ?? ""}`}
            </Text>
          </Stack>
          <Text
            fontFamily="Oswald"
            fontSize={{ base: "7xl", md: "8xl" }}
            lineHeight="1"
          >
            {total}
          </Text>
        </Stack>
        <Stack
          gap="40px"
          width="100%"
          margin="auto"
          maxWidth="800px"
          justifyContent="space-between"
          direction={{ base: "column", md: "row" }}
          marginBottom={{ base: "40px", md: "60px" }}
          alignItems={{ base: "center", md: "flex-start" }}
        >
          <Gender period={period} year={year} />
          <TravelCondition period={period} year={year} />
          <AgeRanges period={period} year={year} />
        </Stack>

        <Stack
          width="100%"
          margin="auto"
          maxWidth="800px"
          justifyContent="center"
          gap={{ base: "40px", md: "40px" }}
          direction={{ base: "column", md: "row" }}
          marginBottom={{ base: "40px", md: "60px" }}
          alignItems={{ base: "center", md: "flex-start" }}
        >
          <ReturnPath period={period} year={year} />
          <ReturnCountry period={period} year={year} />
        </Stack>

        <Divider
          maxWidth="800px"
          borderWidth="1px"
          margin="40px auto"
          borderColor="black"
          orientation="horizontal"
        />

        <Stack
          spacing={8}
          width="100%"
          margin="auto"
          maxWidth="800px"
          alignItems="center"
          marginBottom="40px"
          justifyContent="center"
          direction={{ base: "column", md: "row" }}
        >
          <HeatMap period={period} year={year} />
          <Stack direction="column" spacing={4}>
            {departments.map((department) => (
              <Stack
                spacing={8}
                direction="row"
                key={department._id}
                justifyContent="space-between"
              >
                <Text fontFamily="Montserrat Medium" key={department.name}>
                  {department.name}
                </Text>
                <Text fontFamily="Montserrat Medium" key={department.name}>
                  {department.total}
                </Text>
              </Stack>
            ))}
          </Stack>
        </Stack>

        <GraphFooter countryID={countryID} />

        <DownloadTable
          satisticsRef={satisticsRef}
          periodId={periodId}
          tableState
        />
      </Box>
    </>
  );
};

export default Statistics;
