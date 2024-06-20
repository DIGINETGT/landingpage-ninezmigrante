import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { DownloadIcon, Search2Icon } from "@chakra-ui/icons";
import { colors } from "../../utils/theme";
import { motion } from "framer-motion";
import Libreria from "../../assets/libreria.jpg";

const DocumentationByCountry = () => {
  const { countryID } = useParams();
  const titulo = countryID.charAt(0).toUpperCase() + countryID.slice(1);
  const [dataByCountry, setDataByCountry] = useState([]);
  const [filter, setFilter] = useState("");

  const downloadDocument = (id) => () =>
    fetch(`${import.meta.env.VITE_APP_API_URL}/uploads/recursos/${id}`)
      .then((res) => res.blob())
      .then((blob) => {
        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(blob);
        a.download = `${id}`;
        a.click();
      });

  const keys = ["nombre", "descripcion"];

  let dataSearch = dataByCountry?.filter((item) => {
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
  });

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
          {`umentos de ${titulo}`}
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
            {dataSearch.map((source) => (
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
                    {source.descripcion}
                  </Text>
                  <Stack direction="row">
                    <Heading color="gray" as="h6" size="xs">
                      Catalogado en:
                    </Heading>
                    <Badge color={colors.green[700]}>
                      {source.subCategoria.nombre}
                    </Badge>
                  </Stack>
                </Stack>
                {source.archivos === "" ? null : (
                  <Button
                    size="xl"
                    padding={4}
                    bgColor="#ccc"
                    rightIcon={<DownloadIcon />}
                    fontFamily="Montserrat Medium"
                    onClick={downloadDocument(source.id)}
                    _hover={{ bgColor: "green.700", color: "white" }}
                  >
                    Descargar
                  </Button>
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
