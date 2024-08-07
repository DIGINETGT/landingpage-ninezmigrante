// REACT
import React, { useState, useRef } from "react";

import { Box, Stack, Text, Image } from "@chakra-ui/react";

// COMPONENTS
import Gender from "../../../../../pages/country/components/statistics/components/gender";
import AgeRanges from "../../../../../pages/country/components/statistics/components/ageRanges";
import TravelCondition from "../../../../../pages/country/components/statistics/components/travelCondition";
import DownloadImage from "../../../../../components/downloadImage";
import GraphFooter from "../../../../../components/graphFooter";

// ASSETS
import MapaMexico from "../../../../../assets/MapaMexico.png";

// UTILS
import { year } from "../../../../../utils/year";
import LastDate from "../../../../../components/lastUpdate";
import YearSelect from "../../../../../components/yearSelect";
import MonthPicker from "../../../../../components/monthPicker";

import { useDetainedMexico } from "./hooks";
import { monthNames } from "../../../../../hooks/fetch";
import DownloadTable from "../../../../country/components/statistics/components/downloadTable";

const Mexico = () => {
  const [period, setPeriod] = useState([]);
  const [currentYear, setCurrentYear] = useState("");

  const [isScreenShotTime] = useState(false);
  const containerRef = useRef(null);

  const handleMonth = (range) => {
    setPeriod(range);
  };
  const handleYear = (ev) => setCurrentYear(ev.target.value);

  const { dataPerMonth, updateDate, files, loading } = useDetainedMexico({
    period,
    currentYear,
  });

  const sources = (
    <Stack
      width="100%"
      margin="auto"
      direction="column"
      alignItems="center"
      justifyContent="center"
      maxWidth={"800px"}
    >
      <a
        href="http://www.politicamigratoria.gob.mx/es/PoliticaMigratoria/Boletines_Estadisticos"
        target="_blank"
      >
        <Text
          textAlign="center"
          fontFamily="Oswald"
          fontSize={{ base: "xl", md: "2xl" }}
          maxWidth={"800px"}
        >
          Fuente: Secretaría de Gobernación/Unidad de Política Migratoria,
          Registro e Identidad de Personas. Gobierno de México.
        </Text>
      </a>
    </Stack>
  );

  return (
    <Box width="100%" padding={{ base: "24px 40px", md: "80px 40px" }}>
      {/* CONTAINER */}
      <Stack
        gap="24px"
        width="100%"
        margin="auto"
        maxWidth="1000px"
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        {/* SECTION HEADING  */}
        <Stack
          width="100%"
          alignItems="center"
          direction={{ base: "column", md: "row" }}
          justifyContent={{ base: "center", md: "space-between" }}
        >
          {/* YEAR AND TITLE */}
          <Stack width={{ base: "100%", md: "50%" }}>
            <Text fontFamily="Oswald" fontSize="2xl" lineHeight="1">
              {currentYear || year}
            </Text>
            <Text
              fontSize="4xl"
              fontFamily="Oswald"
              lineHeight={{ base: "1.2", md: "1" }}
            >
              REPORTADOS POR MÉXICO
            </Text>
          </Stack>

          {/* YEAR AND PERIOD SELECTS */}
          <Stack
            width={{ base: "100%", md: "50%" }}
            direction={{ base: "column", md: "row" }}
          >
            {/* SELECT YEAR */}
            <YearSelect handleYear={handleYear} currentYear={currentYear} />

            <MonthPicker onAccept={handleMonth} />
          </Stack>
        </Stack>

        {/* STATISTICS */}

        <Box ref={containerRef} padding="40px">
          <Stack
            gap="40px"
            width="100%"
            bgColor="#fff"
            padding="40px 24px"
            alignItems="center"
            borderRadius="12px"
            justifyContent="space-between"
            direction={{ base: "column", md: "row" }}
          >
            {/* COUNTRY MAP */}
            <Stack>
              <Image src={MapaMexico} maxWidth="240px" />
            </Stack>

            <Stack
              direction="column"
              alignItems={{ base: "center", md: "flex-start" }}
            >
              {/* TOTAL MONTH DATA */}
              <Stack direction="row" alignItems="center">
                <Text fontFamily="Oswald" fontSize="3xl" lineHeight="1">
                  {`Total ${
                    period?.[0] ? monthNames?.[period[0]] + " - " ?? "" : ""
                  } ${monthNames[period[1]] ?? ""}`}
                </Text>
                <Text fontFamily="Oswald" fontSize="4xl" lineHeight="1">
                  {dataPerMonth?.totalMes ?? "N/D"}
                </Text>
              </Stack>

              {/* GRAPHS */}
              <Stack
                gap="16px"
                padding="24px 0px"
                alignItems="flex-start"
                direction={{ base: "column", md: "row" }}
              >
                {/* GENDER COMPONENT */}
                <Gender
                  period={"enero - abril"}
                  year={"2020"}
                  skip
                  loading={loading}
                  defData={{
                    female: dataPerMonth?.female,
                    male: dataPerMonth?.male,
                  }}
                />

                {/* TRAVEL CONDITION COMPONENT */}
                <TravelCondition
                  period={"enero - abril"}
                  year={"2020"}
                  skip
                  loading={loading}
                  defData={{
                    acd: dataPerMonth?.acd,
                    noAcd: dataPerMonth?.noAcd,
                  }}
                />

                {/* AGE RANGES COMPONENT */}
                <AgeRanges
                  disableFirstAge
                  year={"2020"}
                  skip
                  loading={loading}
                  period={"enero - abril"}
                  defData={{
                    f2: dataPerMonth?.f2,
                    f3: dataPerMonth?.f3,
                  }}
                />
              </Stack>
            </Stack>
          </Stack>

          {/* SOURCES */}
          <LastDate
            sources={sources}
            updateDate={updateDate}
            isScreenShotTime={isScreenShotTime}
          />
          {isScreenShotTime && <GraphFooter responsive />}

          {!isScreenShotTime && (
            <DownloadTable files={files} satisticsRef={containerRef} />
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default Mexico;
