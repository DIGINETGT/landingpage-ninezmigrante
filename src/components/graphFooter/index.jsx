import React from "react";

import { Box, Image, Stack, Text, Link } from "@chakra-ui/react";

// ASSETS
import LogoProyectoBinacional from "../../assets/LogoProyectoBinacional.png";
import LogoNinezMigrante from "../../assets/LogoNinezMigrante.png";
import LogoCoiproden from "../../assets/LogoCoiproden.png";
import LogoPAMI from "../../assets/LogoPAMI.png";
import LogoKnh from "../../assets/LogoKnh.png";

const GraphFooter = ({ responsive, compact = false, fullWidth = false }) => {
  const isCompact = responsive || compact;

  if (compact) {
    return (
      <Stack
        mt={6}
        direction="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        maxWidth={fullWidth ? "100%" : "800px"}
        margin="0 auto"
        px={fullWidth ? "24px" : "0"}
        spacing={4}
      >
        <Stack direction="column" alignItems="center" spacing={2}>
          <Text
            lineHeight={1}
            fontWeight="600"
            fontFamily="Montserrat"
            fontSize="0.55em"
            textAlign="center"
          >
            Esta información ha sido procesada por:
          </Text>
        </Stack>

        <Box
          display="grid"
          gridTemplateColumns="repeat(5, minmax(0, 1fr))"
          alignItems="center"
          width="100%"
          columnGap={fullWidth ? "16px" : "12px"}
        >
          <Box display="flex" justifyContent="center" alignItems="center">
            <Link to="/" _hover={{ textDecoration: "none" }}>
              <Stack direction="row" alignItems="center" spacing={2} minW="0">
                <Image
                  src={LogoNinezMigrante}
                  h="42px"
                  w="42px"
                  minW="42px"
                  objectFit="contain"
                />
                <Text
                  lineHeight={1}
                  fontFamily="Oswald"
                  fontSize="0.8em"
                  whiteSpace="nowrap"
                >
                  NiñezMigrante.org
                </Text>
              </Stack>
            </Link>
          </Box>

          <Box display="flex" justifyContent="center" alignItems="center">
            <a href="https://www.kindernothilfe.org/" target="_blank">
              <Image src={LogoKnh} h="52px" objectFit="contain" />
            </a>
          </Box>

          <Box display="flex" justifyContent="center" alignItems="center">
            <a href="https://redcoiproden.org/" target="_blank">
              <Image src={LogoProyectoBinacional} h="52px" objectFit="contain" />
            </a>
          </Box>

          <Box display="flex" justifyContent="center" alignItems="center">
            <a href="https://redcoiproden.org/" target="_blank">
              <Image src={LogoCoiproden} h="58px" objectFit="contain" />
            </a>
          </Box>

          <Box display="flex" justifyContent="center" alignItems="center">
            <a href="https://pami-guatemala.org/" target="_blank">
              <Image src={LogoPAMI} h="62px" objectFit="contain" />
            </a>
          </Box>
        </Box>
      </Stack>
    );
  }

  return (
    <Stack
      mt={10}
      direction="column"
      alignItems="center"
      maxWidth="unset"
      margin="0 auto"
      paddingLeft={isCompact ? "32px" : "100px"}
      paddingRight={isCompact ? "32px" : "100px"}
      justifyContent="center"
    >
      <Stack direction={{ base: "column", md: "row" }} justifyContent="center">
        <Stack
          pr={4}
          direction="column"
          alignItems="center"
          justifyContent="center"
          borderRight="1px solid #333"
          minWidth={isCompact ? "unset" : "300px"}
        >
          <Text
            mb={2}
            width="100%"
            lineHeight={1}
            fontWeight="600"
            fontFamily="Montserrat"
            fontSize={isCompact ? "0.5em" : "0.8em"}
          >
            Esta información ha sido procesada por:
          </Text>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={["space-between", "center"]}
          >
            <Link to="/">
              <Image
                w={isCompact ? "44px" : "80px"}
                mb={isCompact ? "0" : "-25px"}
                src={LogoNinezMigrante}
                minW={isCompact ? "40px" : "80px"}
                objectFit="contain"
              />
            </Link>

            <Stack direction="column" spacing="0px">
              <Text
                lineHeight={1}
                fontFamily="Oswald"
                fontSize={isCompact ? "0.8em" : "1em"}
              >
                NiñezMigrante.org
              </Text>
            </Stack>
          </Stack>
          <Text
            maxW={260}
            paddingTop={6}
            fontSize={isCompact ? "0.5em" : "1em"}
            fontWeight="600"
            fontFamily="Times"
            lineHeight={1.2}
            textAlign="center"
          >
            Monitoreo de niñez y adolescencia migrante
          </Text>
        </Stack>
        <Stack
          pl={4}
          direction="column"
          alignItems="center"
          justifyContent="center"
          marginBottom="40px"
        >
          <Stack
            gap={isCompact ? "16px" : "30px"}
            alignItems={"center"}
            direction={{ base: "column", md: "row" }}
          >
            <a href="https://www.kindernothilfe.org/" target="_blank">
              <Image
                src={LogoKnh}
                maxH={isCompact ? "70px" : "unset"}
                maxW={isCompact ? "200px" : "250px"}
                minWidth={isCompact ? "unset" : "250px"}
                objectFit="contain"
              />
            </a>
            <a href="https://redcoiproden.org/" target="_blank">
              <Image
                src={LogoProyectoBinacional}
                maxH={isCompact ? "58px" : "unset"}
                maxWidth={isCompact ? "90px" : "80px"}
                minWidth={isCompact ? "unset" : "80px"}
                objectFit="contain"
              />
            </a>
            <a href="https://redcoiproden.org/" target="_blank">
              <Image
                src={LogoCoiproden}
                maxH={isCompact ? "92px" : "unset"}
                maxW={isCompact ? "220px" : "unset"}
                minWidth={isCompact ? "unset" : "200px"}
                objectFit="contain"
              />
            </a>
            <a href="https://pami-guatemala.org/" target="_blank">
              <Image
                src={LogoPAMI}
                maxH={isCompact ? "96px" : "unset"}
                maxW={isCompact ? "120px" : "unset"}
                minWidth={isCompact ? "unset" : "80px"}
                objectFit="contain"
              />
            </a>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default GraphFooter;
