// REACT
import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";

// CHAKRA UI COMPONENTS
import { Box, Stack, Text, Image, Divider } from "@chakra-ui/react";

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

// UTILS
import { year } from "../../../../utils/year";
import LastDate from "../../../../components/lastUpdate";
import getCountryContent from "../../../../utils/country";
import { useDetainedEEUU } from "../statistics/eeuu/hooks";
import { useDetainedMexico } from "../statistics/mexico/hooks";
import useReturnedFilteredQuery from "../../../../hooks/query";
import { GET_RETURNEDS_BY_COUNTRY_FOR_TOTAL } from "../../../../utils/query/returned";
import DownloadTable from "../../../country/components/statistics/components/downloadTable";

const Compare = () => {
  const [currentPeriod, setCurrentPeriod] = useState([0, 0]);
  const [currentYear, setCurrentYear] = useState(year);
  const [isScreenShotTime, setIsScreenShotTime] = useState(false);
  const { countryID } = useParams();
  const containerRef = useRef();

  const handleYear = (ev) => setCurrentYear(ev.target.value);

  const {
    dataPerMonth: dataUS,
    updateDate,
    files: filesUs,
  } = useDetainedEEUU({
    period: currentPeriod,
    currentYear,
  });
  const { dataPerMonth: dataMx, files: filesMx } = useDetainedMexico({
    period: currentPeriod,
    currentYear,
  });

  const filesRef = useRef([]);
  const returnedData = useReturnedFilteredQuery({
    filesRef,
    year: currentYear,
    period: currentPeriod,
    query: GET_RETURNEDS_BY_COUNTRY_FOR_TOTAL(countryID),
  });
  let totalCant = 0;

  returnedData?.forEach((report) => {
    totalCant += report.attributes?.returned?.data?.attributes?.total || 0;
  });

  let combinedFiles = [...filesMx, ...filesUs, ...filesRef.current];

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
                {totalCant}
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
                {dataUS.totalMes ?? "N/D"}
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
                {dataMx.totalMes ?? "N/D"}
              </Text>
            </Stack>
          </Stack>

          <LastDate
            sources={sources}
            updateDate={updateDate}
            isScreenShotTime={isScreenShotTime}
          />

          {isScreenShotTime && <GraphFooter responsive />}

          {!isScreenShotTime && (
            <DownloadTable satisticsRef={containerRef} files={combinedFiles} />
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default Compare;
