// REACT
import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";

// CHAKRA UI COMPONENTS
import { Box, Stack, Text, Image, Select, border } from "@chakra-ui/react";

// COMPONENTS
import DownloadImage from "../../../../../components/downloadImage";

// ASSETS
import MapaEEUU from "../../../../../assets/MapaEEUU.png";

// UTILS
import { year } from "../../../../../utils/year";
import GraphFooter from "../../../../../components/graphFooter";
import LastDate from "../../../../../components/lastUpdate";
import YearSelect from "../../../../../components/yearSelect";
import MonthPicker from "../../../../../components/monthPicker";
import {
  GET_DETAINED_IN_BORDERDS,
  GET_DETAINED_US_BORDERDS_BY_COUNTRY,
} from "../../../../../utils/query/returned";
import { useQuery } from "@apollo/client";
import { isMonthInRange } from "../../../../../utils/tools";

const excludeFields = [
  "id",
  "total",
  "totalNoAcompaniados",
  "totalAcompaniados",
  "anio",
  "createdAt",
  "updatedAt",
  "__typename",
];

const countyMapping = {
  sanDiego: "San Diego",
  elCentro: "El Centro",
  yuma: "Yuma",
  tucson: "Tucson",
  elPaso: "El Paso",
  bigBend: "Big Bend",
  delRio: "Del Rio",
  laredo: "Laredo",
  rioGrande: "Rio Grande",
  default: "Otros",
};

const EEUU = () => {
  const [currentYear, setCurrentYear] = useState("");
  const [isScreenShotTime, setIsScreenShotTime] = useState(false);
  const [period, setPeriod] = useState([]);

  const { countryID } = useParams();
  const containerRef = useRef(null);

  const handleMonth = (period) => {
    setPeriod(period);
  };
  const handleYear = (ev) => setCurrentYear(ev.target.value);

  const { data: dataBorder } = useQuery(GET_DETAINED_US_BORDERDS_BY_COUNTRY);

  // OBTENER DATOS
  const bordersData = dataBorder?.detainedInBordersReports?.data;

  const dataPerMonth = {
    totalMes: 0,
  };

  const dataPerDeps = { acm: {}, noacm: {} };
  let updateDate = "";
  const filteredData = bordersData?.filter((report) => {
    const [reportYear, reportMonth] = report.attributes?.reportDate
      .split("-")
      .map(Number);

    updateDate = new Date(report?.attributes?.updatedAt ?? "0")?.toLocaleString(
      "en-Gb"
    );

    if (
      !isMonthInRange(reportMonth, period) ||
      reportYear?.toString() !== currentYear?.toString()
    ) {
      return false;
    }

    // BY MEXICO
    const countryName = report?.attributes?.country?.data?.attributes?.name;

    if (countryName?.toLowerCase().replace(/\s+/g, "") !== "estadosunidos")
      return false;

    return (
      report.attributes?.users_permissions_user?.data?.attributes?.organization?.data?.attributes?.department?.data?.attributes?.country?.data?.attributes?.name
        ?.toLowerCase()
        .replace(/\s+/g, "") === countryID?.toLowerCase().replace(/\s+/g, "")
    );
  });

  filteredData?.forEach((element) => {
    const total = element?.attributes?.detained_us_borders?.data?.reduce(
      (acc, curr) => {
        return acc + curr?.attributes?.total;
      },
      0
    );

    console.log(element?.attributes?.detained_us_borders?.data);

    element?.attributes?.detained_us_borders?.data?.forEach((dep) => {
      Object.keys(dep.attributes)
        .filter((key) => !excludeFields.includes(key))
        .forEach((key) => {
          const isNoAcomp = key.toLowerCase().includes("noacompaniados")
            ? "noacm"
            : "acm";

          console.log(key);

          const countryName =
            countyMapping[
              key?.replace("NoAcompaniados", "").replace("Acompaniados", "") ||
                "default"
            ] || countyMapping.default;

          if (!dataPerDeps.acm[countryName])
            dataPerDeps.acm = {
              ...dataPerDeps.acm,
              [countryName]: 0,
            };

          if (!dataPerDeps.noacm[countryName])
            dataPerDeps.noacm = {
              ...dataPerDeps.noacm,
              [countryName]: 0,
            };

          dataPerDeps[isNoAcomp][countryName] += dep.attributes[key];
        });
    });

    dataPerMonth.totalMes += total;
  });

  console.log({ dataPerDeps });

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
            alignItems="flex-start"
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
                {"Mes"}
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
                          <Text fontFamily="Montserrat Medium" fontSize="xl">
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
