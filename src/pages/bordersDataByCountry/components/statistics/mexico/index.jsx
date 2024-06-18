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
import useFetch, { monthNames } from "../../../../../hooks/fetch";

// UTILS
import { year } from "../../../../../utils/year";
import LastDate from "../../../../../components/lastUpdate";
import YearSelect from "../../../../../components/yearSelect";
import MonthPicker from "../../../../../components/monthPicker";

const Mexico = () => {
  const [currentMonth, setCurrentMonth] = useState("");
  const [currentYear, setCurrentYear] = useState("");
  const [bordersData, setBordersData] = useState([]);

  const [isScreenShotTime, setIsScreenShotTime] = useState(false);
  const [updateDate, setUpdateDate] = useState("");

  const containerRef = useRef(null);

  const { countryID } = useParams();

  const handleMonth = (ev) => setCurrentMonth(ev.target.value);
  const handleYear = (ev) => setCurrentYear(ev.target.value);

  // OBTENER DATOS
  useFetch({
    url: "/consultas/detenidosenfrontera/selectedYear/m%C3%A9xico",
    year: currentYear,
    resolve: (data) => {
      const lastDate = data?.data?.[data?.data?.length - 1]?.["updatedAt"];
      const uDate = new Date(lastDate);

      setUpdateDate(
        `${uDate.getDate()} de ${monthNames[
          uDate.getMonth() + 1
        ]?.toLowerCase()} del ${uDate.getFullYear()}`
      );
      setBordersData(data.data);
    },
  });

  const dataPerMonth =
    bordersData?.find(
      (item) =>
        item.mes === currentMonth?.toUpperCase() &&
        item.paisLocal?.toUpperCase() === countryID.toUpperCase()
    ) ?? {};

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

            {/* SELECT MONTH */}
            {/* <Select
              fontSize="2xl"
              lineHeight="1.8"
              fontWeight="600"
              fontFamily="Times"
              letterSpacing="1.2px"
              onChange={handleMonth}
              bgColor="rgba(255,255,255,0.5)"
              value={currentMonth || "default"}
            >
              <option value="default">Elegir mes</option>
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
                  {currentMonth || "Mes"}
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
                    female: dataPerMonth?.femenino,
                    male: dataPerMonth?.masculino,
                  }}
                />

                {/* TRAVEL CONDITION COMPONENT */}
                <TravelCondition
                  period={"enero - abril"}
                  year={"2020"}
                  defData={{
                    acd: dataPerMonth?.acompaniado,
                    noAcd: dataPerMonth?.noAcompaniado,
                  }}
                />

                {/* AGE RANGES COMPONENT */}
                <AgeRanges
                  disableFirstAge
                  year={"2020"}
                  period={"enero - abril"}
                  defData={{
                    f2: dataPerMonth?.ninos,
                    f3: dataPerMonth?.adolescentes,
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
