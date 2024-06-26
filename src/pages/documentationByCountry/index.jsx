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
import { motion } from "framer-motion";
import Libreria from "../../assets/libreria.jpg";
import { useTransitFilteredQuery } from "../../hooks/query";
import { GET_RECURSOS } from "../../utils/query/transit";
import { useQuery } from "@apollo/client";

const DocumentationByCountry = () => {
  const { countryID } = useParams();
  const titulo = countryID.charAt(0).toUpperCase() + countryID.slice(1);
  const [filter, setFilter] = useState("");

  const { data } = useQuery(GET_RECURSOS(countryID));

  const downloadDocument = (id) => () =>
    fetch(id)
      .then((res) => res.blob())
      .then((blob) => {
        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(blob);
        a.download = `${id}`;
        a.click();
      });

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

  console.log({dataByCountry})
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

  const MotionFlex = motion(Flex);

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
          {`Documentos de ${titulo}`}
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
        <MotionFlex
          py={3}
          px={3}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          whileInView={{ opacity: 1 }}
        >
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
                    as={source?.esExterno ? "a" : "button"}
                    borderRadius={8}
                    href={source.url}
                    padding={4}
                    bgColor="#ccc"
                    minW={150}
                    textAlign="center"
                    target="_blank"
                    onClick={
                      source.esExterno ? null : downloadDocument(source.url)
                    }
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
        </MotionFlex>
      </Stack>
    </Box>
  );
};

export default DocumentationByCountry;
