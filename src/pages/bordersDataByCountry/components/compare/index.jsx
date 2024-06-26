// REACT
import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";

// CHAKRA UI COMPONENTS
import { Box, Stack, Text, Select, Image, Divider } from "@chakra-ui/react";

// COMPONENTS
import DownloadImage from "../../../../components/downloadImage";
import MonthPicker from "../../../../components/monthPicker";
import YearSelect from "../../../../components/yearSelect";
import GraphFooter from "../../../../components/graphFooter";

// ASSETS
import MapaHonduras from "../../../.../../../assets/MapaHonduras.svg";
import MapaElSalvador from "../../../../assets/MapaElSalvador.svg";
import MapaMexico from "../../../../assets/MapaMexico.png";
import MapaEEUU from "../../../../assets/MapaEEUU.png";
import MapaGuatemala from "../../../../assets/MapaGuatemala.png";

// HOOKS
import { monthNames } from "../../../../hooks/fetch";

// UTILS
import { year } from "../../../../utils/year";
import LastDate from "../../../../components/lastUpdate";
import getCountryContent from "../../../../utils/country";
import {
  GET_DETAINED,
  GET_DETAINED_IN_BORDERDS,
  GET_DETAINED_IN_BORDERDS_BY_COUNTRY,
  GET_DETAINED_US_BORDERDS_BY_COUNTRY,
} from "../../../../utils/query/returned";
import { compareDateRange, isMonthInRange } from "../../../../utils/tools";
import { useQuery } from "@apollo/client";
import useReturnedFilteredQuery from "../../../../hooks/query";

