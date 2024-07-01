import React, { useState } from "react";

import { Box, Select, Stack, Text } from "@chakra-ui/react";

import Options from "./components/options";

const SelectOptions = ({ onChange, satisticsRef }) => {
  const [countValue, setCountValue] = useState("0");

  const handleChange = (ev) => setCountValue(ev.target.value || "0");

  return (
    <Stack
      alignItems="center"
      bgColor="blue.500"
      padding={{ base: "40px 24px", md: "80px 40px" }}
    >
      <Stack direction="column" justifyContent="center" alignItems="center">
        <Text
          fontSize={{ base: "5xl", md: "6xl" }}
          lineHeight="1.2"
          color="green.700"
          marginBottom="40px"
          textAlign="center"
          fontFamily="Oswald"
        >
          Comparar datos
        </Text>
      </Stack>

        <Stack width={350} spacing={4} direction="row" alignItems="center" mb={10}>
          <Text fontFamily="Montserrat Medium" fontSize="2xl">
            ¿Cuantos países deseas comparar?
          </Text>
          <Select
            name="count"
            fontSize="2xl"
            lineHeight="1.8"
            fontWeight="600"
            width={100}
            height="70px"
            fontFamily="Times"
            letterSpacing="1.2px"
            onChange={handleChange}
            bgColor="rgba(255,255,255,0.5)"
          >
            <option value="0">-</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </Select>
        </Stack>
      

      {countValue !== "0" && (
        <Stack
          gap="40px"
          alignItems="center"
          justifyContent="center"
          direction={{ base: "column", md: "row" }}
        >
          {Array.from({ length: Number(countValue) }).map((_, index) => (
            <Options
              key={index}
              id={String(index + 1)}
              onChange={onChange}
              satisticsRef={satisticsRef}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default SelectOptions;
