// REACT
import React from "react";

// CHAKRA UI COMONENTS
import { Box, Stack, Text, Select } from "@chakra-ui/react";
import YearSelect from "../../../../../../components/yearSelect";
import MonthPicker from "../../../../../../components/monthPicker";

const Header = ({ returns, handleChange, handleMonts }) => {
  return (
    <Box width="100%" padding="40px">
      {/* CONTAINER */}
      <Stack
        margin="auto"
        maxWidth="800px"
        direction="row"
        alignItems={{ base: "flex-start", md: "center" }}
        justifyContent={{ base: "flex-start", md: "center" }}
      >
        {/* NUMBER */}
        <Stack>
          <Text
            lineHeight="1"
            fontFamily="Oswald"
            fontSize={{ base: "4em", md: "8em" }}
          >
            3
          </Text>
        </Stack>

        {/* TITLE AND SELECTS */}
        <Stack spacing="16px">
          <Text
            fontFamily="Oswald"
            fontSize={{ base: "2xl", md: "4xl" }}
            lineHeight={{ base: "1.4", md: "1" }}
          >
            DEPARTAMENTOS CON MÁS O MENOS NIÑEZ Y ADOLESCENCIA RETORNADA
          </Text>

          <Stack
            alignItems="center"
            justifyContent="space-between"
            direction={{ base: "column", md: "row" }}
          >
            {/* SELECT YEAR */}
            <YearSelect
              minWidth={{ base: "100%", md: "10%" }}
              currentYear={returns.year}
              handleYear={handleChange}
            />

            {/* SELECT PERIOD */}
            <MonthPicker
              onAccept={handleMonts}
              minWidth={{ base: "100%", md: "30%" }}
            />

            {/* SELECT LIST */}
            <Select
              name="list"
              onChange={handleChange}
              value={returns.list || "default"}
              fontSize="2xl"
              lineHeight="1.8"
              fontWeight="600"
              fontFamily="Times"
              letterSpacing="1.2px"
              bgColor="#bcd6d6"
            >
              <option value="default">Elegir</option>
              <option value="asc">Más retornados</option>
              <option value="desc">Menos retornados</option>
            </Select>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Header;