const Compare = () => {
  const [currentPeriod, setCurrentPeriod] = useState([0, 0]);
  const [currentYear, setCurrentYear] = useState(year);

  const [isScreenShotTime, setIsScreenShotTime] = useState(false);

  const { countryID } = useParams();

  const containerRef = useRef();

  const handleYear = (ev) => setCurrentYear(ev.target.value);

  const data = useReturnedFilteredQuery({
    year: currentYear,
    period: currentPeriod,
  });
  let total = 0;
  data?.forEach((report) => {
    report.attributes?.users_permissions_user?.data?.attributes?.organization?.data?.attributes?.department?.data?.attributes?.country?.data?.attributes?.country_contributions?.data?.forEach(
      (contribution) => {
        total +=
          contribution.attributes?.returned?.data?.attributes?.total || 0;
      }
    );
  });

  const { data: dataBorder } = useQuery(GET_DETAINED_IN_BORDERDS_BY_COUNTRY);

  // OBTENER DATOS
  const bordersData = dataBorder?.detainedInBordersReports?.data;

  const dataPerPeriod = {
    mx: 0,
    usa: 0,
  };
  let updateDate = "";
  bordersData
    ?.filter((report) => {
      const [reportYear, reportMonth] = report.attributes?.reportDate
        .split("-")
        .map(Number);

      updateDate = new Date(
        report?.attributes?.updatedAt ?? "0"
      )?.toLocaleString("en-Gb");

      if (
        !isMonthInRange(reportMonth, currentPeriod) ||
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

      dataPerPeriod.mx += total;
    });

  const { data: dataBorderUs } = useQuery(GET_DETAINED_US_BORDERDS_BY_COUNTRY);
  const bordersDataUS = dataBorderUs?.detainedInBordersReports?.data;
  const filteredUsData = bordersDataUS?.filter((report) => {
    const [reportYear, reportMonth] = report.attributes?.reportDate
      .split("-")
      .map(Number);

    if (
      !isMonthInRange(reportMonth, currentPeriod) ||
      reportYear?.toString() !== currentYear?.toString()
    ) {
      return false;
    }

    const countryName = report?.attributes?.country?.data?.attributes?.name;

    if (countryName?.toLowerCase().replace(/\s+/g, "") !== "estadosunidos")
      return false;

    return (
      report.attributes?.users_permissions_user?.data?.attributes?.organization?.data?.attributes?.department?.data?.attributes?.country?.data?.attributes?.name
        ?.toLowerCase()
        .replace(/\s+/g, "") === countryID?.toLowerCase().replace(/\s+/g, "")
    );
  });

  filteredUsData?.forEach((element) => {
    const total = element?.attributes?.detained_us_borders?.data?.reduce(
      (acc, curr) => {
        return acc + curr?.attributes?.total;
      },
      0
    );
    console.log(element?.attributes);
    dataPerPeriod.usa += total;
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
    <Box width="100%" bgColor="#d9e8e8" padding="40px 40px 80px 40px">
      <Stack
        width="100%"
        margin="auto"
        spacing="40px"
        maxWidth="800px"
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Divider
          width="100%"
          borderWidth="1px"
          borderColor="black"
          orientation="horizontal"
          display={{ base: "none", md: "block" }}
        />

        <Stack justifyContent="center" alignItems="center" gap="8px">
          <Text
            lineHeight="1"
            fontSize="4xl"
            textAlign="center"
            fontFamily="Oswald"
          >
            COMPARAR DETENIDOS EN FRONTERA CON RETORNADOS
          </Text>

          <Stack
            width="100%"
            alignItems="center"
            justifyContent="center"
            direction={{ base: "column", md: "row" }}
          >
            {/* SELECT YEAR */}
            <YearSelect currentYear={currentYear} handleYear={handleYear} />

            {/* SELECT PERIOD */}
            <MonthPicker onAccept={setCurrentPeriod} />
          </Stack>
        </Stack>

        <Box padding="40px" ref={containerRef}>
          <Stack
            gap="24px"
            width="100%"
            justifyContent="center"
            direction={{ base: "column", md: "row" }}
            alignItems={{ base: "center", md: "flex-end" }}
          >
            <Stack
              maxWidth="210px"
              justifyContent="center"
              alignItems={{ base: "center", md: "flex-end" }}
            >
              <Image
                height="200px"
                maxWidth={{ base: "300px", md: "240px" }}
                src={getCountryContent({
                  countryID,
                  content: {
                    guatemala: MapaGuatemala,
                    honduras: MapaHonduras,
                    elsalvador: MapaElSalvador,
                  },
                })}
              />
              <Text
                fontSize="2xl"
                lineHeight="1"
                fontFamily="Oswald"
                textAlign={{ base: "center", md: "right" }}
              >
                TOTAL DE RETORNADOS A{" "}
                {getCountryContent({
                  countryID,
                  capitalize: true,
                }).toUpperCase()}
              </Text>
              <Text
                fontSize="xl"
                lineHeight="1"
                fontWeight="600"
                fontFamily="Times"
              >
                {currentYear || "Año"}
              </Text>
              <Text
                lineHeight="1"
                textAlign="right"
                fontFamily="Oswald"
                fontSize={{ base: "4xl", md: "6xl" }}
              >
                {total}
              </Text>
            </Stack>

            {/* DIVIDER */}
            <Divider
              height="400px"
              borderWidth="1px"
              orientation="vertical"
              borderColor="#000"
              display={{ base: "none", md: "block" }}
            />

            <Stack
              justifyContent="center"
              alignItems="center"
              maxWidth="300px"
              spacing="16px"
            >
              <Image
                src={MapaEEUU}
                height="120px"
                maxWidth="300px"
                objectFit="contain"
              />
              <Text fontFamily="Oswald" fontSize="2xl" lineHeight="1">
                Estados Unidos
              </Text>
              <Text
                fontSize="xl"
                lineHeight="1"
                fontWeight="600"
                fontFamily="Times"
              >
                {currentYear || "Año"}
              </Text>
              <Text
                lineHeight="1"
                fontFamily="Oswald"
                fontSize={{ base: "4xl", md: "6xl" }}
              >
                {dataPerPeriod.usa}
              </Text>
            </Stack>

            <Stack justifyContent="center" alignItems="center" lineHeight="1">
              <Image
                src={MapaMexico}
                height="160px"
                maxWidth="200px"
                objectFit="contain"
              />
              <Text fontFamily="Oswald" fontSize="2xl">
                México
              </Text>
              <Text
                fontSize="xl"
                lineHeight="1"
                fontWeight="600"
                fontFamily="Times"
              >
                {currentYear || "Año"}
              </Text>
              <Text
                lineHeight="1"
                fontFamily="Oswald"
                fontSize={{ base: "4xl", md: "6xl" }}
              >
                {dataPerPeriod.mx}
              </Text>
            </Stack>
          </Stack>

          <LastDate
            sources={sources}
            updateDate={updateDate}
            isScreenShotTime={isScreenShotTime}
          />

          {isScreenShotTime && <GraphFooter responsive />}

          <DownloadImage
            label="Descargar imagen de la comparación"
            containerRef={containerRef}
            onSS={setIsScreenShotTime}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default Compare;
