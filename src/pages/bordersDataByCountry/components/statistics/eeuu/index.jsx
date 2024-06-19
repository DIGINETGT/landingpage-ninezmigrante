// REACT
import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";

// CHAKRA UI COMPONENTS
import { Box, Stack, Text, Image, Select, border } from "@chakra-ui/react";

// COMPONENTS
import DownloadImage from "../../../../../components/downloadImage";

// ASSETS
import MapaEEUU from "../../../../../assets/MapaEEUU.png";

// HOOKS
import useFetch, { monthNames } from "../../../../../hooks/fetch";

// UTILS
import { year } from "../../../../../utils/year";
import GraphFooter from "../../../../../components/graphFooter";
import LastDate from "../../../../../components/lastUpdate";
import YearSelect from "../../../../../components/yearSelect";
import MonthPicker from "../../../../../components/monthPicker";

const excludeFields = [
  "_id",
  "mes",
  "anio",
  "organizacion",
  "pais",
  "totalMes",
  "paisLocal",
  "periodo",
  "granTotal",
  "createdAt",
  "updatedAt",
];

const EEUU = () => {
  const [currentMonth, setCurrentMonth] = useState("");
  const [currentYear, setCurrentYear] = useState("");
  const [isScreenShotTime, setIsScreenShotTime] = useState(false);
  const [updateDate, setUpdateDate] = useState("");

  const { countryID } = useParams();
  const containerRef = useRef(null);

  const handleMonth = (ev) => setCurrentMonth(ev.target.value);
  const handleYear = (ev) => setCurrentYear(ev.target.value);

  const { data: dataBorder } = useQuery(GET_DETAINED_IN_BORDERDS);

  // OBTENER DATOS
  const bordersData = dataBorder?.country_contributions?.data;

  const dataPerMonth =
    bordersData?.find(
      (item) =>
        item.mes === currentMonth?.toUpperCase() &&
        item.paisLocal?.toUpperCase() === countryID.toUpperCase()
    ) ?? {};

  const dataPerDeps = Object.entries(dataPerMonth).filter(
    ([key]) => !excludeFields.includes(key)
  );

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
            <Text fontFamily="Oswald" fontSize="2xl" lineHeight="1">
              Sólo NO ACOMPAÑADOS
            </Text>
          </Stack>

          {/* YEAR AND PERIOD SELECTS */}
          <Stack
            width={{ base: "100%", md: "50%" }}
            direction={{ base: "column", md: "row" }}
          >
            {/* SELECT YEAR */}
            <YearSelect handleYear={handleYear} currentYear={currentYear} />

            {/* SELECT MONTH */}
            {/* <Select
              fontSize="2xl"
              lineHeight="1.8"
              fontWeight="600"
              fontFamily="Times"
              letterSpacing="1.2px"
              onChange={handleMonth}
              bgColor="rgba(255,255,255,0.5)"
              value={currentMonth || ""}
            >
              <option value="">Elegir mes</option>
              <option value="ENERO">Enero</option>
              <option value="FEBRERO">Febrero</option>
              <option value="MARZO">Marzo</option>
              <option value="ABRIL">Abril</option>
              <option value="MAYO">Mayo</option>
              <option value="JUNIO">Junio</option>
              <option value="JULIO">Julio</option>
              <option value="AGOSTO">Agosto</option>
              <option value="SEPTIEMBRE">Septiembre</option>
              <option value="OCTUBRE">Octubre</option>
              <option value="NOVIEMBRE">Noviembre</option>
              <option value="DICIEMBRE">Diciembre</option>
            </Select> */}
            <MonthPicker
              handleMonth={handleMonth}
              currentMonth={currentMonth}
            />
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
                {currentMonth || "Mes"}
              </Text>
              <Text fontFamily="Oswald" fontSize="6xl" lineHeight="1">
                {dataPerMonth?.totalMes ?? "0"}
              </Text>
            </Stack>

            {/* DATA BY BORDERS */}
            <Stack>
              {dataPerDeps.map(([key, value]) => (
                <Stack
                  key={`${key}-${value}`}
                  gap="120px"
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Text fontFamily="Montserrat Medium" fontSize="xl">
                    {key}
                  </Text>
                  <Text fontFamily="Montserrat Medium" fontSize="xl">
                    {value}
                  </Text>
                </Stack>
              ))}
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
