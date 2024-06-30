import React, { useState } from "react";

import parse from "html-react-parser";
import { useParams } from "react-router-dom";
import {
  Stack,
  Button,
  Text,
  Box,
  Heading,
  HStack,
  Badge,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Link,
} from "@chakra-ui/react";
import { DownloadIcon, Search2Icon } from "@chakra-ui/icons";
import { colors } from "../../utils/theme";
import { useTransitFilteredQuery } from "../../hooks/query";
import { GET_RECURSOS } from "../../utils/query/transit";
import { useQuery } from "@apollo/client";
import getCountryContent from "../../utils/country";

const DocumentationByCountry = () => {
  const { countryID } = useParams();
  const [filter, setFilter] = useState("");

  const { data } = useQuery(GET_RECURSOS(countryID));

  const keys = ["nombre", "descripcion"];

  const dataByCountry = data?.recursos?.data?.map((item) => ({
    nombre: item?.attributes?.name,
    descripcion: item?.attributes?.description,
    esExterno: item?.attributes?.esExterno,
    url: item?.attributes?.esExterno
      ? item?.attributes?.link
      : item?.attributes?.document?.data?.attributes?.url,
    subCategoria: item?.attributes?.subcategories?.data?.[0].attributes?.name,
  }));

  let dataSearch =
    dataByCountry?.filter((item) => {
      return keys.some((key) =>
        item[key]
          .toString()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(
            filter
              .toString()
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          )
      );
    }) ?? [];

  const searchText = (event) => {
    return setFilter(event.target.value);
  };

  return (
    <Box width="100%" padding="40px">
      <Stack
        spacing={4}
        width="100%"
        margin="auto"
        maxWidth="800px"
        direction="column"
      >
        <Heading
          padding="10px 0px 10px 0px"
          as="h1"
          size="lg"
          fontFamily="Oswald"
        >
          {`Documentos de ${getCountryContent({
            countryID,
            capitalize: true,
          })}`}
        </Heading>
        <Divider orientation="horizontal" />
        <Stack>
          <InputGroup>
            <Input
              type="text"
              id="buscar"
              value={filter}
              onChange={searchText.bind(this)}
              placeholder="Buscar..."
            />
            <InputRightElement
              sx={{ zIndex: -1 }}
              children={<Search2Icon color={colors.green[500]} />}
            />
          </InputGroup>
        </Stack>
        <Stack py={3} px={3}>
          <Stack
            w="100%"
            padding="10px 0px 10px 0px"
            display="flex"
            mt="4"
            alignItems="center"
            justifyContent="space-around"
          >
            {dataSearch?.map((source) => (
              <HStack
                shadow="md"
                borderWidth="1px"
                width="100%"
                spacing={8}
                padding="8"
                direction={{ base: "column", md: "row" }}
                key={source.id}
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack transition="ease-in" direction="column" spacing={0}>
                  <Text fontFamily="Oswald" fontSize="2xl">
                    {source.nombre}
                  </Text>

                  <Text fontFamily="Montserrat Medium">
                    {parse(source.descripcion)}
                  </Text>
                  <Stack direction="row">
                    <Heading color="gray" as="h6" size="xs">
                      Catalogado en:
                    </Heading>
                    <Badge color={colors.green[700]}>
                      {source.subCategoria}
                    </Badge>
                  </Stack>
                </Stack>
                {source.archivos === "" ? null : (
                  <Link
                    size="xl"
                    download
                    borderRadius={8}
                    href={source.url}
                    padding={4}
                    bgColor="#ccc"
                    minW={150}
                    textAlign="center"
                    target="_blank"
                    rel="noreferrer noopener"
                    fontFamily="Montserrat Medium"
                    _hover={{ bgColor: "green.700", color: "white" }}
                  >
                    Descargar
                    <DownloadIcon ml={2} />
                  </Link>
                )}
              </HStack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default DocumentationByCountry;
