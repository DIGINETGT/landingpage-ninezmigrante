// REACT
import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";

// CHAKRA UI COMPONENTS
import {
  Box,
  Stack,
  Text,
  Image,
  Select,
  StackDivider,
} from "@chakra-ui/react";

// COMPONENTS
import Gender from "../../../../../pages/country/components/statistics/components/gender";
import AgeRanges from "../../../../../pages/country/components/statistics/components/ageRanges";
import TravelCondition from "../../../../../pages/country/components/statistics/components/travelCondition";
import DownloadImage from "../../../../../components/downloadImage";
import GraphFooter from "../../../../../components/graphFooter";

// ASSETS
import MapaMexico from "../../../../../assets/MapaMexico.png";

// HOOKS
import { monthNames } from "../../../../../hooks/fetch";

// UTILS
import { year } from "../../../../../utils/year";
import LastDate from "../../../../../components/lastUpdate";
import YearSelect from "../../../../../components/yearSelect";
import MonthPicker from "../../../../../components/monthPicker";
import { useQuery } from "@apollo/client";
import {
  GET_DETAINED_IN_BORDERDS,
  GET_DETAINED_IN_BORDERDS_BY_COUNTRY,
} from "../../../../../utils/query/returned";
import { isMonthInRange } from "../../../../../utils/tools";

const Mexico = () => {
  const [period, setPeriod] = useState([]);
  const [currentYear, setCurrentYear] = useState("");

  const [isScreenShotTime, setIsScreenShotTime] = useState(false);
  const containerRef = useRef(null);

  const { countryID } = useParams();

  const handleMonth = (range) => {
    setPeriod(range);
  };
  const handleYear = (ev) => setCurrentYear(ev.target.value);

  const { data: dataBorder } = useQuery(GET_DETAINED_IN_BORDERDS_BY_COUNTRY);

  // OBTENER DATOS
  const bordersData = dataBorder?.detainedInBordersReports?.data;

  let updateDate = "";
  const dataPerMonth = {
    totalMes: 0,
    female: 0,
    male: 0,
    acd: 0,
    noAcd: 0,
    f2: 0,
    f3: 0,
  };
  bordersData
    ?.filter((report) => {
      const [reportYear, reportMonth] = report.attributes?.reportDate
        .split("-")
        .map(Number);

      updateDate = new Date(
        report?.attributes?.updatedAt ?? "0"
      )?.toLocaleString("en-Gb");

      if (
        !isMonthInRange(reportMonth, period) ||
        reportYear?.toString() !== currentYear?.toString()
      ) {
        return false;
      }

      // BY MEXICO
      const countryName = report?.attributes?.country?.data?.attributes?.name;
      if (countryName?.toLowerCase().replace(/\s+/g, "") !== "méxico")
        return false;

      return (
        report.attributes?.users_permissions_user?.data?.attributes?.organization?.data?.attributes?.department?.data?.attributes?.country?.data?.attributes?.name
          ?.toLowerCase()
          .replace(/\s+/g, "") === countryID?.toLowerCase().replace(/\s+/g, "")
      );
    })
    .forEach((element) => {
      const total = element?.attributes?.detained_in_borders?.data?.reduce(
        (acc, curr) => {
          return acc + curr?.attributes?.total;
        },
        0
      );

      dataPerMonth.female +=
        element?.attributes?.detained_in_borders?.data?.reduce(
          (acc, curr) => acc + curr?.attributes?.femenino,
          0
        );
      dataPerMonth.male =
        element?.attributes?.detained_in_borders?.data?.reduce(
          (acc, curr) => acc + curr?.attributes?.masculino,
          0
        );
      dataPerMonth.acd = element?.attributes?.detained_in_borders?.data?.reduce(
        (acc, curr) => acc + curr?.attributes?.acompaniados,
        0
      );
      dataPerMonth.noAcd =
        element?.attributes?.detained_in_borders?.data?.reduce(
          (acc, curr) => acc + curr?.attributes?.noAcompaniados,
          0
        );
      dataPerMonth.f2 = element?.attributes?.detained_in_borders?.data?.reduce(
        (acc, curr) => acc + curr?.attributes?.ninos,
        0
      );
      dataPerMonth.f3 = element?.attributes?.detained_in_borders?.data?.reduce(
        (acc, curr) => acc + curr?.attributes?.adolescentes,
        0
      );

      dataPerMonth.totalMes += total;
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
                  {"Mes"}
                </Text>
                <Text fontFamily="Oswald" fontSize="4xl" lineHeight="1">
                  {dataPerMonth?.totalMes ?? "0"}
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
                  defData={{
                    female: dataPerMonth?.female,
                    male: dataPerMonth?.male,
                  }}
                />

                {/* TRAVEL CONDITION COMPONENT */}
                <TravelCondition
                  period={"enero - abril"}
                  year={"2020"}
                  defData={{
                    acd: dataPerMonth?.acd,
                    noAcd: dataPerMonth?.noAcd,
                  }}
                />

                {/* AGE RANGES COMPONENT */}
                <AgeRanges
                  disableFirstAge
                  year={"2020"}
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

export default Mexico;
