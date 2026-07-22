// REACT
import React, { useEffect, useRef, useState } from "react";

// REACT ROUTER DOM
import { useParams } from "react-router-dom";

// CHAKRA UI COMONENTS
import { Box, Stack, Text, SimpleGrid } from "@chakra-ui/react";

import DownloadImage from "../../../../../../components/downloadImage";

import GraphFooter from "../../../../../../components/graphFooter";

// HOOKS
import { sortDepartments } from "./hooks";

import ModalContentGT from "../../../../../../components/departments/components/gt";
import ModalContentHN from "../../../../../../components/departments/components/hn";
import { colors } from "../../../../../../utils/theme";
import { year as currentYear } from "../../../../../../utils/year";
import { monthNames } from "../../../../../../hooks/fetch";
import getCountryContent from "../../../../../../utils/country";
import ModalContentSV from "../../../../../../components/departments/components/sv";
import { useQuery } from "@apollo/client";
import { GET_TOP_DEPARTMENTS_STATS } from "../../../../../../utils/query/customizeStats";
import depName from "../../../../../country/components/statistics/components/heatMap/components/modal/utils";
import { toISO } from "../../../../../../utils/iso";
import { trackEvent } from "../../../../../../services/analytics";

const Statistics = ({ returns }) => {
  const { countryID } = useParams();
  const { period, year, list } = returns;
  const containerRef = useRef(null);
  const iso = toISO(countryID);
  const trackedStartRef = useRef("");
  const trackedResultRef = useRef("");

  const { data: topDepartmentsData } = useQuery(
    GET_TOP_DEPARTMENTS_STATS(iso, period, year),
    {
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
      skip: !iso,
    }
  );

  const [isScreenShotTime, setIsScreenShotTime] = useState(false);
  const data = sortDepartments(
    list,
    {
      depTotals: topDepartmentsData?.topDepartmentsStats?.depTotals ?? {},
    }
  );
  if (data.length > 5) data.length = 5;
  const hasValidSelection =
    Number(year) > 0 &&
    Array.isArray(period) &&
    period.length === 2 &&
    Number(period[0]) > 0 &&
    Number(period[1]) > 0 &&
    Boolean(list) &&
    list !== "default";

  useEffect(() => {
    if (!hasValidSelection) return;

    const eventKey = [iso, year, period?.[0], period?.[1], list].join("|");
    if (trackedStartRef.current === eventKey) return;
    trackedStartRef.current = eventKey;

    const baseProperties = {
      section: "customize_top_departments",
      visualizationType: "top_departments",
      listType: list,
      periodStartMonth: period?.[0],
      periodEndMonth: period?.[1],
      filters: {
        country: iso,
        year: Number(year),
      },
    };

    trackEvent("filter_applied", baseProperties);
    trackEvent("search_started", baseProperties);
  }, [hasValidSelection, iso, list, period, year]);

  useEffect(() => {
    if (!hasValidSelection) return;
    if (!topDepartmentsData?.topDepartmentsStats) return;

    const resultCount = data.filter(
      (department) => Number(department?.total || 0) > 0
    ).length;

    const eventKey = [
      iso,
      year,
      period?.[0],
      period?.[1],
      list,
      resultCount,
    ].join("|");
    if (trackedResultRef.current === eventKey) return;
    trackedResultRef.current = eventKey;

    const baseProperties = {
      section: "customize_top_departments",
      visualizationType: "top_departments",
      listType: list,
      periodStartMonth: period?.[0],
      periodEndMonth: period?.[1],
      resultCount,
      filters: {
        country: iso,
        year: Number(year),
      },
    };

    if (resultCount > 0) {
      trackEvent("search_completed", baseProperties);
      trackEvent("visualization_viewed", baseProperties);
    } else {
      trackEvent("search_without_results", baseProperties);
    }
  }, [data, hasValidSelection, iso, list, period, topDepartmentsData, year]);

  const sources = (
    <Stack
      width="100%"
      margin="auto"
      direction="column"
      alignItems="center"
      marginBottom="40px"
      padding="20px"
      justifyContent="center"
      maxWidth={"800px"}
    >
      <Text
        textAlign="center"
        fontFamily="Oswald"
        fontSize={{ base: "xl", md: "md" }}
        maxWidth={"800px"}
      >
        {getCountryContent({
          countryID,
          content: {
            guatemala: "Instituto Guatemalteco de Migración -IGM-",
            honduras: "Secretaría de Niñez, Adolescencia y Familia (SENAF)",
            elsalvador: "Dirección General de Migración y Extranjería El Salvador",
          },
        })}
      </Text>

      <Text
        textAlign="center"
        fontFamily="Montserrat Medium"
        fontSize={{ base: "xs", md: "sm" }}
      >
        Esta información ha sido procesada por: Monitoreo de niñez y
        adolescencia migrante - Monitoreo Binacional de Niñez Migrante
        Guatemala-Honduras y El Salvador.
      </Text>
    </Stack>
  );

  return (
    <Box width="100%" padding="0px 40px 80px 40px">
      {/* CONTAINER */}
      <Stack
        ref={containerRef}
        margin="auto"
        spacing="40px"
        bgColor="white"
        maxWidth="800px"
        direction="column"
        alignItems="center"
        borderRadius="20px"
        padding="60px 40px"
        justifyContent="center"
      >
        {/* TITLE AND SELECTED DATA */}
        <Stack
          spacing="16px"
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Text
            fontSize="2xl"
            fontFamily="Oswald"
            lineHeight={{ base: "1.5", md: "1" }}
            textAlign="center"
          >
            {`DEPARTAMENTOS CON ${
              list === "desc" ? "MENOS" : "MÁS"
            } NIÑEZ Y ADOLESCENCIA RETORNADA - ${getCountryContent({
              countryID,
              capitalize: true,
            }).toUpperCase()}`}
          </Text>
          <Text
            fontSize="2xl"
            lineHeight="1"
            fontWeight="600"
            fontFamily="Times"
          >
            {`${monthNames[period?.[0]] ?? "Enero"} - ${
              monthNames[period?.[1]] ?? "Enero"
            } - ${year ?? currentYear}`}
          </Text>
        </Stack>

        {/* DEPARTMENTS */}
        <SimpleGrid
          width="100%"
          columns={{ base: 1, md: Math.max(data?.length || 1, 1) }}
          spacingX={{ base: 0, md: 8 }}
          spacingY={10}
          justifyItems="center"
          alignItems="start"
        >
          {/* DEPARMENT BOX */}
          {data?.map((department, index) => (
            <Stack
              key={index}
              width={{ base: "100%", md: "132px" }}
              direction="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
            >
              <Stack height="80px" width="100%" alignItems="center" justifyContent="center">
                {getCountryContent({
                  countryID,
                  content: {
                    guatemala: (
                      <ModalContentGT
                        disableHeat
                        id={department.id}
                        customColor={[colors.heat.gt[900 - index * 100]]}
                      />
                    ),
                    honduras: (
                      <ModalContentHN
                        disableHeat
                        id={department.id}
                        customColor={[colors.heat.hn[900 - index * 100]]}
                      />
                    ),
                    elsalvador: (
                      <ModalContentSV
                        disableHeat
                        id={department.id}
                        customColor={[colors.heat.sv[900 - index * 100]]}
                      />
                    ),
                  },
                })}
              </Stack>

              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                width="100%"
              >
                <Text fontFamily="Oswald" fontSize="xl" lineHeight="1">
                  {depName[department?.id?.replace("Department", "")]}
                </Text>
                <Text fontFamily="Oswald" fontSize="4xl" lineHeight="1">
                  {department?.total ?? "N/D"}
                </Text>
              </Stack>
            </Stack>
          ))}
        </SimpleGrid>

        {/* SOURCES */}
        {!isScreenShotTime && sources}
        {isScreenShotTime && <GraphFooter sources={sources} responsive compact />}

        <DownloadImage
          containerRef={containerRef}
          label="Descargar imagen de comparación"
          onSS={setIsScreenShotTime}
          analyticsProperties={{
            section: "customize_top_departments",
            visualizationType: "top_departments",
            listType: list,
            filters: {
              country: iso,
              year: Number(year),
            },
          }}
        />
      </Stack>
    </Box>
  );
};

export default Statistics;
