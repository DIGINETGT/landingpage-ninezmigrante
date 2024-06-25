// REACT
import React, { useEffect, useState } from "react";

import { Box, Stack, Text } from "@chakra-ui/react";

// REACT ROUTER DOM
import { useParams } from "react-router-dom";

import Header from "./components/header";
import Gender from "../country/components/statistics/components/gender";
import TravelCondition from "../country/components/statistics/components/travelCondition";
import AgeRanges from "../country/components/statistics/components/ageRanges";
import LastDate from "../../components/lastUpdate";
import useReturnedFilteredQuery, {
  useTransitFilteredQuery,
} from "../../hooks/query";
import YearSelect from "../../components/yearSelect";
import MonthPicker from "../../components/monthPicker";
import { GET_TRAFIC_REPORT } from "../../utils/query/transit";
import { capitalizeText } from "../../utils/tools";

const TransitDataByCountry = () => {
  const [period, setPeriod] = useState([]);
  const [currentYear, setCurrentYear] = useState("");
  const { countryID } = useParams();
  const data = useTransitFilteredQuery({
    period,
    query: GET_TRAFIC_REPORT(capitalizeText(countryID)),
    year: currentYear,
  });

  const handleMonth = (range) => {
    setPeriod(range);
  };
  const handleYear = (ev) => setCurrentYear(ev.target.value);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [countryID]);

  const dataPerMonth = { totalMes: 0, female: 0, male: 0, f1: 0, f2: 0, f3: 0 };

  data?.forEach((element) => {
    const female = element?.attributes?.gender_contributions?.data?.reduce(
      (acc, curr) =>
        curr?.attributes?.gender?.data?.attributes?.name === "Femenino"
          ? acc + curr?.attributes?.cant
          : acc,
      0
    );

    const male = element?.attributes?.gender_contributions?.data?.reduce(
      (acc, curr) =>
        curr?.attributes?.gender?.data?.attributes?.name === "Masculino"
          ? acc + curr?.attributes?.cant
          : acc,
      0
    );

    const f1 = element?.attributes?.age_group_contributions?.data?.reduce(
      (acc, curr) =>
        curr?.attributes?.age_group?.data?.attributes?.name === "Primera infancia"
          ? acc + Number(curr?.attributes?.cant ?? 0)
          : acc,
      0
    );

    const f2 = element?.attributes?.age_group_contributions?.data?.reduce(
      (acc, curr) =>
        curr?.attributes?.age_group?.data?.attributes?.name === "Niñez"
          ? acc + Number(curr?.attributes?.cant ?? 0)
          : acc,
      0
    );

    const f3 = element?.attributes?.age_group_contributions?.data?.reduce(
      (acc, curr) =>
        curr?.attributes?.age_group?.data?.attributes?.name === "Adolescencia"
          ? acc + Number(curr?.attributes?.cant ?? 0)
          : acc,
      0
    );

    dataPerMonth.female += female;
    dataPerMonth.male += male;
    dataPerMonth.totalMes += female + male;
    dataPerMonth.f1 += f1;
    dataPerMonth.f2 += f2;
    dataPerMonth.f3 += f3;
  });


  return (
    <>
      <Header />

      {/* STATISTICS */}
      <Box width="100%" padding={{ base: "24px 40px", md: "80px 40px" }}>
        <Stack
          gap="24px"
          width="100%"
          margin="auto"
          maxWidth="1000px"
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Stack
            width="100%"
            alignItems="center"
            direction={{ base: "column", md: "row" }}
            justifyContent={{ base: "center", md: "space-between" }}
          >
            {/* YEAR AND TITLE */}
            <Stack width={{ base: "100%", md: "50%" }}>
              <Text fontFamily="Oswald" fontSize="2xl" lineHeight="1">
                {currentYear}
              </Text>
              <Text
                fontSize="4xl"
                fontFamily="Oswald"
                lineHeight={{ base: "1.2", md: "1" }}
              >
                NIÑEZ EN TRAFICO DE {countryID.toUpperCase()}
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

          <Box padding="40px">
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
                    period={period}
                    year={currentYear}
                    defData={{
                      female: dataPerMonth?.female,
                      male: dataPerMonth?.male,
                    }}
                  />

                  {/* AGE RANGES COMPONENT */}
                  <AgeRanges
                    
                    year={currentYear}
                    period={period}
                    defData={{
                      f1: dataPerMonth?.f1,
                      f2: dataPerMonth?.f2,
                      f3: dataPerMonth?.f3,
                    }}
                  />
                </Stack>
              </Stack>
            </Stack>

            {/* SOURCES */}
            <LastDate
              updateDate={new Date().toLocaleString("en-Gb")}
              isScreenShotTime={false}
            />
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export default TransitDataByCountry;
