// REACT
import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";

// CHAKRA UI COMPONENTS
import {
  Box,
  Stack,
  Text,
  Select,
  Image,
  Divider,
  useQuery,
} from "@chakra-ui/react";

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
import useFetch, { monthNames } from "../../../../hooks/fetch";

// UTILS
import { year } from "../../../../utils/year";
import LastDate from "../../../../components/lastUpdate";
import getCountryContent from "../../../../utils/country";
import {
  GET_DETAINED,
  GET_DETAINED_IN_BORDERDS,
} from "../../../../utils/query/returned";
import { compareDateRange } from "../../../../utils/tools";

const Compare = () => {
  const [currentPeriod, setCurrentPeriod] = useState([1, 1]);
  const [currentYear, setCurrentYear] = useState(year);

  const [isScreenShotTime, setIsScreenShotTime] = useState(false);
  const [updateDate, setUpdateDate] = useState("");

  const { countryID } = useParams();

  const containerRef = useRef();

  const handleYear = (ev) => setCurrentYear(ev.target.value);

  const { data, loading, error } = useQuery(GET_DETAINED);
  const total = data?.detainedInBorders?.data?.reduce((acc, item) => {
    if (
      compareDateRange({
        start: currentPeriod[0],
        end: currentPeriod[1],
        month: item?.attributes?.month,
      })
    ) {
      acc += item?.attributes?.total;
    }
  });

  const { data: dataBorder } = useQuery(GET_DETAINED_IN_BORDERDS);

  // OBTENER DATOS
  const bordersData = {
    mx: dataBorder?.country_contributions?.data?.reduce(
      (acc, b) =>
        b?.attributes?.country?.data?.attributes?.name === "México"
          ? acc + b?.attributes?.cant
          : acc,
      0
    ),
    usa: dataBorder?.country_contributions?.data?.reduce(
      (acc, b) =>
        b?.attributes?.country?.data?.attributes?.name === "Estados Unidos"
          ? acc + b?.attributes?.cant
          : acc,
      0
    ),
  };

  const dataPerPeriod = {
    mx: bordersData.mx
      .filter((item) => {
        const monthIndex = monthNames.indexOf(item.mes);
        return (
          monthIndex >= currentPeriod[0] &&
          monthIndex <= currentPeriod[1] &&
          item.paisLocal?.toUpperCase() === countryID.toUpperCase()
        );
      })
      .reduce((acc, item) => acc + item.totalMes, 0),
    usa: bordersData.usa
      .filter((item) => {
        const monthIndex = monthNames.indexOf(item.mes);
        return (
          monthIndex >= currentPeriod[0] &&
          monthIndex <= currentPeriod[1] &&
          item.paisLocal?.toUpperCase() === countryID.toUpperCase()
        );
      })
      .reduce((acc, item) => acc + item.totalMes, 0),
  };

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
              <Text textAlign="center">
                * Sólo se reportan niños, niñas y adolescentes NO ACOMPAÑADOS
              </Text>
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
