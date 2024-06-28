import React, { useState, useRef } from "react";

import { Box, Stack, Text, Image } from "@chakra-ui/react";

import DownloadImage from "../../../../../components/downloadImage";

import MapaEEUU from "../../../../../assets/MapaEEUU.png";

import { year } from "../../../../../utils/year";
import GraphFooter from "../../../../../components/graphFooter";
import LastDate from "../../../../../components/lastUpdate";
import YearSelect from "../../../../../components/yearSelect";
import MonthPicker from "../../../../../components/monthPicker";
import { useDetainedEEUU } from "./hooks";
import { monthNames } from "../../../../../hooks/fetch";

const EEUU = () => {
  const [currentYear, setCurrentYear] = useState("");
  const [isScreenShotTime, setIsScreenShotTime] = useState(false);
  const [period, setPeriod] = useState([]);

  const containerRef = useRef(null);

  const handleMonth = (period) => {
    setPeriod(period);
  };
  const handleYear = (ev) => setCurrentYear(ev.target.value);

  const { dataPerDeps, dataPerMonth, updateDate } = useDetainedEEUU({
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
      maxWidth="800px"
    >
      <a
        href="https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters-by-component"
        target="_blank"
      >
        <Text
          textAlign="center"
          fontFamily="Oswald"
          fontSize={{ base: "xl", md: "2xl" }}
          maxWidth="800px"
        >
          Fuente: U.S. CUSTOMS AND BORDER PATROL
        </Text>
      </a>
    </Stack>
  );

  return (
    <Box width="100%" padding="40px">
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
        {/* SECTION HEADING */}
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
              REPORTADOS POR EE.UU.
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
            borderRadius="12px"
            alignItems="center"
            justifyContent="space-between"
            direction={{ base: "column", md: "row" }}
          >
            {/* COUNTRY MAP */}
            <Stack>
              <Image src={MapaEEUU} maxWidth="240px" />
            </Stack>

            {/* TOTAL MONTH DATA */}
            <Stack>
              <Text fontFamily="Oswald" fontSize="3xl" lineHeight="1">
                {`Total ${monthNames[period[0]] + " - " ?? ""} ${
                  monthNames[period[1]] ?? ""
                }`}
              </Text>
              <Text fontFamily="Oswald" fontSize="3xl" lineHeight="1">
                {currentYear ?? ""}
              </Text>
              <Text fontFamily="Oswald" fontSize="6xl" lineHeight="1">
                {dataPerMonth?.totalMes ?? "0"}
              </Text>
            </Stack>

            {/* DATA BY BORDERS */}
            <Stack direction="row" spacing={7}>
              {Object.entries(dataPerDeps ?? {}).map(([key, value]) => {
                return (
                  <Stack>
                    <Text fontFamily="Oswald" fontSize="2xl" lineHeight="1">
                      {key === "noacm" ? "No Acompañados" : "Acompañados"}
                    </Text>

                    {Object.entries(value).map(([key2, value2]) => {
                      return (
                        <Stack direction="row">
                          <Text
                            fontFamily="Montserrat Medium"
                            fontSize="xl"
                            fontWeight={
                              key2.toLowerCase().includes("total")
                                ? "bold"
                                : "normal"
                            }
                          >
                            {key2}:
                          </Text>
                          <Text fontFamily="Montserrat Medium" fontSize="xl">
                            {value2}
                          </Text>
                        </Stack>
                      );
                    })}
                  </Stack>
                );
              })}
            </Stack>
          </Stack>

          {/* SOURCES */}
          <LastDate
            sources={sources}
            updateDate={updateDate}
            isScreenShotTime={isScreenShotTime}
          />
          {isScreenShotTime && <GraphFooter responsive />}

          <DownloadImage
            label=""
            containerRef={containerRef}
            onSS={setIsScreenShotTime}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default EEUU;
