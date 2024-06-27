import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTransitFilteredQuery } from "../../../../hooks/query";
import {
  GET_TRANSIT_REPORT,
  GET_TRANSIT_REPORT_ENTRY_BORDERS,
} from "../../../../utils/query/transit";

import { Box, Stack, Text } from "@chakra-ui/react";
import YearSelect from "../../../../components/yearSelect";
import MonthPicker from "../../../../components/monthPicker";
import Gender from "../../../country/components/statistics/components/gender";
import AgeRanges from "../../../country/components/statistics/components/ageRanges";
import LastDate from "../../../../components/lastUpdate";
import ReturnCountry from "../entryBorders/components/returnCountry";
import EntryBorderCountry from "../entryBorders/components/entryBorders";

const Statistics = () => {
  const [period, setPeriod] = useState([]);
  const [currentYear, setCurrentYear] = useState("");
  const { countryID } = useParams();
  const data = useTransitFilteredQuery({
    period,
    query: GET_TRANSIT_REPORT(countryID),
    year: currentYear,
  });

  const dataEntry = useTransitFilteredQuery({
    period,
    query: GET_TRANSIT_REPORT_ENTRY_BORDERS(countryID),
    year: currentYear,
  });

  const countryContributions = dataEntry
    ?.map((report) => report?.attributes?.country_contributions?.data)
    .flat();

  const entryBordersContributions = dataEntry
    ?.map((report) => report?.attributes?.entry_border_contributions?.data)
    .flat();

  const handleMonth = (range) => {
    setPeriod(range);
  };
  const handleYear = (ev) => setCurrentYear(ev.target.value);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [countryID]);

  const dataPerMonth = {
    female: 0,
    male: 0,
    f1: 0,
    f2: 0,
    f3: 0,
    f4: 0,
  };

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
        curr?.attributes?.age_group?.data?.attributes?.name ===
        "Primera infancia"
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

    const f4 = element?.attributes?.age_group_contributions?.data?.reduce(
      (acc, curr) =>
        curr?.attributes?.age_group?.data?.attributes?.name === "No registrados"
          ? acc + Number(curr?.attributes?.cant ?? 0)
          : acc,
      0
    );

    dataPerMonth.female += female;
    dataPerMonth.male += male;
    dataPerMonth.f1 += f1;
    dataPerMonth.f2 += f2;
    dataPerMonth.f3 += f3;
    dataPerMonth.f4 += f4;
  });

  return (
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
              NIÑEZ EN TRÁNSITO
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

        <Stack spacing={5} direction="row" padding="40px" alignItems="stretch">
          <Stack
            gap="40px"
            width="100%"
            bgColor="#fff"
            padding="40px 60px"
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
                  Total en el mes:
                </Text>
                <Text fontFamily="Oswald" fontSize="4xl" lineHeight="1">
                  {(dataPerMonth?.female ?? 0) + (dataPerMonth?.male ?? 0)}
                </Text>
              </Stack>

              {/* GRAPHS */}
              <Stack
                gap="48px"
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
                    f4: dataPerMonth?.f4,
                  }}
                />
              </Stack>
            </Stack>
          </Stack>

          <Stack
            direction="column"
            spacing={9}
            width="100%"
            bgColor="#fff"
            borderRadius="12px"
            padding="40px 24px"
          >
            <Stack direction="column">
              <Text fontFamily="Oswald" fontSize="3xl" lineHeight="1">
                Contribución por país
              </Text>
              <Text fontFamily="Oswald" fontSize="xl" lineHeight="1">
                Y aduanas de ingreso
              </Text>
            </Stack>

            <Stack
              width="100%"
              alignItems="center"
              justifyContent="space-between"
              direction={{ base: "column", md: "row" }}
            >
              <ReturnCountry data={countryContributions} />
              <EntryBorderCountry data={entryBordersContributions} />
            </Stack>
          </Stack>
        </Stack>

        {/* SOURCES */}
        <LastDate
          updateDate={new Date().toLocaleString("en-Gb")}
          isScreenShotTime={false}
        />
      </Stack>
    </Box>
  );
};

export default Statistics;
