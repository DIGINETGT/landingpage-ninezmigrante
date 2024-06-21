// REACT
import React, { useState, useRef } from "react";

// REACT ROUTER DOM
import { useParams } from "react-router-dom";

// CHAKRA UI COMONENTS
import { Box, Stack, Text } from "@chakra-ui/react";

import DownloadImage from "../../../../../../components/downloadImage";

import GraphFooter from "../../../../../../components/graphFooter";

// HOOKS
import { sortDepartments } from "./hooks";

import ModalContentGT from "../../../../../../components/departments/components/gt";
import ModalContentHN from "../../../../../../components/departments/components/hn";
import { colors } from "../../../../../../utils/theme";
import { year as currentYear } from "../../../../../../utils/year";
import { monthNames } from "../../../../../../hooks/fetch";
import getCountryContent, { getDepartmentData } from "../../../../../../utils/country";
import ModalContentSV from "../../../../../../components/departments/components/sv";
import useReturnedFilteredQuery from "../../../../../../hooks/query";
import { GET_RETURNEDS_BY_COUNTRY_FOR_DEPARTMENT } from "../../../../../../utils/query/returned";

const Statistics = ({ returns }) => {
  const { countryID } = useParams();
  const { period, year, list } = returns;
  const containerRef = useRef(null);

  const databorders = useReturnedFilteredQuery({
    query: GET_RETURNEDS_BY_COUNTRY_FOR_DEPARTMENT,
    year,
    period,
    country: countryID,
  });

  const [isScreenShotTime, setIsScreenShotTime] = useState(false);
  const data = sortDepartments(list, getDepartmentData(databorders));

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
            honduras: "DINAF",
          },
        })}
      </Text>

      <Text
        textAlign="center"
        fontFamily="Montserrat Medium"
        fontSize={{ base: "xs", md: "sm" }}
      >
        Esta información ha sido procesada por: MOBINIM -Monitoreo Binacional de
        Niñez Migrante Guatemala-Honduras-.
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
            textAlign={{ base: "center", md: "left" }}
          >
            {`DEPARTAMENTOS CON ${
              list === "desc" ? "MENOS" : "MÁS"
            } RETORNADOS - ${getCountryContent({
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
        <Stack
          alignItems="center"
          justifyContent="center"
          gap={{ base: "40px", md: "60px" }}
          direction={{ base: "column", md: "row" }}
        >
          {/* DEPARMENT BOX */}
          {data?.map((department, index) => (
            <Stack
              key={index}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Stack height="80px">
                {getCountryContent({
                  countryID,
                  content: {
                    guatemala: (
                      <ModalContentGT
                        disableHeat
                        id={department.id}
                        customColor={[colors.heat.guatemala[900 - index * 100]]}
                      />
                    ),
                    honduras: (
                      <ModalContentHN
                        disableHeat
                        id={department.id}
                        customColor={[colors.heat.honduras[900 - index * 100]]}
                      />
                    ),
                    elsalvador: (
                      <ModalContentSV
                        disableHeat
                        id={department.id}
                        customColor={[
                          colors.heat.elsalvador[900 - index * 100],
                        ]}
                      />
                    ),
                  },
                })}
              </Stack>

              <Stack
                direction="column"
                justifyContent="center"
                alignItems={{ base: "center", md: "flex-start" }}
              >
                <Text fontFamily="Oswald" fontSize="xl" lineHeight="1">
                  {department?.id?.replace("Department", "")}
                </Text>
                <Text fontFamily="Oswald" fontSize="4xl" lineHeight="1">
                  {department?.total}
                </Text>
              </Stack>
            </Stack>
          ))}
        </Stack>

        {/* SOURCES */}
        {!isScreenShotTime && sources}
        {isScreenShotTime && <GraphFooter sources={sources} responsive />}

        <DownloadImage
          containerRef={containerRef}
          label="Descargar imagen de comparación"
          onSS={setIsScreenShotTime}
        />
      </Stack>
    </Box>
  );
};

export default Statistics;
